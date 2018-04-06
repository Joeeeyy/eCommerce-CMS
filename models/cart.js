const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    prodId: {
        type: String,
        required: true
    }
});

module.exports = Cart = mongoose.model('Cart', CartSchema);