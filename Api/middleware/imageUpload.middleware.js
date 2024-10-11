const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dgepjhmuc',
  api_key: '149154968981991',
  api_secret: 'pM1LWMLbuJDza0eFb4s80Mb4Few',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elitnexus',
    upload_preset: 'elitnexus',
  },
});

const upload = multer({
  storage,
});

module.exports = upload;