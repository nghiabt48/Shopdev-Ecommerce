const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');
const router = express.Router()

router.post('/product', asyncHandler(uploadController.uploadFile))

router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadMultipleFiles))

// S3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileFromLocalS3))



module.exports = router