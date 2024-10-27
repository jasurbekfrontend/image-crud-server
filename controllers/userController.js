const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const user = req.body;
    try {
        const existingUser = await userModel.findOne({ username: user.username });
        if (existingUser) {
            return res.status(400).json({ message: 'Foydalanuvchi nomi allaqachon mavjud' });
        }

        const newUser = new userModel(user);
        await newUser.save();

        return res.status(201).json({ message: 'Foydalanuvchi muvaffaqiyatli yaratildi' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(process.env.JWT_SECRET);

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Foydalanuvchi nomi yoki parol noto'g'ri" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Yaroqsiz foydalanuvchi nomi yoki parol' });
        }

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);

        return res.status(200).json({ message: 'Kirish muvaffaqiyatli', token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getUserProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        const publicInfo = {
            name: user.name,
            username: user.username,
            tcoin_amount: user.tcoin_amount,
            social: user.social,
            products: user.products
        };

        return res.status(200).json(publicInfo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}










