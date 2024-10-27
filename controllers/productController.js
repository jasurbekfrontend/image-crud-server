const productModel = require("../models/productModel");
const imageModel = require('../models/imageModel');
const fs = require('fs');
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getImage = async (req, res) => {
    const { file_name } = req.params;

    try {
        const image = await imageModel.findOne({ file_name });

        if (!image) {
            return res.status(404).send('Rasm topilmadi');
        }
        res.send(image.data);
    } catch (error) {
        console.error('Xato:', error);
        res.status(500).send('xato');
    }
}
exports.createProduct = async (req, res) => {
    try {
        const file = req.file;
        const fileName = file.originalname;

        const fileBuffer = fs.readFileSync(file.path);
        const base64Image = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;

        const newImage = new imageModel({
            data: base64Image,
            file_name: fileName
        });
        await newImage.save();

        const imageUrl = `http://localhost:8080/images/${fileName}`;

        const product = new productModel({
            ...req.body,
            image: imageUrl,
        });
        const newProduct = await product.save();
        fs.unlinkSync(file.path);
        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const product = productModel.findById(req.params.id)
    try {
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
        if (product.author_id === req.user_id) {
            const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else {
            return res.status(403).json({ message: "Siz mahsulotning egasi emassiz" });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const product = productModel.findById(req.params.id)
    try {
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
        if (product.author_id === req.user_id) {
            const updatedProduct = await productModel.findByIdAndDelete(req.params.id);
        } else {
            return res.status(403).json({ message: "Siz mahsulotning egasi emassiz" });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
