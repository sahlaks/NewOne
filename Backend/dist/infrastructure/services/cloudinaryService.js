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
exports.uploadDocumentFile = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
// Upload image function
const uploadImage = (fileBuffer_1, folderName_1, ...args_1) => __awaiter(void 0, [fileBuffer_1, folderName_1, ...args_1], void 0, function* (fileBuffer, folderName, resourceType = 'raw') {
    try {
        // Upload image to Cloudinary
        const result = yield new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({ folder: folderName, resource_type: resourceType }, // Specify the folder name
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(fileBuffer); // Upload the buffer
        });
        // If successful, return the secure URL
        if (result && result.secure_url) {
            return result.secure_url;
        }
        else {
            throw new Error('Failed to upload image');
        }
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
});
exports.uploadImage = uploadImage;
const uploadDocumentFile = (fileBuffer, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({
                folder: folderName,
                resource_type: 'raw', // raw for non-image files like PDF
                format: 'pdf',
                upload_preset: 'ml_default' // Make sure to specify 'pdf' format
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(fileBuffer);
        });
        if (result.secure_url) {
            return result.secure_url;
        }
        else {
            throw new Error('Failed to upload document');
        }
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload document to Cloudinary');
    }
});
exports.uploadDocumentFile = uploadDocumentFile;
