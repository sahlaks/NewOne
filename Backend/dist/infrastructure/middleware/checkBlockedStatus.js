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
const parentModel_1 = __importDefault(require("../databases/parentModel"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const checkBlockedStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    try {
        let user;
        if (role === 'Parent')
            user = yield parentModel_1.default.findById(userId);
        else
            user = yield doctorModel_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User/Doctor not found' });
        if (user.isBlocked)
            return res.status(403).json({ message: 'Access denied. Your account has been blocked.' });
        next();
    }
    catch (error) {
        console.error('Error checking blocked status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.default = checkBlockedStatus;
