const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const MEDIA_UPLOAD_URL = process.env.MEDIA_UPLOAD_URL || 'https://media.zoniraz.com/api/upload-asset';
const MEDIA_BASE_URL = process.env.MEDIA_BASE_URL || 'https://media.zoniraz.com';
const MEDIA_UPLOAD_SECRET = process.env.MEDIA_UPLOAD_SECRET || '64d763bd8c5e8fb4f96a99a33e48e0a84675e4205329fc2702e838468fdc38a2';

/**
 * Upload a file from Multer to the media VPS server.
 * @param {Object} file - Multer file object (has .path, .filename, .originalname, .mimetype, etc.)
 * @param {string} subfolder - Target subfolder (e.g. 'zoniraz' or 'zoniraz/pendant_previews')
 * @returns {Promise<{ url: string, filename: string }>}
 */
async function uploadToMediaServer(file, subfolder = 'zoniraz') {
  try {
    const formData = new FormData();
    formData.append('subfolder', subfolder);
    formData.append('filename', file.filename);

    if (file.path && fs.existsSync(file.path)) {
      formData.append('file', fs.createReadStream(file.path), {
        filename: file.filename,
        contentType: file.mimetype
      });
    } else if (file.buffer) {
      formData.append('file', file.buffer, {
        filename: file.filename,
        contentType: file.mimetype
      });
    } else {
      throw new Error('File has no accessible path or buffer');
    }

    const response = await axios.post(MEDIA_UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'x-media-token': MEDIA_UPLOAD_SECRET
      },
      timeout: 30000,
      maxContentLength: 50 * 1024 * 1024,
      maxBodyLength: 50 * 1024 * 1024
    });

    if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
      return {
        url: response.data.data[0].url,
        filename: response.data.data[0].filename
      };
    }

    throw new Error(response.data?.error || 'Unknown response from media server');
  } catch (error) {
    const errMessage = error.response?.data?.error || error.message;
    console.error(`[MediaStorageService] Upload failed for ${file.filename}:`, errMessage);
    throw new Error(`Media server upload failed: ${errMessage}`);
  }
}

/**
 * Upload base64 image data directly to media VPS server.
 * @param {string} base64String - Base64 encoded image
 * @param {string} filename - Target filename
 * @param {string} subfolder - Target subfolder (e.g. 'zoniraz/pendant_previews')
 * @returns {Promise<{ url: string, filename: string }>}
 */
async function uploadBase64ToMediaServer(base64String, filename, subfolder = 'zoniraz/pendant_previews') {
  try {
    const base64Url = MEDIA_UPLOAD_URL.replace(/\/upload-asset$/, '/upload-base64');
    const response = await axios.post(base64Url, {
      imageBase64: base64String,
      filename,
      subfolder
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-media-token': MEDIA_UPLOAD_SECRET
      },
      timeout: 30000,
      maxContentLength: 50 * 1024 * 1024,
      maxBodyLength: 50 * 1024 * 1024
    });

    if (response.data && response.data.success) {
      return {
        url: response.data.url,
        filename: response.data.filename
      };
    }

    throw new Error(response.data?.error || 'Unknown response from media server');
  } catch (error) {
    const errMessage = error.response?.data?.error || error.message;
    console.error(`[MediaStorageService] Base64 upload failed for ${filename}:`, errMessage);
    throw new Error(`Media server base64 upload failed: ${errMessage}`);
  }
}

module.exports = {
  uploadToMediaServer,
  uploadBase64ToMediaServer,
  MEDIA_BASE_URL
};
