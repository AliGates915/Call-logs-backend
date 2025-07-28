import Product from '../models/Product.js'; 
import { cloudinary } from '../config/cloudinary.js';

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const image = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
    })) || [];

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image, // Changed from 'image' to 'image'
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET All Products
export const getAllProducts = async (req, res) => {
  try {
    let query = Product.find({});

    // Handle sorting
    if (req.query.sort) {
      const sortField = req.query.sortField || 'createdAt';
      const sortOrder = req.query.sort === 'desc' ? -1 : 1;
      query = query.sort({ [sortField]: sortOrder });
    }

    // Handle limit
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      if (!isNaN(limit)) {
        query = query.limit(limit);
      }
    }

    const products = await query.exec();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const image = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
    })) || [];

    // Optional: delete old Cloudinary image
    if (image.length > 0 && product.image.length > 0) {
      for (const img of product.image) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    const updatedFields = {
      name: req.body.name ?? product.name,
      price: req.body.price ?? product.price,
      images: image.length > 0 ? image : product.image,
    };

    console.log(updatedFields);
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.image && product.image.length > 0) {
      for (const img of product.image) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Remove a Single Product Image
export const removeProductImage = async (req, res) => {
  try {
    const { productId, publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $pull: { images: { public_id: publicId } } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Image deleted successfully', data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📊 Analytics: Products Added by Month
export const getProductsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Aggregate pipeline to group products by month
    const monthlyData = await Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1), // Start of year
            $lte: new Date(currentYear, 11, 31, 23, 59, 59) // End of year
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Create array with all months (including those with 0 products)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const result = monthNames.map((monthName, index) => {
      const monthData = monthlyData.find(item => item._id === index + 1);
      return {
        month: monthName,
        count: monthData ? monthData.count : 0
      };
    });
    console.log(result);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

