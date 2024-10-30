"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthToken = exports.validateActivationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateActivationToken = (req, res, next) => {
    //const token = req.header('Authorization')?.split(' ')[1];
    const token = req.cookies.activationToken;
    console.log('middleware', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const secretKey = process.env.ACTIVATIONTOKEN_KEY || 'your_default_secret';
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log('middleware', decoded);
        req.user = decoded.userId;
        req.otp = decoded.otp;
        console.log(req.user);
        console.log(req.otp);
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.validateActivationToken = validateActivationToken;
const validateAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.AUTHTOKEN_KEY);
        req.user = decoded.id;
        console.log(req.user);
        next();
    }
    catch (error) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
});
exports.validateAuthToken = validateAuthToken;
