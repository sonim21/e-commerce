import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type: String, 
        required: true,
        unique: true
    },
    desc:{
        type: String,
        required: true
    },
    img:{
       type: String,
       required: false
    },
    categories:{
        type: Array
    },
    size:{
        type: String
    },
    color:{
        type: String
    },
    price:{
        type: Number,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
