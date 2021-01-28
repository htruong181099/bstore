const mongoose = require('mongoose');

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        // username: {
        //   type: String,
        //   required: true
        // },
        firstname:{
          type: String,
          required: true,
        },
        lastname:{
          type: String,
          required: true,
        },
        email: {
          type: String,
          unique: true,
          required: true
        },
        password: {
          type: String,
          required: true
        },
        roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role"
            }
        ],
        phone: {
          type: String,
          required: true
        },
        address: String,
        isVerified: {
          type: Boolean,
          default: false
        },
        isActive: {
          type: Boolean,
          default: true
        },
    })
)

module.exports = User;