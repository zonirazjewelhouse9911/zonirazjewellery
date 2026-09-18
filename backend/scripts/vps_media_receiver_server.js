const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;
const MEDIA_UPLOAD_SECRET = process.env.MEDIA_UPLOAD_SECRET || '64d763bd8c5e8fb4f96a99a33e48e0a84675e4205329fc2702e838468fdc38a2';
const UPLOADS_BASE = '/var/www/zoniraz-media/uploads';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Auth middleware for write operations
function authenticate(req, res, next) {
  const token = req.headers['x-media-token'] || req.query.token;
  if (!token || token !== MEDIA_UPLOAD_SECRET) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid media upload token' });
  }
  next();
}

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Configure Multer for disk writing directly to uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = req.body.subfolder || 'zoniraz';
    subfolder = subfolder.replace(/\.\./g, '').replace(/^\/+/, '');
    const targetDir = path.join(UPLOADS_BASE, subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const requestedName = req.body.filename || file.originalname;
    const cleanName = path.basename(requestedName);
    cb(null, cleanName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// POST /api/upload-asset (Single or Multiple Files)
app.post('/api/upload-asset', authenticate, upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    let subfolder = req.body.subfolder || 'zoniraz';
    subfolder = subfolder.replace(/\.\./g, '').replace(/^\/+/, '');

    const uploaded = [];
    for (const file of req.files) {
      try {
        fs.chmodSync(file.path, 0o644);
      } catch (e) {}

      const publicUrl = `https://media.zoniraz.com/uploads/${subfolder}/${file.filename}`;
      uploaded.push({
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        url: publicUrl
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Uploaded successfully',
      data: uploaded
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload-base64 (For canvas snapshots / pendant previews)
app.post('/api/upload-base64', authenticate, (req, res) => {
  try {
    const { imageBase64, filename, subfolder = 'zoniraz/pendant_previews' } = req.body;
    if (!imageBase64 || !filename) {
      return res.status(400).json({ success: false, error: 'imageBase64 and filename are required' });
    }

    const cleanSubfolder = subfolder.replace(/\.\./g, '').replace(/^\/+/, '');
    const cleanFilename = path.basename(filename);
    const targetDir = path.join(UPLOADS_BASE, cleanSubfolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const targetPath = path.join(targetDir, cleanFilename);

    fs.writeFileSync(targetPath, base64Data, 'base64');
    try {
      fs.chmodSync(targetPath, 0o644);
    } catch (e) {}

    const publicUrl = `https://media.zoniraz.com/uploads/${cleanSubfolder}/${cleanFilename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: cleanFilename
    });
  } catch (err) {
    console.error('Base64 Upload Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Zoniraz Media Receiver running on http://127.0.0.1:${PORT}`);
});
