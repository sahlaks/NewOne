"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const documentStorage = multer_1.default.memoryStorage();
const uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    fileFilter: (req, file, cb) => {
        // Allow PDF, DOC, and DOCX file types
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
        }
    },
}).single('document');
exports.default = uploadDocument;
