import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// We need the raw body for Stripe signature verification
// So we use express.raw() specifically for this route
router.post('/', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
