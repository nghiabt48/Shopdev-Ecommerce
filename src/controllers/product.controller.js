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
  
  
}
module.exports = new ProductController()