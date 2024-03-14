const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'KeyToken'
const COLLECTION_NAME = 'KeyTokens'
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true
    },
    privateKey:{
        type:String,
        required:true
    },
    refreshTokensUsed:{
        type:Array,
        default:[],
    },
    refreshToken: { // current token
        type: String,
        required:true
    }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);