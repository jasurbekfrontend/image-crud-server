const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        default: []
    },
    social: {
        type: [{
            platform: String,
            url: String
        }],
        default: []
    },
    tcoin_amount: {
        type: Number,
        default: 0
    },
    max_price: {
        type: Number,
        default: 6
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
