"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tempSchema = new mongoose_1.default.Schema({
    parentName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    document: {
        type: String
    },
    doctorName: {
        type: String
    },
    otp: {
        type: String
    },
    createdAt: { type: Date, default: Date.now, expires: '1h' }
});
const tempModel = mongoose_1.default.model("Temp", tempSchema);
exports.default = tempModel;
