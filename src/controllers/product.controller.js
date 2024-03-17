const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Product Successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {...req.body,
      product_shop: req.user.userId})
    }).send(res);
  }
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product Successfully',
      metadata: await ProductService.publishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id
    })
    }).send(res);
  }
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unPublish Product Successfully',
      metadata: await ProductService.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id
    })
    }).send(res);
  }

  /**
   * @desc Get All Drafts for shop
   * @param { Number } limit 
   * @param { Number } skip 
   * @return { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      metadata: await ProductService.findAllDraftsForShop({product_shop: req.user.userId})
    }).send(res);
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      metadata: await ProductService.findAllPublishForShop({product_shop: req.user.userId})
    }).send(res);
  }
  getListPublishedProduct = async (req, res, next) => {
    new SuccessResponse({
      metadata: await ProductService.searchProducts(req.params)
    }).send(res);
  }
}
module.exports = new ProductController()