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
const parentSchema = new mongoose_1.default.Schema({
    parentName: {
        type: String,
    },
    image: {
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
    numberOfKids: {
        type: Number
    },
    isLoggin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "parent",
    },
    isGoogleSignUp: {
        type: Boolean,
        default: false,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    children: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Child' }],
    appointments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Appointment' }]
}, {
    timestamps: true
});
const parentModel = mongoose_1.default.model("Parent", parentSchema);
exports.default = parentModel;
