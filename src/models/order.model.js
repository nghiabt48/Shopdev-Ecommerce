const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'
var orderSchema = new Schema({
    order_userId:{
        type:Schema.Types.ObjectId,
        required: true,
        //ref: 'User'
    },
    order_checkout:{
        type: Object,
        default: {}
    },
    order_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: { // current token
        type: Array,
        required:true
    },
    order_trackingNumber: {
      type: String,
      default: "#0000122032024"
    },
    order_status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "delivering", "cancelled", "completed"]
    }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, orderSchema)
}