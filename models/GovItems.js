"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = mongoose.model('GovItem', govItemSchema);
