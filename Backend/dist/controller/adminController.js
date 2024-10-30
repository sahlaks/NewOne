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
exports.AdminController = void 0;
class AdminController {
    constructor(AdminUsecase) {
        this.AdminUsecase = AdminUsecase;
    }
    /*...........................................admin login..............................................*/
    adminLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this.AdminUsecase.findAdmin(email, password);
                if (!admin.status) {
                    return res.status(400).json({ success: false, message: 'Admin not found' });
                }
                res.cookie('access_token', admin.token, { httpOnly: true });
                res.json({ success: true, message: admin.message, data: admin.data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.........................................parents data.......................................................*/
    fetchParents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const parents = yield this.AdminUsecase.collectParentData(page, limit);
                if (parents)
                    return res.status(200).json({ success: true, message: parents.message, data: parents.data, totalPages: parents.totalPages, currentPage: page });
                else
                    return res.status(400).json({ success: false, message: 'No data available' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*..........................................block a parent............................................*/
    blockAParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.AdminUsecase.findParentAndBlock(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................delete a parent.............................................*/
    deleteAParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield this.AdminUsecase.findAndDelete(id);
                if (result.status)
                    return res.status(200).json({ success: true, message: result.message });
                return res.status(400).json({ success: false, message: result.message });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*................................................get all doctors....................................*/
    fetchdoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchQuery = req.query.search || '';
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 6;
                const isVerified = req.query.isVerified;
                let doctors, totalDoctors;
                if (searchQuery) {
                    doctors = yield this.AdminUsecase.collectDoctorData(searchQuery, page, limit, isVerified);
                    totalDoctors = yield this.AdminUsecase.countSearchResults(searchQuery, isVerified);
                }
                else {
                    doctors = yield this.AdminUsecase.collectDocData(page, limit, isVerified);
                    totalDoctors = yield this.AdminUsecase.countAllDoctors(isVerified);
                }
                if (doctors)
                    return res.status(200).json({ success: true, data: doctors.data, totalPages: Math.ceil(totalDoctors / limit),
                        currentPage: page, });
                else
                    return res.status(400).json({ success: false, message: 'No data available' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*...........................................block a doctor............................................*/
    blockDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.findAndBlockDoctor(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*........................................verify a doctor...............................*/
    verifyDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.verifyDoctorwithId(id);
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.................................................delete a doctor.......................................*/
    deleteDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.AdminUsecase.deleteDoctorwithId(id);
                if (result.status)
                    return res.status(201).json({ success: true, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.........................................reject a profile.........................................*/
    rejectDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { reason } = req.body;
                const result = yield this.AdminUsecase.rejectWithId(id, reason);
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.......................................fetch appointmets...................................*/
    fetchAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminUsecase.collectAppointments();
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.......................................fetch appointmets...................................*/
    fetchGenderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminUsecase.collectGenderDetails();
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.......................................appointment status...................................*/
    fetchAppointmentStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminUsecase.collectAppointmentDetails();
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.......................................user growth...................................*/
    fetchUserCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminUsecase.collectUserDetails();
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /*.........................................slot usage...................................*/
    fetchSlotUsage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.AdminUsecase.collectSlots();
                if (result.status)
                    return res.status(201).json({ success: true, message: result.message, data: result.data });
                else
                    return res.status(400).json({ success: false, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
