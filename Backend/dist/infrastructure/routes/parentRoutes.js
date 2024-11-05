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
const express_1 = __importDefault(require("express"));
const parentController_1 = require("../../controller/parentController");
const parentUsecases_1 = require("../../usecases/parentUsecases");
const parentRepository_1 = require("../repository/parentRepository");
const mailService_1 = __importDefault(require("../services/mailService"));
const tokenValidation_1 = require("../middleware/tokenValidation");
const childRepository_1 = require("../repository/childRepository");
const upload_1 = __importDefault(require("../services/upload"));
const doctorRepository_1 = require("../repository/doctorRepository");
const slotRepository_1 = require("../repository/slotRepository");
const stripe_1 = __importDefault(require("stripe"));
const appointmentController_1 = require("../../controller/appointmentController");
const appointmentUsecase_1 = require("../../usecases/appointmentUsecase");
const appointmentRepository_1 = require("../repository/appointmentRepository");
const checkBlockedStatus_1 = __importDefault(require("../middleware/checkBlockedStatus"));
const chatUsecases_1 = require("../../usecases/chatUsecases");
const chatRepository_1 = require("../repository/chatRepository");
const chatController_1 = require("../../controller/chatController");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const parentRouter = express_1.default.Router();
const sendEmail = new mailService_1.default();
const childRepository = new childRepository_1.ChildRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const slotRepository = new slotRepository_1.SlotRepository();
const parentRepository = new parentRepository_1.ParentRepository();
const parentUseCase = new parentUsecases_1.ParentUseCase(parentRepository, sendEmail, childRepository, doctorRepository, slotRepository);
const controller = new parentController_1.ParentController(parentUseCase);
//appointment
const appointmentRepository = new appointmentRepository_1.AppointmentRepository();
const appointmentUsecase = new appointmentUsecase_1.AppointmentUseCase(appointmentRepository, parentRepository, doctorRepository);
const appointmentController = new appointmentController_1.AppointmentController(appointmentUsecase);
//chat
const chatRepository = new chatRepository_1.ChatRepository();
const chatUsecase = new chatUsecases_1.ChatUseCase(chatRepository);
const chatController = new chatController_1.ChatController(chatUsecase);
//signup
parentRouter.post("/signup", (req, res, next) => {
    controller.createParent(req, res, next);
});
//verify-otp
parentRouter.post("/verify-otp", (req, res, next) => {
    controller.verifyOtp(req, res, next);
});
//login
parentRouter.post("/login", (req, res, next) => {
    controller.loginParent(req, res, next);
});
//google authentication
parentRouter.post("/google/auth", (req, res, next) => {
    controller.googleAuth(req, res, next);
});
parentRouter.post("/check-google-auth", (req, res, next) => {
    controller.checkGoogleAuth(req, res, next);
});
//resend-otp
parentRouter.post("/resend-otp", (req, res, next) => {
    controller.resendOtp(req, res, next);
});
//forgot-password
parentRouter.post("/forgot-pwd", (req, res, next) => {
    controller.forgotPassword(req, res, next);
});
//verifyOtp
parentRouter.post("/verifyOtp", (req, res, next) => {
    controller.verifyForgotPassword(req, res, next);
});
//resendOtp
parentRouter.post("/resendOtp", (req, res, next) => {
    controller.resendforForgotPassword(req, res, next);
});
//for new password
parentRouter.post("/new-password", (req, res, next) => {
    controller.passwordSaver(req, res, next);
});
//fetch data for profile
parentRouter.get("/parentprofile", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.fetchData(req, res, next);
});
//refresh access token
parentRouter.post("/refreshToken", (req, res, next) => {
    controller.refreshToken(req, res, next);
});
//update profile
parentRouter.post("/updateParentProfile", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, upload_1.default, (req, res, next) => {
    controller.updateProfile(req, res, next);
});
//remove kid
parentRouter.delete("/remove-kid/:id", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.deleteChildData(req, res, next);
});
//change password
parentRouter.post("/change-password", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.changePassword(req, res, next);
});
//fetch doctors
parentRouter.get("/details/:id/doctor", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.fetchDoctorDetails(req, res, next);
});
//doctor feedback
parentRouter.get('/fetch-feedback/:id', (0, tokenValidation_1.validateTokens)('Parent'), checkBlockedStatus_1.default, (req, res, next) => {
    controller.fetchFeedback(req, res, next);
});
//child details
parentRouter.get("/child-details", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.fetchChildData(req, res, next);
});
//stripe
parentRouter.post("/create-checkout-session", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    appointmentController.callingStripe(req, res, next);
});
//for success payment
parentRouter.post("/success/:session_id", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    appointmentController.successUpdate(req, res, next);
}));
//payment failure
parentRouter.post("/failure/:session_id", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    appointmentController.failureUpdate(req, res, next);
}));
//fetch appointments
parentRouter.get("/getappointments", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    appointmentController.getAppointments(req, res, next);
}));
//notifications
parentRouter.get("/notifications/:id", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    controller.getNotifications(req, res, next);
}));
parentRouter.get("/clearNotifications", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    controller.clearNotifications(req, res, next);
}));
//notification-read
parentRouter.post("/mark-notification-read", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.changeToRead(req, res, next);
});
//give feedback
parentRouter.post("/givefeedback", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    controller.submitFeedback(req, res, next);
});
//search
parentRouter.get("/doctors", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    chatController.searchDoctor(req, res, next);
});
//fetch messages
parentRouter.get("/fetchmessages", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    chatController.fetchMessages(req, res, next);
});
//save message
parentRouter.post("/savemessage", (0, tokenValidation_1.validateTokens)("Parent"), checkBlockedStatus_1.default, (req, res, next) => {
    chatController.saveMessage(req, res, next);
});
//delete chat
parentRouter.delete("/deletechat/:id", (0, tokenValidation_1.validateTokens)('Parent'), checkBlockedStatus_1.default, (req, res, next) => {
    chatController.deleteChat(req, res, next);
});
//chat lists
parentRouter.get('/chatlists', (0, tokenValidation_1.validateTokens)('Parent'), checkBlockedStatus_1.default, (req, res, next) => {
    chatController.chatLists(req, res, next);
});
//review
parentRouter.post('/review', (0, tokenValidation_1.validateTokens)('Parent'), checkBlockedStatus_1.default, (req, res, next) => {
    controller.submitReview(req, res, next);
});
//history
parentRouter.get('/prescription/:id', (0, tokenValidation_1.validateTokens)('Parent'), checkBlockedStatus_1.default, (req, res, next) => {
    appointmentController.fetchPrescription(req, res, next);
});
//logout
parentRouter.post("/logout", (req, res, next) => {
    controller.logoutUser(req, res, next);
});
exports.default = parentRouter;
