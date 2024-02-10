import express from "express";
import { addProducts, getAllProducts, updateProduct, deleteProduct } from "../controller/prod.js";
import { addRegistration } from "../controller/register.js";
import { addToCart, readCart, updateCart, deleteCart } from "../controller/carts.js";
import { checkoutFromCart, readBuyById, deleteBuyById } from "../controller/buyc.js";
import { loginUser } from "../controller/login.js";
import verifyToken from "../controller/middleware.js";

const router = express.Router();

router.post('/login',loginUser);

//registration
router.post('/addRegistration', addRegistration)

//product_routes
router.post('/addProducts', addProducts);
router.get('/getAllProducts', getAllProducts);
router.put('/updateProduct', updateProduct);
router.delete('/deleteProduct', deleteProduct);

//access_token
router.use(verifyToken);

//cart_routes
router.post('/addToCart', addToCart);
router.get('/readCart', readCart);
router.put('/updateCart', updateCart);
router.delete('/deleteCart', deleteCart);

//buy_routes
router.post('/checkoutFromCart', checkoutFromCart);
router.get('/readBuyById', readBuyById);
router.delete('/deleteBuyById', deleteBuyById);


export default router;