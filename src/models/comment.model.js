'use strict';

const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'
var commentSchema = new Schema({
    comment_userId:{
        type: Number,
        required: true,
        default: 69
    },
    comment_productId:{
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    comment_content:{
        type: String,
        default: "" 
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
    },
    comment_left: {
      type: Number,
      default: 0
    },
    comment_right: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = { 
  comment: model(DOCUMENT_NAME, commentSchema)
}