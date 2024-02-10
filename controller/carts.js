import Cart from "../models/cart.js";
import Product from "../models/products.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        } else {
        
            const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

            if (existingProductIndex !== -1) {
               
                cart.products[existingProductIndex].quantity += quantity; // update product quantity if it already exists
            } else {
    
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();

        const product = await Product.findById(productId); //display product details

        return res.status(200).json({ message: 'Product added to cart successfully', data: { cart, product } });
    } catch (err) {
        console.error('Error adding to cart:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const readCart = async (req, res) => {
    try {
        const { userId } = req.body; 

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let totalCost = 0; //calculate cost
        const cartItemsWithCost = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            const itemCost = product.price * item.quantity;
            totalCost += itemCost;
            return {
                ...item.toObject(),
                totalItemCost: itemCost
            };
        }));

        return res.status(200).json({ message: 'Cart retrieved successfully', cart: cartItemsWithCost, totalCost });
    } catch (err) {
        console.error('Error reading cart:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


export const updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

        if (existingProductIndex !== -1) { //decrement
            const updatedQuantity = cart.products[existingProductIndex].quantity + quantity;

            if (updatedQuantity <= 0) { //delete cart if it becomes zero
                cart.products.splice(existingProductIndex, 1);
            } else {
                cart.products[existingProductIndex].quantity = updatedQuantity;
            }
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();

        let totalCost = 0;
        const cartItemsWithCost = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            const itemCost = product.price * item.quantity;
            totalCost += itemCost;
            return {
                ...item.toObject(),
                totalItemCost: itemCost
            };
        }));

        return res.status(200).json({ message: 'Cart updated successfully', cart: cartItemsWithCost, totalCost });
    } catch (err) {
        console.error('Error updating cart:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.findIndex(item => item.productId === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: 'Product removed from cart successfully', cart });
    } catch (err) {
        console.error('Error deleting item from cart:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
