"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.AUTHTOKEN_KEY);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return { success: false, message: 'Token has expired' };
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return { success: false, message: 'Invalid token' };
        }
        else {
            return { success: false, message: 'Token verification failed' };
        }
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESHTOKEN_KEY);
        return decoded;
    }
    catch (error) {
        return error;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
