const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Image', imageSchema);