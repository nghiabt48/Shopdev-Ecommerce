'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { serverCheckProduct } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");

/* can be processed without log in
  {
    cartId,
    userId,
    shop_order_ids:[
      {
        shopId,
        shop_discounts: [
          {
            shopId,
            discountId
            code
          }
        ],
        item_products: [
          {
            price,
            quantity,
            productId
          }
        ]
      }
    ]
  }
*/
class CheckoutService {
  static async checkoutReview({
    cartId, userId, shop_order_ids
  }) {
    const foundCart = findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not exists")
    const checkout_order = {
      totalPrice: 0,
      delivery_fee: 0,
      totalDiscount: 0,
      totalCheckout: 0, // tong thanh toan
    }, shop_order_ids_new = []
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
      const checkProductServer = await serverCheckProduct(item_products)
      if (!checkProductServer[0]) throw new BadRequestError("Wrong Order")
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)
      checkout_order.totalPrice += checkoutPrice
      const itemCheckout = {
        shopId,
        shop_discounts,
        rawPrice: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }
      if(shop_discounts.length > 0) {
        // only 1 discount
        const { discount = 0} = await DiscountService.getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: checkProductServer
        })
        checkout_order.totalDiscount += discount
        if(discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }

  }
}
module.exports = CheckoutService