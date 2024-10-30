"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../../controller/adminController");
const adminUsecases_1 = require("../../usecases/adminUsecases");
const adminRepository_1 = require("../repository/adminRepository");
const parentRepository_1 = require("../repository/parentRepository");
const doctorRepository_1 = require("../repository/doctorRepository");
const mailService_1 = __importDefault(require("../services/mailService"));
const adminRouter = express_1.default.Router();
const sendEmail = new mailService_1.default();
const parentRepository = new parentRepository_1.ParentRepository();
const doctorRepository = new doctorRepository_1.DoctorRepository();
const adminRepository = new adminRepository_1.AdminRepository();
const adminUsecase = new adminUsecases_1.AdminUseCase(adminRepository, parentRepository, doctorRepository, sendEmail);
const controller = new adminController_1.AdminController(adminUsecase);
adminRouter.post('/admin-login', (req, res, next) => {
    controller.adminLogin(req, res, next);
});
adminRouter.get('/fetch-parents', (req, res, next) => {
    controller.fetchParents(req, res, next);
});
adminRouter.put('/block-parent/:id', (req, res, next) => {
    controller.blockAParent(req, res, next);
});
adminRouter.delete('/delete-parent/:id', (req, res, next) => {
    controller.deleteAParent(req, res, next);
});
adminRouter.get('/fetch-doctors', (req, res, next) => {
    controller.fetchdoctors(req, res, next);
});
adminRouter.put('/doctor/:id/block', (req, res, next) => {
    controller.blockDoctor(req, res, next);
});
adminRouter.post('/doctor/:id/verify', (req, res, next) => {
    controller.verifyDoctor(req, res, next);
});
adminRouter.delete('/doctor/:id/delete', (req, res, next) => {
    controller.deleteDoctor(req, res, next);
});
adminRouter.post('/doctor/:id/reject', (req, res, next) => {
    controller.rejectDoctor(req, res, next);
});
adminRouter.get('/appointments-per-month', (req, res, next) => {
    controller.fetchAppointments(req, res, next);
});
adminRouter.get('/gender-distribution', (req, res, next) => {
    controller.fetchGenderData(req, res, next);
});
adminRouter.get('/appointment-status', (req, res, next) => {
    controller.fetchAppointmentStatus(req, res, next);
});
adminRouter.get('/user-growth', (req, res, next) => {
    controller.fetchUserCount(req, res, next);
});
adminRouter.get('/slot-usage', (req, res, next) => {
    controller.fetchSlotUsage(req, res, next);
});
exports.default = adminRouter;
