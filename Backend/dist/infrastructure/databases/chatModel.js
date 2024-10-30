"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    senderId: { type: String },
    receiverId: { type: String },
    message: { type: String },
    read: { type: Boolean,
        default: false }
}, { timestamps: true });
const chatModel = mongoose_1.default.model('Chat', chatSchema);
exports.default = chatModel;
