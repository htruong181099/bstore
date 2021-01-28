const mongoose = require('mongoose');

const EmailToken = mongoose.model(
    "EmailToken",
    new mongoose.Schema({
        _userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        token: {type: String, required: true},
        createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
    })
)

module.exports = EmailToken;