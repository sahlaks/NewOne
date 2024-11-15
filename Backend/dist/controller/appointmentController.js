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
exports.AppointmentController = void 0;
const stripeService_1 = require("../infrastructure/services/stripeService");
class AppointmentController {
    constructor(AppointmentUsecase) {
        this.AppointmentUsecase = AppointmentUsecase;
    }
    /*.............................................calling stripe.........................................*/
    callingStripe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { amount, name, age, gender, doctorId, doctorName, parentName, childId, date, startTime, endTime, fees, slotId } = req.body;
            const appointmentDetails = {
                name,
                age,
                gender,
                doctorId,
                doctorName,
                parentId,
                parentName,
                childId,
                slotId,
                date,
                startTime,
                endTime,
                fees
            };
            try {
                const result = yield this.AppointmentUsecase.savePendingAppointment(appointmentDetails);
                if (!result.status)
                    return res.status(400).json({ error: result.message });
                const appointmentId = (_b = result.data) === null || _b === void 0 ? void 0 : _b._id;
                const appointmentIdString = String(appointmentId);
                const session = yield (0, stripeService_1.createCheckoutSession)(amount, appointmentIdString);
                res.status(200).json({ id: session.id });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*......................................success update...............................................*/
    successUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = req.params.session_id;
            try {
                const session = yield (0, stripeService_1.retrieveSession)(sessionId);
                if (session) {
                    var appointmentId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.appointmentId;
                    const result = yield this.AppointmentUsecase.updateSuccessPayment(appointmentId, parentId);
                    if (result.status)
                        return res.status(200).json({ success: true, message: 'Appointment Saved Successfully', data: result.data });
                    else
                        return res.status(400).json({ success: false, message: 'Payment Failed' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................making failure........................................*/
    failureUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const sessionId = req.params.session_id;
            try {
                const session = yield (0, stripeService_1.retrieveSession)(sessionId);
                if (session) {
                    var appointmentId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.appointmentId;
                    const result = yield this.AppointmentUsecase.updateFailurePayment(appointmentId);
                    if (result.status)
                        return res.status(200).json({ success: true, message: 'Appointment Failed' });
                    else
                        return res.status(400).json({ success: false, message: 'Payment Failed' });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*......................................get appointments...................................*/
    getAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const search = req.query.search;
            const status = req.query.status;
            try {
                const result = yield this.AppointmentUsecase.fetchAppointment(parentId, page, limit, search, status);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data, totalPages: result.totalPages, currentPage: page });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*......................................get doctor appointments...........................................*/
    getDoctorAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            try {
                const result = yield this.AppointmentUsecase.fetchDoctorsAppointments(doctorId, page, limit);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data, totalPages: result.totalPages, currentPage: page });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..................................change status of appointment................................*/
    changeStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { status } = req.body;
            const appointmentId = req.params.id;
            try {
                const result = yield this.AppointmentUsecase.changeStatusOfAppointment(appointmentId, status, doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message, data: result.data });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...................................change status to completed..........................................*/
    updateStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const appointmentId = req.params.id;
            try {
                const result = yield this.AppointmentUsecase.changeToCompleted(appointmentId, doctorId);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................................save prescription...............................................*/
    savePrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AppointmentUsecase.savePrescription(req.body);
                if (result.status)
                    return res.status(200).json({ success: true });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..............................................fetch prescription................................................*/
    fetchPrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.AppointmentUsecase.fetchPrescription(id);
                if (result.status)
                    return res.status(200).json({ success: true, data: result.data });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.....................................................fetch history....................................................*/
    fetchHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const childId = req.params.id;
            const name = req.params.name;
            try {
                const result = yield this.AppointmentUsecase.getHistory(childId, id, name);
                if (result.status)
                    return res.status(200).json({ success: true, data: result.data });
                return res.status(400).json({ success: false });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AppointmentController = AppointmentController;
