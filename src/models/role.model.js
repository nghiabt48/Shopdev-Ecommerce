'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'
/*
 grantList = [
  { role: 'admin', resource: 'profile', action: 'update: any', attributes: '*' }
]
*/
var RoleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    default: 'user',
    enum: ['user', 'shop', 'admin',],
  },
  role_status: {
    type: String,
    default: ''
  },
  role_slug: {
    type: String,
    default: ''
  },
  role_description: {
    type: String,
    default: ''
  },
  role_grants: [
    {
      resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
      },
      actions: [{type: String, required: true}],
      attributes: { type: String, default: '*'}
    }
  ],
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, RoleSchema);