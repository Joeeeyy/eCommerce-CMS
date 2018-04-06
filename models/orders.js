const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = Orders = mongoose.model('Orders', OrdersSchema);