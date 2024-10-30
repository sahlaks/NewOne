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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDoctorTokens = exports.validateTokens = void 0;
const tokenVerification_1 = require("../services/tokenVerification");
/*.................................for parent............................................*/
const validateTokens = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.access_token;
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                return res.status(401).json({ message: "Refresh Token Expired" });
            const refreshTokenValid = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
            if (!refreshTokenValid || !refreshTokenValid.id) {
                return res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            }
            if (!accessToken) {
                return res
                    .status(401)
                    .json({ success: false, message: "Access Token Expired" });
            }
            const decoded = (0, tokenVerification_1.verifyAccessToken)(accessToken);
            if (!decoded.id || !decoded || !decoded.role) {
                return res
                    .status(401)
                    .json({ success: false, message: "Access Token Expired" });
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            if (decoded.role !== requiredRole) {
                return res
                    .status(403)
                    .json({ message: `Access denied. Requires role: ${requiredRole}` });
            }
            next();
        }
        catch (err) { }
    });
};
exports.validateTokens = validateTokens;
/*..........................................for doctor validation.................................*/
const validateDoctorTokens = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.doc_auth_token;
            const refreshToken = req.cookies.doc_refresh_token;
            if (!refreshToken)
                return res.status(401).json({ message: "Refresh Token Expired" });
            const refreshTokenValid = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
            if (!refreshTokenValid.id) {
                return res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            }
            if (!accessToken) {
                return res
                    .status(401)
                    .json({ success: false, message: "Access Token Expired" });
            }
            const decoded = (0, tokenVerification_1.verifyAccessToken)(accessToken);
            if (!decoded.id || !decoded) {
                return res
                    .status(401)
                    .json({ success: false, message: "Access Token Expired" });
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            if (decoded.role !== requiredRole) {
                return res
                    .status(403)
                    .json({ message: `Access denied. Requires role: ${requiredRole}` });
            }
            next();
        }
        catch (err) { }
    });
};
exports.validateDoctorTokens = validateDoctorTokens;
