const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("Authorization");

    if (!token) return res.status(401).send("Kirish rad etildi: Token berilmagan");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send("Token yaroqsiz", err);
    }
}
module.exports = auth;