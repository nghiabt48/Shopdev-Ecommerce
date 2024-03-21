'use strict';

const { NotFoundError, AuthFailureRequestError, BadRequestError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/* 
  Features:
  1 - Add product to cart [User]
  2 - Increase / Reduce product quantity [User]
  3 - Get list of products in cart [User]
  4 - Delete cart [User]
  5 - Delete cart item [User]
*/
class CartService {
  static async createUserCart({ userId, product }){
    const query = { cart_userId: userId, cart_state: 'active'},
    updateOrInsert = {
      $addToSet: {
        cart_products: product  
      }
    }, options = { upsert: true, new: true}
    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }
  static async updateProductQuantityInCart({ userId, product }){
    const { productId, quantity } = product
    const query = { 
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    },
    updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, options = { upsert: true, new: true}
    return await cart.findOneAndUpdate(query, updateSet, options)
  }
  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({
      cart_userId: userId,
    })
    if(!userCart) {
      return await CartService.createUserCart({ userId, product })
    }
    // cart_products is empty
    if(!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }
    // cart exists and cart_products already have product that user just added
    // increase quantity of this product in cart_products
    return await CartService.updateProductQuantityInCart({ userId, product })
  }
  static async updateCart({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
    const foundProduct = await getProductById(productId)
    if(!foundProduct) throw new NotFoundError("Product not exists")
    if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError("Product do not belong to the shop")
    }
    if(quantity === 0) {
      // delete product from cart
      await CartService.deleteProductFromCart({userId, productId})
    }
    return await CartService.updateProductQuantityInCart({ userId, product: {
      productId,
      quantity: quantity - old_quantity
    }})
  }
  static async deleteProductFromCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active'},
    updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }
  static async getUserCart({ userId }) {
    return await cart.findOne({
      cart_userId: +userId
    }).lean()
  }
}
module.exports = CartService