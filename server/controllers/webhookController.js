import Stripe from 'stripe';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        
        try {
            const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });

            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    update_time: paymentIntent.created.toString(),
                    email_address: order.user.email,
                };

                await order.save();
                console.log(`Order ${order._id} marked as paid`);
            } else {
                console.log(`Order not found for Payment Intent ${paymentIntent.id}`);
            }
        } catch (error) {
            console.error(`Error updating order: ${error.message}`);
        }
    }


    res.send();
};
