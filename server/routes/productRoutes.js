import express from 'express';
import { getProducts, getProductById, seedProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/seed').post(seedProducts);

router.post('/upload', protect, admin, (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        res.json({
            image: `/${req.file.path.replace(/\\/g, '/')}`,
        });
    });
});

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
