"use strict";
var mongoose = require("mongoose");
var govItemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['bill', 'role']
    },
    apiLocation: {
        type: String,
        required: true
    },
    data: {
        required: true,
        type: Object
    },
    govId: {
        required: true,
        type: String
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mongoose.model('GovItem', govItemSchema);
