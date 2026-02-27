import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: {
            line1: { type: String, required: true },
            city: { type: String, required: true },
            postal_code: { type: String, required: true },
            country: { type: String, required: true },
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
        },
    ],
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending',
    },
    paymentId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
