const express = require('express');
const productController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/asyncHandler');
const router = express.Router()


router.get('/search/:keywords', asyncHandler(productController.getListPublishedProduct))

router.use(authenticationV2)
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))



module.exports = router