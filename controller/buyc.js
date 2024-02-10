import Cart from "../models/cart.js";
import Product from "../models/products.js";
import Buy from "../models/buy.js";

export const checkoutFromCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        let totalCost = 0;
        const buyProducts = await Promise.all(cart.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            const itemCost = product.price * item.quantity;
            totalCost += itemCost;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            };
        }));
        const newBuy = new Buy({
            userId,
            products: buyProducts,
            totalCost,
            shippingDetails: req.body.shippingDetails 
        });

        await newBuy.save();
        await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } }); //cart empty after checkout

        return res.status(200).json({ message: 'Checkout successful', data: newBuy });
    } catch (err) {
        console.error('Error checking out from cart:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


export const readBuyById = async (req, res) => {
    try {
        const { buyId } = req.body;

        const buy = await Buy.findById(buyId);

        if (!buy) {
            return res.status(404).json({ message: 'Buy not found' });
        }

        return res.status(200).json({ message: 'Buy retrieved successfully', data: buy });
    } catch (err) {
        console.error('Error reading buy by ID:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const deleteBuyById = async (req, res) => {
    try {
        const { buyId } = req.body;

        const deletedBuy = await Buy.findByIdAndDelete(buyId);

        if (!deletedBuy) {
            return res.status(404).json({ message: 'Buy not found' });
        }

        return res.status(200).json({ message: 'Buy deleted successfully', data: deletedBuy });
    } catch (err) {
        console.error('Error deleting buy by ID:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


