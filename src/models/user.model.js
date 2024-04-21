'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'
// Declare the Schema of the Mongo model
var UserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  user_name:{
      type:String,
      default: ''
  },
  user_email:{
      type:String,
      required:true,
      unique:true,
  },
  user_password: {
      type:String,
      required:true
  },
  user_salf: {
    type:String,
    default: ''
  },
  user_status: {
      type:String,
      enum: ['active', 'pending', 'banned'],
      default: 'pending'
  },
  user_phone: {
      type: String,
      default: ''
  },
  user_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  user_dob: {
    type: Date,
    default: null
  }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, UserSchema);