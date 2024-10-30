"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    doctorName: { type: String },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Parent'
    },
    parentName: { type: String },
    childId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Child'
    },
    slotId: { type: String },
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    fees: { type: Number },
    prescription: {
        type: Boolean,
        default: false
    },
    appointmentStatus: {
        type: String,
        enum: ['Pending', 'Scheduled', 'Completed', 'Canceled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});
const appointmentModel = mongoose_1.default.model("Appointment", appointmentSchema);
exports.default = appointmentModel;
