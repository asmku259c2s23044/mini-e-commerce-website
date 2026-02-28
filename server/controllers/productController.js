import Product from '../models/Product.js';


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        const product = new Product({
            name,
            price,
            user: req.user._id,
            image,
            category,
            description,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.image = image || product.image;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany();

        
        const User = (await import('../models/User.js')).default;
        const adminUser = await User.findOne({ role: 'admin' });
        const userId = adminUser ? adminUser._id : "69a027b62646390e55e1770b";

        const sampleProducts = [
            
            {
                user: userId,
                name: 'Organic Ragi (Finger Millet)',
                image: '/uploads/ragi.png',
                description: 'Nutrient-rich finger millet, perfect for porridge and traditional breakfast.',
                category: 'Millets',
                price: 85,
            },
            {
                user: userId,
                name: 'Thinai (Foxtail Millet)',
                image: 'https://images.unsplash.com/photo-1596733210344-933b93c834f8?q=80&w=800&auto=format&fit=crop',
                description: 'Fiber-rich foxtail millet, great for making idli, dosa, and upma.',
                category: 'Millets',
                price: 120,
            },
            {
                user: userId,
                name: 'Kambu (Pearl Millet)',
                image: '/uploads/kambu.png',
                description: 'Traditional pearl millet, excellent for cooling the body in summer.',
                category: 'Millets',
                price: 95,
            },
            {
                user: userId,
                name: 'Kuthiraivali (Barnyard Millet)',
                image: 'https://images.unsplash.com/photo-1615485500704-819909903781?q=80&w=800&auto=format&fit=crop',
                description: 'Highly digestible barnyard millet, ideal for weight management.',
                category: 'Millets',
                price: 130,
            },
            {
                user: userId,
                name: 'Samai (Little Millet)',
                image: 'https://images.unsplash.com/photo-1615485290339-7a5446077271?q=80&w=800&auto=format&fit=crop',
                description: 'Small grain millet rich in minerals and antioxidants.',
                category: 'Millets',
                price: 110,
            },
            {
                user: userId,
                name: 'Cholam (Sorghum)',
                image: 'https://images.unsplash.com/photo-1605051913160-c328905b634c?q=80&w=800&auto=format&fit=crop',
                description: 'Healthy sorghum grains, gluten-free and rich in fiber.',
                category: 'Millets',
                price: 90,
            },
            {
                user: userId,
                name: 'Panivaragu (Proso Millet)',
                image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=800&auto=format&fit=crop',
                description: 'Power-packed proso millet with a low glycemic index.',
                category: 'Millets',
                price: 105,
            },
            
            {
                user: userId,
                name: 'Karuppu Kavuni Rice (Black Rice)',
                image: 'https://images.unsplash.com/photo-1599307767316-776533da941c?q=80&w=800&auto=format&fit=crop',
                description: 'Nutritious emperor\'s rice, rich in anthocyanins and fiber.',
                category: 'Rice',
                price: 240,
            },
            {
                user: userId,
                name: 'Mapillai Samba Rice (Bridegroom Rice)',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
                description: 'High energy red rice variety, traditional for its stamina-boosting properties.',
                category: 'Rice',
                price: 180,
            },
            {
                user: userId,
                name: 'Sivappu Arisi (Red Rice)',
                image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
                description: 'Essential red rice, unpolished and full of natural nutrients.',
                category: 'Rice',
                price: 140,
            }
        ];

        const createdProducts = await Product.insertMany(sampleProducts);
        res.status(201).json(createdProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while seeding' });
    }
};
