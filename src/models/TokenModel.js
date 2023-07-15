const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    userId: {
        type: Schema.Type.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token: {
        
    }
})