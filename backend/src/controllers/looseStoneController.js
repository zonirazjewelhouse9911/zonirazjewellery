const LooseStone = require('../models/looseStoneModel');

// GET all loose stones
exports.getAllLooseStones = async (req, res) => {
  try {
    const filter = {};
    if (req.query.stone_type) {
      filter.stone_type = req.query.stone_type;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const stones = await LooseStone.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: stones
    });
  } catch (error) {
    console.error("Error fetching loose stones:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch loose stones"
    });
  }
};

// GET single loose stone by ID
exports.getLooseStoneById = async (req, res) => {
  try {
    const stone = await LooseStone.findById(req.params.id);
    if (!stone) {
      return res.status(404).json({
        success: false,
        message: "Loose stone not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: stone
    });
  } catch (error) {
    console.error("Error fetching loose stone:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch loose stone"
    });
  }
};

// POST create loose stone
exports.createLooseStone = async (req, res) => {
  try {
    const {
      title,
      stone_type,
      shape,
      weight_carat,
      quality,
      color,
      cut_grade,
      price,
      discount,
      stock,
      certificate_no,
      mine_name,
      country_of_origin,
      description,
      image,
      images,
      status
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required fields."
      });
    }

    const stoneImages = Array.isArray(images) ? images : (image ? [image] : []);
    const mainImage = stoneImages.length > 0 ? stoneImages[0] : (image || '');

    const newStone = new LooseStone({
      title,
      stone_type: stone_type || 'diamond',
      shape: shape || 'Round',
      weight_carat: Number(weight_carat) || 0,
      quality: quality || 'GH-VS',
      color: color || 'G',
      cut_grade: cut_grade || 'Excellent',
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      stock: stock !== undefined ? Number(stock) : 1,
      certificate_no: certificate_no || '',
      mine_name: mine_name || '',
      country_of_origin: country_of_origin || '',
      description: description || '',
      image: mainImage,
      images: stoneImages,
      status: status || '1'
    });

    await newStone.save();
    return res.status(201).json({
      success: true,
      message: "Loose stone created successfully",
      data: newStone
    });
  } catch (error) {
    console.error("Error creating loose stone:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create loose stone"
    });
  }
};

// PUT update loose stone
exports.updateLooseStone = async (req, res) => {
  try {
    const stone = await LooseStone.findById(req.params.id);
    if (!stone) {
      return res.status(404).json({
        success: false,
        message: "Loose stone not found"
      });
    }

    const fields = [
      'title', 'stone_type', 'shape', 'weight_carat', 'quality', 'color',
      'cut_grade', 'price', 'discount', 'stock', 'certificate_no',
      'mine_name', 'country_of_origin', 'description', 'image', 'images', 'status'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['weight_carat', 'price', 'discount', 'stock'].includes(field)) {
          stone[field] = Number(req.body[field]) || 0;
        } else {
          stone[field] = req.body[field];
        }
      }
    });

    if (Array.isArray(stone.images) && stone.images.length > 0) {
      stone.image = stone.images[0];
    }

    await stone.save();
    return res.status(200).json({
      success: true,
      message: "Loose stone updated successfully",
      data: stone
    });
  } catch (error) {
    console.error("Error updating loose stone:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update loose stone"
    });
  }
};

// DELETE loose stone
exports.deleteLooseStone = async (req, res) => {
  try {
    const stone = await LooseStone.findByIdAndDelete(req.params.id);
    if (!stone) {
      return res.status(404).json({
        success: false,
        message: "Loose stone not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Loose stone deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting loose stone:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete loose stone"
    });
  }
};
