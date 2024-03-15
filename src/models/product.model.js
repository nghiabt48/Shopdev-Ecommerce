const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_thumb:{
        type:String,
        required:true,
    },
    product_description: {
        type:String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_shop: {
        type: mongoose.Types.ObjectId,
        ref: 'shop'
    },
    product_type: {
        type: Array,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
// Define some product types
const clothingSchema = new mongoose.Schema({
    brand: {type: String, required: true},
    size: String,
    material: String
},{
    collection: 'clothing',
    timestamps: true
})
const electronicSchema = new mongoose.Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String
},{
    collection: 'electronic',
    timestamps: true
})
//Export the model
module.exports = {
    product: mongoose.model( DOCUMENT_NAME, productSchema),
    electronic: mongoose.model( 'Electronic', electronicSchema),
    clothing: mongoose.model( "Clothing", clothingSchema)
}