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
exports.ParentController = void 0;
const tokenVerification_1 = require("../infrastructure/services/tokenVerification");
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const cloudinaryService_1 = require("../infrastructure/services/cloudinaryService");
const mongoose_1 = __importDefault(require("mongoose"));
class ParentController {
    constructor(ParentUseCase) {
        this.ParentUseCase = ParentUseCase;
    }
    /*..................................Signup....................................................*/
    createParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentName, email, mobileNumber, password } = req.body;
                req.session.signupData = {
                    parentName,
                    email,
                    mobileNumber,
                    password,
                };
                const result = yield this.ParentUseCase.registrationParent(req);
                if (result.status) {
                    return res.status(200).json({
                        success: true,
                        message: "OTP send to your email",
                    });
                }
                else {
                    return res.json({
                        success: false,
                        message: result.message,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*....................................verify-otp..............................................*/
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { otp } = req.body;
                const sessionOtp = req.session.otp;
                const signupData = req.session.signupData;
                console.log(sessionOtp);
                if (!signupData) {
                    return res
                        .status(400)
                        .json({ success: false, message: "No signup data found" });
                }
                if (otp !== sessionOtp) {
                    return res.json({ success: false, message: "Incorrect OTP" });
                }
                const result = yield this.ParentUseCase.saveUser(signupData);
                if (result.status) {
                    res.cookie("access_token", result.accesstoken, { httpOnly: true, secure: true });
                    res.cookie("refresh_token", result.refreshtoken, { httpOnly: true, secure: true });
                    if ((_a = result.user) === null || _a === void 0 ? void 0 : _a.password) {
                        delete result.user.password;
                    }
                    return res
                        .status(200)
                        .json({ success: true, message: result.message, user: result.user });
                }
                else {
                    return res.json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................resend otp..........................................*/
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.session.signupData) === null || _a === void 0 ? void 0 : _a.email;
                const result = yield this.ParentUseCase.sendOtp(email);
                if (result.status) {
                    req.session.otp = result.otp;
                    return res.status(200).json({
                        success: true,
                        message: "OTP send to your email",
                    });
                }
                else {
                    return res.json({
                        success: false,
                        message: result.message,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................login...................................*/
    loginParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, password } = req.body;
                const result = yield this.ParentUseCase.validateParent(email, password);
                if (result.status) {
                    if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.password) {
                        delete result.data.password;
                    }
                    res.cookie("access_token", result.accesstoken, { httpOnly: true, secure: true });
                    res.cookie("refresh_token", result.refreshtoken, { httpOnly: true, secure: true });
                    return res.status(200).json({ success: true, data: result.data });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...................................check google auth........................................*/
    checkGoogleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.ParentUseCase.findParentWithEmail(email);
                if (result.status) {
                    res.json({ success: true, isGoogleAuth: true });
                }
                else {
                    res.json({ success: false, isGoogleAuth: false });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.........................................google authentication...............................................*/
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const result = yield this.ParentUseCase.findParentByEmail(user);
                if (result.status) {
                    if (result.message === "User exist") {
                        res.cookie("access_token", result.accesstoken, { httpOnly: true });
                        res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
                        return res.status(200).json({
                            success: true,
                            message: result.message,
                            data: result.parent,
                        });
                    }
                    else if (result.message === "User authenticated and added") {
                        res.cookie("access_token", result.accesstoken, { httpOnly: true });
                        res.cookie("refresh_token", result.refreshtoken, { httpOnly: true });
                        return res.status(201).json({
                            success: true,
                            message: result.message,
                            data: result.parent,
                        });
                    }
                }
                else
                    res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..................................forgot password......................................*/
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.ParentUseCase.verifyEmail(email);
                if (result.status) {
                    req.session.pEmail = email;
                    req.session.otp = result.otp;
                    return res.status(200).json({
                        success: true,
                        message: "OTP send to your email, change password",
                        changePassword: true,
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................verify otp in forgot password..........................*/
    verifyForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                const sessionOtp = req.session.otp;
                if (otp !== sessionOtp) {
                    return res.json({ success: false, message: "Incorrect OTP" });
                }
                else {
                    return res.json({
                        success: true,
                        message: "OTP is verified, create a new password!",
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................resend otp in forgot password...............................*/
    resendforForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.session.pEmail;
            if (!email) {
                return res
                    .status(400)
                    .json({ success: false, message: "No email found in session." });
            }
            try {
                const result = yield this.ParentUseCase.sendOtp(email);
                if (result.status) {
                    req.session.otp = result.otp;
                    return res.status(200).json({
                        success: true,
                        message: "OTP send to your email",
                    });
                }
                else {
                    return res.json({
                        success: false,
                        message: result.message,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*................................password saving....................................*/
    passwordSaver(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const email = req.session.pEmail;
                if (!email) {
                    return res
                        .status(400)
                        .json({ success: false, message: "No email found in session." });
                }
                const result = yield this.ParentUseCase.savePassword(email, password);
                if (result.status) {
                    return res.status(200).json({ success: true, message: result.message });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................refresh accesstoken.........................................*/
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                res
                    .status(401)
                    .json({ success: false, message: "Refresh Token Expired" });
            try {
                const decoded = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
                if (!decoded || !decoded.id) {
                    res
                        .status(401)
                        .json({ success: false, message: "Refresh Token Expired" });
                }
                const result = yield this.ParentUseCase.findParentById(decoded.id);
                if (!result || !result.parent) {
                    return res
                        .status(401)
                        .json({ success: false, message: "Invalid Refresh Token" });
                }
                const parent = result.parent;
                if (!parent._id) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid parent data, missing _id",
                    });
                }
                const newAccessToken = (0, JwtCreation_1.jwtCreation)(parent._id, 'Parent');
                res.cookie("access_token", newAccessToken);
                res.status(200).json({ success: true, message: "Token Updated" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................................fetch data for profile.............................................*/
    fetchData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res
                        .status(401)
                        .json({ success: false, message: "User ID is missing" });
                }
                const result = yield this.ParentUseCase.findParentById(userId);
                if (result.status) {
                    const childData = yield this.ParentUseCase.findChildData(userId);
                    if (childData.status) {
                        return res.status(200).json({
                            success: true,
                            message: result.message,
                            data: result === null || result === void 0 ? void 0 : result.parent,
                            child: childData.child,
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        message: result.message,
                        data: result === null || result === void 0 ? void 0 : result.parent,
                    });
                }
                res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*................................................update profile..........................................*/
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { name, email, image, phone, num, street, city, state, country, kids, } = req.body;
            const imageBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
            console.log(imageBuffer);
            try {
                let imageUrl;
                if (imageBuffer) {
                    imageUrl = yield (0, cloudinaryService_1.uploadImage)(imageBuffer, "calmnest");
                }
                const parentData = {
                    parentName: name,
                    email,
                    image: imageUrl,
                    mobileNumber: phone,
                    numberOfKids: num,
                    street,
                    city,
                    state,
                    country,
                };
                let parsedKids = Array.isArray(kids) ? kids : [];
                if (typeof kids === "string") {
                    try {
                        parsedKids = JSON.parse(kids);
                    }
                    catch (error) {
                        return res
                            .status(400)
                            .json({ success: false, message: "Invalid kids data format" });
                    }
                }
                console.log(parsedKids);
                const result = yield this.ParentUseCase.addParentandKids(parentData, parsedKids);
                console.log("res", result);
                if (result.status)
                    return res.status(201).json({
                        success: true,
                        message: "Parent and Childs added successfully",
                        parent: result,
                    });
                return res.json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.............................................remove child data...........................................*/
    deleteChildData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = req.params.id;
            const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.ParentUseCase.deleteKidById(id, parentId);
                if (!result.status)
                    return res
                        .status(404)
                        .json({ success: false, message: result.message });
                return res.status(200).json({ success: true, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................................changing password..........................................*/
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const details = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                const exist = yield this.ParentUseCase.verifyPassword(userId, details.oldPassword);
                if (!exist.status)
                    return res.status(400).json({ success: false, message: exist.message });
                else {
                    const result = yield this.ParentUseCase.findParentwithIdandUpdate(userId, details.password);
                    if (result.status)
                        return res
                            .status(200)
                            .json({ success: true, message: "Updated Successfully" });
                    else
                        return res
                            .status(400)
                            .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.....................................fetch doctors........................................*/
    fetchDoctorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctorId = req.params.id;
            try {
                const result = yield this.ParentUseCase.findDoctor(doctorId);
                if (result.status)
                    return res.status(200).json({
                        success: true,
                        message: result.message,
                        doctor: result.data,
                        slots: result.slots,
                    });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...................................................fetch feedback.........................................*/
    fetchFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const docId = req.params.id;
            try {
                const result = yield this.ParentUseCase.fetchFeedbacks(docId);
                if (result.status)
                    res.status(200).json({ success: true, data: result.data });
                else
                    res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................................fetch child data.......................................*/
    fetchChildData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.ParentUseCase.findChildData(userId);
                if (result.status)
                    res.status(200).json({ success: true, message: result.message, child: result.child });
                else
                    res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................notifications...............................................*/
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentId = req.params.id;
            try {
                const result = yield this.ParentUseCase.fetchingNotifications(parentId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*................................................read notification....................................*/
    changeToRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.body;
            try {
                const result = yield this.ParentUseCase.updateNotification(notificationId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.........................................feedback.................................................*/
    submitFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { feedback } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.ParentUseCase.saveFeedback(userId, feedback);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*......................................submit review................................................*/
    submitReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { feedback: { rating, review }, id, name } = req.body;
            try {
                const result = yield this.ParentUseCase.ratingsAndReview(userId, name, rating, review, id);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................logout.................................*/
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return reject(res
                            .status(500)
                            .json({ success: false, message: "Failed to log out" }));
                    }
                    res.clearCookie("access_token");
                    res.clearCookie("refresh_token");
                    return resolve(res
                        .status(200)
                        .json({ success: true, message: "Successfully logged out" }));
                });
            });
        });
    }
}
exports.ParentController = ParentController;
