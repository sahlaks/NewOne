"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const prescriptionSchema = new mongoose_1.default.Schema({
    data: [{
            id: { type: Number },
            text: { type: String }
        }],
    appointmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Appointment'
    }
}, {
    timestamps: true
});
const prescriptionModel = mongoose_1.default.model("Prescription", prescriptionSchema);
exports.default = prescriptionModel;
