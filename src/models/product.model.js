const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_slug: String,
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
        ref: 'Shop'
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture']
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    product_ratingsAverage: {
        type: Number,
        default: 4,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME
});

productSchema.index({ product_name: 'text', product_description: 'text'})
// Define some product types
const clothingSchema = new mongoose.Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
},{
    collection: 'clothing',
    timestamps: true
})
const electronicSchema = new mongoose.Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
},{
    collection: 'electronic',
    timestamps: true
})
// Document middlewares run before .save() and .create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next()
})
//Export the model
module.exports = {
    product: mongoose.model( DOCUMENT_NAME, productSchema),
    electronic: mongoose.model( 'Electronic', electronicSchema),
    clothing: mongoose.model( "Clothing", clothingSchema)
}