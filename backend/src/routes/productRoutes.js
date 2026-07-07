const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Upload Endpoint
router.post('/upload', upload.array('file'), productController.uploadImages);

// Product REST endpoints
router.get('/admin/products', productController.getProducts);
router.get('/admin/products/:id', productController.getProductById);
router.post('/admin/products', productController.createProduct);
router.patch('/admin/products/:id', productController.updateProduct);

module.exports = router;
