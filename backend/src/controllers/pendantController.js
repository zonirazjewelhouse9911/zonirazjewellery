const PendantConfig = require('../models/pendantConfigModel');
const assetInventory = require('../config/pendantAssetInventory.json');
const cloudinary = require('../config/cloudinary');

/**
 * Get global pendant configuration and letter asset inventory.
 */
exports.getConfig = async (req, res) => {
  try {
    let dbConfig = await PendantConfig.findOne({ configId: 'global_pendant_config' });
    if (!dbConfig) {
      dbConfig = {
        maxNameLength: 10,
        basePrice: 3000,
        makingCharge: 500,
        chainPrice: 1000,
        materials: {
          gold_14k: { name: 'Yellow Gold 14KT', perLetterPrice: 2000, basePrice: 3000 },
          gold_18k: { name: 'Yellow Gold 18KT', perLetterPrice: 2500, basePrice: 4000 },
          diamond: { name: 'Diamond SI-IJ Real Gold', perLetterPrice: 3500, basePrice: 6000 }
        }
      };
    }
    return res.status(200).json({
      success: true,
      inventory: assetInventory,
      config: dbConfig
    });
  } catch (err) {
    console.error('Error fetching pendant config:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Server-side Authoritative Price Calculation.
 */
exports.calculatePrice = async (req, res) => {
  try {
    const { name, style = 'small_hook', material = 'gold_18k', includeChain = true } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
    if (!cleanName) {
      return res.status(400).json({ success: false, error: 'Name must contain valid A-Z characters' });
    }

    // Material price calculation mapping
    const materialPricing = {
      gold_14k: { basePrice: 3000, perLetter: 2000 },
      gold_18k: { basePrice: 4000, perLetter: 2500 },
      diamond: { basePrice: 6000, perLetter: 3500 }
    };

    const matInfo = materialPricing[material] || materialPricing.gold_18k;
    const letterCount = cleanName.length;
    const basePrice = matInfo.basePrice;
    const letterSubtotal = letterCount * matInfo.perLetter;
    const makingCharge = 500;
    const chainCost = includeChain ? 1000 : 0;
    const totalPrice = basePrice + letterSubtotal + makingCharge + chainCost;

    return res.status(200).json({
      success: true,
      totalPrice,
      breakdown: {
        basePrice,
        perLetterPrice: matInfo.perLetter,
        letterCount,
        letterSubtotal,
        makingCharge,
        chainCost
      }
    });
  } catch (err) {
    console.error('Error calculating pendant price:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Upload high-res canvas composition preview snapshot to Cloudinary on Add to Cart.
 */
exports.uploadPreview = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ success: false, error: 'imageBase64 is required' });
    }

    const uploadRes = await cloudinary.uploader.upload(imageBase64, {
      folder: 'zoniraz/pendant_previews',
      format: 'png'
    });

    return res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id
    });
  } catch (err) {
    console.error('Error uploading preview image:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Update Admin Config / Calibration.
 */
exports.updateConfig = async (req, res) => {
  try {
    const { maxNameLength, basePrice, makingCharge, chainPrice, letterCalibrations } = req.body;
    let configDoc = await PendantConfig.findOne({ configId: 'global_pendant_config' });
    if (!configDoc) {
      configDoc = new PendantConfig({ configId: 'global_pendant_config' });
    }

    if (maxNameLength) configDoc.maxNameLength = maxNameLength;
    if (basePrice) configDoc.basePrice = basePrice;
    if (makingCharge) configDoc.makingCharge = makingCharge;
    if (chainPrice) configDoc.chainPrice = chainPrice;
    if (letterCalibrations) configDoc.letterCalibrations = letterCalibrations;

    await configDoc.save();
    return res.status(200).json({ success: true, message: 'Pendant configuration updated successfully', data: configDoc });
  } catch (err) {
    console.error('Error updating pendant config:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
