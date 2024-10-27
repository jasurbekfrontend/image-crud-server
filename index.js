require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const { createUser, loginUser, getUserProfile } = require("./controllers/userController");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getImage } = require("./controllers/productController");
const app = express();
app.use(express.json());
app.use(cors())
connectDB();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// user routes
app.post("/user/register", createUser);
app.post("/user/login", loginUser);
app.get("/user/:id", getUserProfile);


// product routes
app.get("/product", getAllProducts)
app.get("/images/:file_name", getImage);
app.post("/product", auth, upload.single('image'), createProduct);
app.put("/product/:id", auth, updateProduct);
app.delete("/product/:id", auth, deleteProduct);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi!`);
});
