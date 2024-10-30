"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slotSchema = new mongoose_1.default.Schema({
    date: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['Available', 'Booked'],
        default: 'Available'
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
}, { timestamps: true });
const slotModel = mongoose_1.default.model('Slot', slotSchema);
exports.default = slotModel;
