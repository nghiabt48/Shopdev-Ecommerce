'use strict';
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  cloud_name: 'dcs2jmnlr',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Log the configuration
module.exports = cloudinary
