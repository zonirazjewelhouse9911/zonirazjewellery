const mongoose = require('mongoose');

const letterCalibrationSchema = new mongoose.Schema({
  letter: { type: String, required: true },
  style: { type: String, required: true, enum: ['big', 'small_hook', 'small_no_hook'] },
  positionRole: { type: String, required: true, enum: ['single', 'first', 'middle', 'last', 'all'] },
  publicId: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  price: { type: Number, default: 2000 },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 150 },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  spacing: { type: Number, default: -16 },
  scale: { type: Number, default: 1 },
  rotation: { type: Number, default: 0 }
});

const pendantConfigSchema = new mongoose.Schema({
  configId: { type: String, default: 'global_pendant_config', unique: true },
  maxNameLength: { type: Number, default: 10 },
  basePrice: { type: Number, default: 3000 },
  makingCharge: { type: Number, default: 500 },
  chainPrice: { type: Number, default: 1000 },
  materials: {
    gold_14k: {
      name: { type: String, default: 'Yellow Gold 14KT' },
      multiplier: { type: Number, default: 1.0 },
      basePrice: { type: Number, default: 3000 }
    },
    gold_18k: {
      name: { type: String, default: 'Yellow Gold 18KT' },
      multiplier: { type: Number, default: 1.25 },
      basePrice: { type: Number, default: 4000 }
    },
    diamond: {
      name: { type: String, default: 'Diamond SI-IJ Real Gold' },
      multiplier: { type: Number, default: 1.8 },
      basePrice: { type: Number, default: 7500 }
    }
  },
  letterCalibrations: [letterCalibrationSchema]
}, { timestamps: true });

const PendantConfig = mongoose.model('PendantConfig', pendantConfigSchema);
module.exports = PendantConfig;
