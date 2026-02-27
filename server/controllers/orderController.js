import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order & Razorpay Order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
    const {
        orderItems,
        address,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        try {
            // Precise amount for Razorpay (in paise)
            const amount = Math.round(totalPrice * 100);

            const options = {
                amount: amount,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };

            // Create Razorpay order
            const razorpayOrder = await razorpay.orders.create(options);

            const order = new Order({
                orderItems,
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    address: address,
                    _id: req.user._id,
                },
                totalPrice,
                razorpayOrderId: razorpayOrder.id,
                status: 'Pending'
            });

            // Update: Link order to user ID for easier querying
            order.userId = req.user._id;

            const createdOrder = await order.save();

            res.status(201).json({
                orderId: createdOrder._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                order.paymentId = razorpay_payment_id;
                order.paidAt = Date.now();
                await order.save();
                res.status(200).json({ message: "Payment verified successfully" });
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Check if it's the user's order or if user is admin
            if (order.user.email === req.user.email || req.user.role === 'admin') {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        // Query by user email or userId (adding userId to model for better consistency)
        const orders = await Order.find({ "user.email": req.user.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
