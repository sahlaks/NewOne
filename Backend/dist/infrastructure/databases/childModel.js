"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const childSchema = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Parent'
    }
});
const childModel = mongoose_1.default.model('Child', childSchema);
exports.default = childModel;
