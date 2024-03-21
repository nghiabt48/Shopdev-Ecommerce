const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");
class DiscountController {
  createDiscountCode = async(req, res, next) => {
    new SuccessResponse({
      message: "Create Discount Code Successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }
  getAllDiscountCodes = async(req, res, next) => {
    new SuccessResponse({
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }
  getDiscountAmount = async(req, res, next) => {
    new SuccessResponse({
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }
  getAllProductsInDiscountCode = async(req, res, next) => {
    new SuccessResponse({
      metadata: await DiscountService.getAllProductsInDiscountCode({
        ...req.query,
        code: req.params.code
      })
    }).send(res)
  }
  getAllDiscountCodesByShop = async(req, res, next) => {
    new SuccessResponse({
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        code: req.params.code
      })
    }).send(res)
  }
}
module.exports = new DiscountController()