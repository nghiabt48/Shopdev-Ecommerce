'use strict';

const { default: mongoose } = require('mongoose');
const { product, electronic, clothing} = require('../../models/product.model')
const { getUnselectedData} = require('../../utils');
const { AuthFailureRequestError } = require('../../core/error.response');

const findAllDraftsForShop = async({ query, limit, skip}) => {
  return await queryProduct({ query, limit, skip})
}
const searchProducts = async({ keywords}) => {
  const regex = new RegExp(keywords)
  const results = await product.find(
  {
    isDraft: false,
    isPublished: true,
    $text: { $search: regex}
  },
  {
    score: { $meta: 'textScore'}
  }
  ).sort({score: { $meta: 'textScore'}}).lean()
  return results
}
const findAllPublishForShop = async({ query, limit, skip}) => {
  return await queryProduct({ query, limit, skip})
}
const unPublishProductByShop = async({ product_shop, product_id}) => {
  // check if this shop is the product's owner
  const productOwner = await product.findById(product_id).lean()
  if(productOwner.product_shop !== product_shop) throw new AuthFailureRequestError("You are not the owner of this product")
  const updatedProduct = await product.findOneAndUpdate({
    product_shop: new mongoose.Types.ObjectId(product_shop),
    _id: new mongoose.Types.ObjectId(product_id)
  }, {
    isDraft: true,
    isPublished: false
  }, { returnOriginal: false});
  return updatedProduct ? 1 : 0;
}
const publishProductByShop = async({ product_shop, product_id}) => {
  // check if this shop is the product's owner
  const productOwner = await product.findById(product_id).lean()
  if(productOwner.product_shop !== product_shop) throw new AuthFailureRequestError("You are not the owner of this product")

  const updatedProduct = await product.findOneAndUpdate({
    product_shop: new mongoose.Types.ObjectId(product_shop),
    _id: new mongoose.Types.ObjectId(product_id)
  }, {
    isDraft: false,
    isPublished: true
  }, { returnOriginal: false});
  return updatedProduct ? 1 : 0;
}
const findAllProducts = async ({limit, sort, page, filter, select}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1} : { _id: 1}
  const products = await product.find( filter )
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(select)
  .lean()
  return products
}
const updateProductById = async({ product_id, payload, model, isNew = true }) => {
  // Check if this shop is the same as the owner of the product
  const productOwner = await model.findById(product_id).lean()
  if(productOwner.product_shop !== payload.product_shop) throw new AuthFailureRequestError("You are not the owner of this product")
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}
const findProduct = async ({ product_id, unselect }) => {
  return await product.findById(product_id).select(getUnselectedData(unselect))
}
const queryProduct = async ({ query, limit, skip}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({ updateAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
}
const getProductById = async(productId) => {
  return await product.findById(productId).lean()
}
const serverCheckProduct = async (product) => {
  return await Promise.all(product.map(async product => {
    const foundProduct = await getProductById(product.productId)
    if(foundProduct) return {
      price: foundProduct.product_price,
      quantity: product.quantity,
      productId: product.productId
    }
  }))
}
module.exports = { 
  findAllDraftsForShop, 
  publishProductByShop, 
  findAllPublishForShop, 
  unPublishProductByShop, 
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  serverCheckProduct
}