"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
function arrayLimit(val) {
    return val.length <= 15;
}
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxLength: 14
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 14
    },
    starredItems: {
        type: Array
    },
    notifications: {
        type: Array
    }
});
exports.default = mongoose.model('User', userSchema);
