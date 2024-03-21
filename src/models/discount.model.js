'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'
var discountSchema = new Schema({
    discount_name:{
        type: String,
        required: true
    },
    discount_description:{
        type: String,
        required: true
    },
    discount_type:{
        type: String,
        default: 'fixed_amount' // percentage
    },
    discount_value: {
      type: Number, // 10 000 , 10%
      required: true
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_start_date: {
      type: Date,
      required: true
    },
    discount_end_date: {
      type: Date,
      required: true
    },
    // number of discounts can be used
    discount_max_uses: {
      type: Number,
      required: true
    },
    // number of discounts have been used
    discount_used_count: {
      type: Number,
      required: true
    },
    // 
    discount_users_used: {
      type: Array,
      default: []
    },
    // how many times a user can use the discount
    discount_max_uses_per_user: {
      type: Number,
      required: true
    },
    // minimum order amount to apply the discount
    discount_min_order_value: {
      type: Number,
      required: true
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    discount_is_active: {
      type: Boolean,
      default: true
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific']
    },
    // which products can use the discount
    discount_product_ids: {
      type: Array,
      default: []
    }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)