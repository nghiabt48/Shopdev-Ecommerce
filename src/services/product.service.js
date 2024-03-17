'use strict';
const { product, clothing, electronic } = require('../models/product.model.js')
const { BadRequestError } = require('../core/error.response.js');
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProducts } = require('../models/repositories/product.repo.js');

// Define factory class to create product
class ProductFactory {
  static productRegistry = {}
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError('Invalid product type: ' + type)
    return new productClass(payload).createProduct()
  }

  static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }
  static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async publishProductByShop({ product_shop, product_id}) {
    return await publishProductByShop({ product_shop, product_id})
  }
  static async unPublishProductByShop({ product_shop, product_id}) {
    return await unPublishProductByShop({ product_shop, product_id})
  }
  static async searchProducts({ keywords}) {
    return await searchProducts({ keywords })
  }
}
// Define basic product class
class Product {
  constructor({product_name, product_thumb, product_price, product_description, product_type, product_shop, product_quantity, product_attributes}) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_quantity = product_quantity;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
      return await product.create({...this, _id: product_id});
  }
}
// Define sub-class for each product_type
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({...this.product_attributes, 
      product_shop: this.product_shop})
    if(!newClothing) throw new BadRequestError('Error while creating new clothing')

    const newProduct = await super.createProduct(newClothing._id)
    if(!newProduct) throw new BadRequestError('Error while creating new Product')
    return newProduct
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({...this.product_attributes, 
    product_shop: this.product_shop})
    if(!newElectronic) throw new BadRequestError('Error while creating new electronic')

    const newProduct = await super.createProduct(newElectronic._id)
    if(!newProduct) throw new BadRequestError('Error while creating new Product')
    return newProduct
  }
}
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
module.exports = ProductFactory