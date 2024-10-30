"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3Client = new client_s3_1.S3Client({
    region: process.env.BUCKET_REGION, // e.g., 'us-west-2'
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});
const upload = (bucketName) => (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Client,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.filename });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    }),
});
exports.default = upload;
