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
exports.isParent = void 0;
const tokenVerification_1 = require("../services/tokenVerification");
const JwtCreation_1 = require("../services/JwtCreation");
const isParent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    /*...access token is there....*/
    if (accessToken) {
        const { success, decoded, message } = (0, tokenVerification_1.verifyAccessToken)(accessToken);
        if (success) { /*.....token is there.....*/
            req.user = { id: decoded.id };
            return next();
        }
        else { /*....error in access token.....*/
            if (!refreshToken) { /*....no refresh token, then logout....*/
                return res.status(401).json({ success: false, message: 'Refresh token is required' });
            }
            /*.....verify refresh token.....*/
            const refreshResult = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
            if (refreshResult.success) { /*....token verified....*/
                const newAccessToken = (0, JwtCreation_1.jwtCreation)(refreshResult.decoded.id);
                res.cookie('access_token', newAccessToken, { httpOnly: true });
                req.user = { id: refreshResult.decoded.id };
                return next();
            }
            else { /*...error in refresh token....*/
                return res.status(401).json({ success: false, message: refreshResult.message });
            }
        }
    }
    else { /*.....no access token....*/
        if (!refreshToken) { /*....no refresh token, then logout....*/
            return res.status(401).json({ success: false, message: 'Refresh token is required' });
        }
        const refreshResult = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
        if (refreshResult.success) { /*....token verified....*/
            const newAccessToken = (0, JwtCreation_1.jwtCreation)(refreshResult.decoded.id);
            res.cookie('access_token', newAccessToken, { httpOnly: true });
            req.user = { id: refreshResult.decoded.id };
            return next();
        }
        else { /*...error in refresh token....*/
            return res.status(403).json({ success: false, message: refreshResult.message });
        }
    }
});
exports.isParent = isParent;
