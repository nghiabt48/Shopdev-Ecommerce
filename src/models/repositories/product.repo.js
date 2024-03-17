'use strict';

const { default: mongoose } = require('mongoose');
const { product, electronic, clothing} = require('../../models/product.model')

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
const unPublishProductByShop = async({ query, limit, skip}) => {
  const foundProduct = await product.findOne({
    product_shop: new mongoose.Types.ObjectId(product_shop),
    _id: new mongoose.Types.ObjectId(product_id)
  })
  if(!foundProduct) return null
  foundProduct.isDraft = true
  foundProduct.isPublished = false
  const { modifiedCount} = await foundProduct.update(foundProduct);
  return modifiedCount
}
const publishProductByShop = async({ product_shop, product_id}) => {
  const foundProduct = await product.findOne({
    product_shop: new mongoose.Types.ObjectId(product_shop),
    _id: new mongoose.Types.ObjectId(product_id)
  })
  if(!foundProduct) return null
  foundProduct.isDraft = false
  foundProduct.isPublished = true
  const { modifiedCount} = await foundProduct.update(foundProduct);
  return modifiedCount
}

const queryProduct = async ({ query, limit, skip}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({ updateAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
}
module.exports = { 
  findAllDraftsForShop, 
  publishProductByShop, 
  findAllPublishForShop, 
  unPublishProductByShop, 
  searchProducts
}