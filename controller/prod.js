import Product from "../models/products.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${uniqueSuffix}-${file.originalname}`;
    cb(null, fileName);
  },
});

const uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg'];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return cb(new Error('Only JPEG/JPG images are allowed'));
    }
    cb(null, true);
  },
}).single('file');

export const addProducts = async (req, res) => {
  uploads(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
     
      console.error("Multer error:", err);
      return res.status(500).json({ message: "Error during file upload", error: err });
    } else if (err) {
    
      console.error("Unknown error:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
    try {
      const data = req.body;
      
      const exist = await Product.findOne({ title: data?.title });
      if (exist) {
        return res.status(400).json({ message: "Product already exists" });
      }

      const fileName = req.file ? req.file.filename : null;

      const newProduct = new Product({
        title: data?.title,
        desc: data?.desc,
        img: fileName,
        categories: data?.categories,
        size: data?.size,
        color: data?.color,
        price: data?.price,
      });

      const response = await newProduct.save();
      return res.status(200).json({ message: "Success", data: response });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
  });
};

export const getAllProducts = async (req, res) => {
  try {
    const { sortBy, minPrice, maxPrice } = req.query;
    let filter = {};

    if (minPrice && maxPrice) {
      filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }

    let productsQuery = Product.find(filter);

    if (sortBy === 'priceHighToLow') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else if (sortBy === 'priceLowToHigh') {
      productsQuery = productsQuery.sort({ price: 1 });
    }

    const products = await productsQuery.exec();

    return res.status(200).json({ message: "Success", data: products });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { id, ...updateData } = req.body; 
    if (!id) {
      return res.status(400).json({ message: "Product ID is required for update" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "Product ID is required for deletion" });
      }
  
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
  };



