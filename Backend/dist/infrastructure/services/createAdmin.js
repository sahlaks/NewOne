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
exports.createAdmin = createAdmin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminModel_1 = __importDefault(require("../databases/adminModel"));
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminExists = yield adminModel_1.default.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const hashedPassword = yield bcrypt_1.default.hash(process.env.ADMIN_PASSWORD, 10);
            const admin = new adminModel_1.default({
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
            });
            yield admin.save();
            console.log('Admin created successfully');
        }
        else {
            console.log('Admin already exists');
        }
    });
}
