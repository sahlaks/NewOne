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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendEmail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY,
            },
        });
    }
    sendEmail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield this.transporter.sendMail({
                    from: `"CalmNest" <${process.env.EMAIL}>`,
                    to: mailOptions.email,
                    subject: mailOptions.subject,
                    html: `<div>
                     <p>${mailOptions.subject}</p>
                     <div><h1>${mailOptions.code}</h1></div>
                   </div>`,
                });
                console.log("Message sent: %s", info.messageId);
                return true;
            }
            catch (error) {
                console.error("Error sending email:", error);
                return false;
            }
        });
    }
}
exports.default = SendEmail;
