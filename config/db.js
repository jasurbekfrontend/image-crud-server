const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB ga ulanish muvaffaqiyatli amalga oshirildi!");
    } catch (err) {
        console.error("MongoDB ga ulanishda xato:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
