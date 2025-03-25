const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    products: [{
        productId: Number,
        quantity: Number,
        name: String,
        price: Number
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    stripePaymentId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);