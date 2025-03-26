const Product = require("../models/productModel");

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const { title, color, size, price, stock, description, category, brand } = req.body;
        const coverImage = req.files?.coverImage ? req.files.coverImage[0].path : undefined;
        const thumbImages = req.files?.thumbImages ? req.files.thumbImages.map(file => file.path) : [];

        const newProduct = new Product({ title, color, size, price, stock, description, category, brand, coverImage, thumbImages });
        await newProduct.save();

        res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { title, color, size, price, stock, description, category, brand } = req.body;
        const coverImage = req.files?.coverImage ? req.files.coverImage[0].path : undefined;
        const thumbImages = req.files?.thumbImages ? req.files.thumbImages.map(file => file.path) : undefined;

        const updatedData = {};
        if (title) updatedData.title = title;
        if (color) updatedData.color = color;
        if (size) updatedData.size = size;
        if (price) updatedData.price = price;
        if (stock) updatedData.stock = stock;
        if (description) updatedData.description = description;
        if (category) updatedData.category = category;
        if (brand) updatedData.brand = brand;
        if (coverImage) updatedData.coverImage = coverImage;
        if (thumbImages) updatedData.thumbImages = thumbImages;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

        res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ success: false, message: "Product not found" });

        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get All Products with Filters & Pagination
exports.getProducts = async (req, res) => {
    try {
        const { filters, pagination } = req.body;

        let filter = {};

        if (filters) {
            const { minPrice, maxPrice, category, size, color, searchTerm, dateRange } = filters;

            if (minPrice && minPrice !== "") {
                filter.price = filter.price || {};
                filter.price.$gte = parseInt(minPrice);
            }

            if (maxPrice && maxPrice !== "") {
                filter.price = filter.price || {};
                filter.price.$lte = parseInt(maxPrice);
            }

            if (category && category !== "") filter.category = category;
            if (size && size !== "") filter.size = size;
            if (color && color !== "") filter.color = color;

            if (dateRange?.startDate && dateRange?.endDate) {
                filter.createdAt = {
                    $gte: new Date(dateRange.startDate),
                    $lte: new Date(dateRange.endDate)
                };
            }

            if (searchTerm && searchTerm.trim() !== "") {
                filter.$or = [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } }
                ];
            }
        }

        // Sorting & Pagination
        let sortOptions = {};
        if (filters?.sortBy) {
            sortOptions[filters.sortBy] = filters.sortOrder === "asc" ? 1 : -1;
        } else {
            sortOptions["createdAt"] = -1; // Default sorting
        }

        const page = pagination?.page || 0;
        const pageSize = pagination?.pageSize || 10;

        // Fetch Products
        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(page * pageSize)
            .limit(pageSize);

        const totalProducts = await Product.countDocuments(filter);

        res.json({
            success: true,
            total: totalProducts,
            page,
            pageSize,
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
