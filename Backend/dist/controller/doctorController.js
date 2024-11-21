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
exports.DoctorController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinaryService_1 = require("../infrastructure/services/cloudinaryService");
const tokenVerification_1 = require("../infrastructure/services/tokenVerification");
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const temporaryModel_1 = __importDefault(require("../infrastructure/databases/temporaryModel"));
const ruleModel_1 = __importDefault(require("../infrastructure/databases/ruleModel"));
const rrule_1 = require("rrule");
class DoctorController {
    constructor(DoctorUseCase) {
        this.DoctorUseCase = DoctorUseCase;
    }
    /*...........................................signup......................................*/
    createDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctorName, email, mobileNumber, password } = req.body;
                const file = req.file;
                console.log(req.body, file);
                if (!file) {
                    return res.status(400).json({
                        success: false,
                        message: "Document is required and must be a PDF",
                    });
                }
                const documentUrl = `uploads/${file.filename}`;
                console.log(documentUrl, 'doc');
                const result = yield this.DoctorUseCase.registrationDoctor(doctorName, email, mobileNumber, password, documentUrl);
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
    /*...........................................verify otp....................................................*/
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { otp, email } = req.body;
                console.log(otp, email);
                const tempUser = yield temporaryModel_1.default.findOne({ email });
                if (otp !== (tempUser === null || tempUser === void 0 ? void 0 : tempUser.otp)) {
                    return res.json({ success: false, message: "Incorrect OTP" });
                }
                const doctorData = {
                    doctorName: tempUser === null || tempUser === void 0 ? void 0 : tempUser.doctorName,
                    email: tempUser === null || tempUser === void 0 ? void 0 : tempUser.email,
                    mobileNumber: tempUser === null || tempUser === void 0 ? void 0 : tempUser.mobileNumber,
                    password: tempUser === null || tempUser === void 0 ? void 0 : tempUser.password,
                    document: tempUser === null || tempUser === void 0 ? void 0 : tempUser.document
                };
                const result = yield this.DoctorUseCase.saveUser(doctorData);
                if (result.status) {
                    res.cookie("doc_auth_token", result.token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
                    res.cookie("doc_refresh_token", result.refreshtoken, {
                        httpOnly: true, secure: true, sameSite: 'none', path: '/'
                    });
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
                console.error("Error in DoctorController:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    /*...........................................resend otp..........................................*/
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.DoctorUseCase.sendOtp(email);
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
    /*.................................login...................................*/
    loginDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { email, password } = req.body;
                const result = yield this.DoctorUseCase.validateDoctor(email, password);
                if (result.status) {
                    if ((_a = result.data) === null || _a === void 0 ? void 0 : _a.password) {
                        delete result.data.password;
                    }
                    res.cookie("doc_auth_token", result.token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
                    res.cookie("doc_refresh_token", result.refreshtoken, {
                        httpOnly: true, secure: true, sameSite: 'none', path: '/'
                    });
                    return res.status(200).json({ success: true, data: result.data });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: result.message });
                }
            }
            catch (error) {
                console.error("Error in DoctorController:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    /*...............................forgot password...................................*/
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.DoctorUseCase.verifyEmail(email);
                if (result.status) {
                    return res
                        .status(200)
                        .json({
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
                console.error("Error in DoctorController:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    /*................................verify otp in forgot password..............................*/
    verifyforForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                const tempUser = yield temporaryModel_1.default.findOne({ email });
                if (otp !== (tempUser === null || tempUser === void 0 ? void 0 : tempUser.otp)) {
                    return res.json({ success: false, message: "Incorrect OTP" });
                }
                else {
                    return res.json({
                        success: true,
                        message: "OTP is verified, create a new password!",
                        doctor: true,
                    });
                }
            }
            catch (error) {
                console.error("Error in DoctorController:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    /*.....................................resend otp in forgot password...............................*/
    resendforForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                return res
                    .status(400)
                    .json({ success: false, message: "Email not found." });
            }
            try {
                const result = yield this.DoctorUseCase.sendOtp(email);
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
    /*................................password saving....................................*/
    passwordSaver(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userDetails, email } = req.body;
                const { password, confirmPassword } = userDetails;
                if (!email) {
                    return res
                        .status(400)
                        .json({ success: false, message: "No email found in session." });
                }
                const result = yield this.DoctorUseCase.savePassword(email, password);
                if (result.status) {
                    yield temporaryModel_1.default.findOneAndDelete({ email });
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
    /*.............................fetch doctor data from database.................................*/
    fetchDoctorData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                if (!doctorId)
                    res.status(400).json({ success: false, message: "Id is not there" });
                const result = yield this.DoctorUseCase.findDoctorwithId(doctorId);
                if (result.status) {
                    return res
                        .status(200)
                        .json({
                        success: true,
                        message: "Doctor data availble",
                        data: result.data,
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({ success: false, message: "Doctor data not available" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................change password...................................*/
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const details = req.body;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const exist = yield this.DoctorUseCase.verifyPassword(doctorId, details.oldPassword);
                if (!exist.status)
                    return res.status(400).json({ success: false, message: exist.message });
                else {
                    const result = yield this.DoctorUseCase.findDoctorwithIdandUpdate(doctorId, details.password);
                    if (result.status)
                        return res.status(200).json({ success: true, message: 'Updated Successfully' });
                    else
                        return res.status(400).json({ success: false, message: result.message });
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
            const refreshToken = req.cookies.doc_refresh_token;
            if (!refreshToken)
                res.status(401).json({ success: false, message: 'Refresh Token Expired' });
            try {
                const decoded = (0, tokenVerification_1.verifyRefreshToken)(refreshToken);
                if (!decoded || !decoded.id) {
                    res.status(401).json({ success: false, message: 'Refresh Token Expired' });
                }
                const result = yield this.DoctorUseCase.findDoctorById(decoded.id);
                if (!result || !result.data) {
                    return res.status(401).json({ success: false, message: 'Invalid Refresh Token' });
                }
                const doc = result.data;
                if (!doc._id) {
                    return res.status(400).json({ success: false, message: 'Invalid parent data, missing _id' });
                }
                const newAccessToken = (0, JwtCreation_1.jwtCreation)(doc._id, 'Doctor');
                res.cookie('doc_auth_token', newAccessToken, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
                res.status(200).json({ success: true, message: 'Token Updated' });
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
            const { name, email, phone, gender, age, degree, fees, street, city, state, country, bio } = req.body;
            const imageBuffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
            try {
                let imageUrl;
                if (imageBuffer) {
                    imageUrl = yield (0, cloudinaryService_1.uploadImage)(imageBuffer, 'calmnest');
                }
                const doctorData = {
                    doctorName: name,
                    email,
                    age,
                    image: imageUrl,
                    mobileNumber: phone,
                    specialization: degree,
                    gender,
                    fees,
                    street,
                    city,
                    state,
                    country,
                    bio,
                };
                const result = yield this.DoctorUseCase.addDoctor(doctorData);
                if (result.status)
                    return res.status(201).json({ success: true, message: 'Doctor added successfully', doctor: result });
                return res.json({ success: false, message: result.message });
            }
            catch (error) {
                console.error('Error updating profile:', error);
                return res.status(500).json({ error: 'Error saving parent and kids' });
            }
        });
    }
    /*..............................................save slots..............................................*/
    saveSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { slots } = req.body;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!slots || !Array.isArray(slots)) {
                return res.status(400).json({ message: "Invalid slotsArray format" });
            }
            try {
                const result = yield this.DoctorUseCase.addTimeSlots(slots, doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................................rrule................................................*/
    createSlotsUsingRule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { freq, interval, days, startTime, endTime, until, count } = req.body;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const frequency = rrule_1.RRule[freq.toUpperCase()];
            if (!frequency) {
                return res.status(400).json({ message: "Invalid frequency type" });
            }
            const byWeekday = days.map((day) => rrule_1.RRule[day]);
            const rule = new rrule_1.RRule({
                freq: frequency,
                interval: interval,
                byweekday: byWeekday,
                dtstart: new Date(startTime),
                until: until ? new Date(until) : undefined,
                count: count ? count : undefined
            });
            const occurrences = rule.all();
            const slots = occurrences.map(date => {
                const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
                return {
                    startTime: date,
                    endTime: new Date(date.getTime() + (new Date(endTime).getTime() - new Date(startTime).getTime())),
                    doctorId,
                    day: dayOfWeek,
                };
            });
            return res.status(200).json({ success: true, data: slots });
        });
    }
    /*............................................save created slots................................................*/
    saveCreatedSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const createdSlots = req.body;
            const doc = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const processedSlots = createdSlots.map((slot) => {
                    const startDateTime = new Date(slot.startTime);
                    const endDateTime = new Date(slot.endTime);
                    return {
                        date: startDateTime.toISOString().split('T')[0],
                        day: slot.day,
                        startTime: startDateTime.toTimeString().substring(0, 5),
                        endTime: endDateTime.toTimeString().substring(0, 5),
                        doctorId: new mongoose_1.default.Types.ObjectId(doc),
                    };
                });
                const savedSlots = yield ruleModel_1.default.insertMany(processedSlots);
                if (savedSlots)
                    return res.status(200).json({ success: true, message: 'Slots created successfully!' });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*....................................fetch slots....................................*/
    fetchSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const search = req.query.search;
            const available = req.query.available;
            try {
                const result = yield this.DoctorUseCase.fetchSlotsDetails(doctorId, page, limit, search, available);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, slots: result.data, totalPages: result.totalPages, currentPage: page });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.....................................change availability.......................................................*/
    changeAvailability(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const slotId = req.params.id;
            try {
                const result = yield this.DoctorUseCase.changeAvailabilityWithId(slotId, doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.............................................delete a slot..............................................*/
    deleteSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const slotId = req.params.id;
            try {
                const result = yield this.DoctorUseCase.deleteSlotWithId(slotId, doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................notifications...............................................*/
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const docId = req.params.id;
            try {
                const result = yield this.DoctorUseCase.fetchingNotifications(docId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................................clear.........................................*/
    clearNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const result = yield this.DoctorUseCase.clearAllNotifications(doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false });
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
                const result = yield this.DoctorUseCase.updateNotification(notificationId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*................................................fetch patients....................................................*/
    fetchPatients(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const search = req.query.search;
            try {
                const result = yield this.DoctorUseCase.getPatients(doctorId, page, limit, search);
                if (result.status)
                    return res.status(200).json({ success: true, data: result.data, total: result.total, currentPage: page, totalPages: Math.ceil((result.total || 0) / limit) });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...............................logout.................................*/
    logoutDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                        return reject(res
                            .status(500)
                            .json({ success: false, message: "Failed to log out" }));
                    }
                    res.clearCookie("doc_auth_token");
                    res.clearCookie("doc_refresh_token");
                    return resolve(res
                        .status(200)
                        .json({ success: true, message: "Successfully logged out" }));
                });
            });
        });
    }
    /*............................fetch data for dashboard...........................*/
    dashboardData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            try {
                const response = yield this.DoctorUseCase.fetchDataForDashboard(dId);
                if (response.status)
                    return res
                        .status(200)
                        .json({
                        success: true,
                        count: response.count,
                        scheduled: response.scheduled,
                        completed: response.completed,
                        revenue: response.revenue,
                        latest: response.latest,
                        analytics: response.analytics,
                        pending: response.pending,
                        feedback: response.feedback
                    });
                return res.status(400).json({ success: false, message: "Failed to retrieve dashboard data" });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.DoctorController = DoctorController;
