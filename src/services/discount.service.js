'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { findAllDiscountCodeSelected, findAllDiscountCodeUnselected, checkDiscountExists } = require("../models/repositories/discount.repo");
const { convertToObjectId } = require("../utils");
const { findAllProducts } = require("./product.service");

/* 
  1 - Generate discount code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discount codes [User | Shop]
  4 - Verify discount code [User],
  5 - Delete discount code [Shop | Admin]
  6 - Cancel discount code [User]
*/
class DiscountService {
  static async createDiscountCode(payload) {
    const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_uses, uses_count, max_uses_per_user, users_used } = payload;
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must not greater than end date");
    }
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists")
    }
    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_used_count: uses_count,
      // 
      discount_users_used: users_used,
      // how many times a user can use the discount
      discount_max_uses_per_user: max_uses_per_user,
      // minimum order amount to apply the discount
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectId(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      // which products can use the discount
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount
  }
  static async updateDiscount() {

  }
  // Get list products by discount
  static async getAllProductsInDiscountCode({ code, shopId, limit, page }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists')
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      // get all products
      products = findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    else if (discount_applies_to === 'specific') {
      products = findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    return products
  }
  // get all discount code by shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeSelected({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true
      },
      select: ['discount_code', 'discount_name'],
      model: discount
    })
    return discounts
  }
  // apply discount code
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount) throw new NotFoundError("Discount not exists")
    const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_users_used, discount_type, discount_value, discount_max_uses_per_user } = foundDiscount
    if (!discount_is_active) throw new BadRequestError("Discount expired")
    if (!discount_max_uses) throw new BadRequestError("Discount reached max uses")
    if (new Date() < new Date(discount_start_date || new Date() > new Date(discount_end_date))) throw new BadRequestError("Discount expired")
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)
      if (totalOrder < discount_min_order_value) throw new BadRequestError(`Discount requires a minimun order value of ${discount_min_order_value}`)
    }
    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(user => user.userId === userId)
      if (userDiscount) {

      }
    }
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }
  static async deleteDiscountCode({ shopId, code }) {

    const deleted = await discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    })
    return deleted
  }
  static async cancelDiscountCode({ shopId, code, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectId(shopId)
      }
    })
    if (!foundDiscount) throw new NotFoundError("Discount not exists")
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_users_used: -1
      }
    })
    return result
  }
}
module.exports = DiscountService