'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'
// Declare the Schema of the Mongo model
var ResourceSchema = new mongoose.Schema({
  resource_name: {
    type: String,
    required: true,
  },
  resource_description:{
      type:String,
      default: ''
  },
  resource_slug:{
    type:String,
    default: ''
},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ResourceSchema);