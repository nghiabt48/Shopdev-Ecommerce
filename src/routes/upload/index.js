const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()

router.post('/product', asyncHandler(uploadController.uploadFile))



module.exports = router