const express = require('express');
const cartController = require('../../controllers/cart.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()

router.post('/', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.updateCartItem))
router.delete('/', asyncHandler(cartController.deleteItemFromCart))
router.get('/', asyncHandler(cartController.getCartDetail))


module.exports = router