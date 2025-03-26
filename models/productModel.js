const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String },
    category: { type: String, required: true },
    brand: { type: String }, 
    coverImage: { type: String }, 
    thumbImages: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
