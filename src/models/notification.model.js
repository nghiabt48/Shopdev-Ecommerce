'use strict';

const {Schema, model, default: mongoose} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications'
// ORDER-01: order successfully
// ORDER-02: order failed
// PROMOTION: A shop that user followed has some promotions
// SHOP-01: A shop that user followed has upload a new product
var notifySchema = new Schema({
  noti_type: { type: String, required: true, enum: ['ORDER-01', 'ORDER-02', 'PROMOTION', 'SHOP-01'] },
  noti_senderId: { type: mongoose.Types.ObjectId, ref: 'shop', required: true},
  //noti_senderId: { type: String, required: true},
  noti_receiverId: { type: Number, required: true},
  noti_content: { type: String, required: true},
  noti_options: { type: Object, default: {}}
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = { 
  notification: model(DOCUMENT_NAME, notifySchema)
}