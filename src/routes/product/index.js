const express = require('express');
const productController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(productController.createProduct))



module.exports = router