const express = require('express');
const discountController = require('../../controllers/discount.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()

// get discount amount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))

router.get('/:code/products', asyncHandler(discountController.getAllProductsInDiscountCode))
// require auth
router.use(authenticationV2)
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))


module.exports = router