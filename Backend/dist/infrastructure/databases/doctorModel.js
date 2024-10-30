"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const doctorSchema = new mongoose_1.default.Schema({
    doctorName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    licenseGrade: {
        type: String
    },
    age: {
        type: Number
    },
    specialization: {
        type: String
    },
    image: {
        type: String
    },
    gender: {
        type: String
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    dob: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    fees: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'doctor'
    },
    isGoogleSignUp: {
        type: Boolean,
        default: false
    },
    document: {
        type: String
    },
    bio: {
        type: String
    },
    appointments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Appointment' }],
}, {
    timestamps: true
});
const doctorModel = mongoose_1.default.model('Doctor', doctorSchema);
exports.default = doctorModel;
