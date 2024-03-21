const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
class CartController {
  addToCart = async(req, res, next) => {
    new SuccessResponse({
      message: "Add Product To Cart Successfully",
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }
  updateCartItem = async(req, res, next) => {
    new SuccessResponse({
      metadata: await CartService.updateCart(req.body)
    }).send(res)
  }
  getCartDetail = async(req, res, next) => {
    new SuccessResponse({
      metadata: await CartService.getUserCart(req.query)
    }).send(res)
  }
  deleteItemFromCart = async(req, res, next) => {
    new SuccessResponse({
      metadata: await CartService.deleteProductFromCart(req.body)
    }).send(res)
  }
}
module.exports = new CartController()