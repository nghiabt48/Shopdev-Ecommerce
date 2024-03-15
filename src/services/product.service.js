'use strict';
const { product, clothing, electronic } = required('../models/product.model.js')
const { BadRequestError } = required('../core/error.response.js')

// Define factory class to create product
class ProductFactory {
  /* 
    type: 'Clothing',
    payload
  */
  static productRegistry = {}
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError('Invalid product type: ' + type)
    return new productClass(payload).createProduct()
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
  type = Clothing
  async createProduct() {
    const newClothing = await clothing.create({...this.product_attributes, 
      product_shop: this.product_shop})
    if(!newClothing) throw new BadRequestError('Error while creating new clothing')

    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('Error while creating new Product')
    return newProduct
  }
}
class Electronic extends Product {
  type = Electronic
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