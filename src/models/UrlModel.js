const mongoose = require('mongoose');

const UrlSchema = mongoose.Schema({

    urlCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalLink: {
        type: String,
        required: true,
        // unique: true,
        // index: true
    },
    name: {
        type: String,
        required: false
    },
    visitCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    /*
    updatedAt: {
        type: String,
        default: Date.now()
    }, */

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

/* UrlSchemas.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
}) */
module.exports = mongoose.model('Url', UrlSchema);