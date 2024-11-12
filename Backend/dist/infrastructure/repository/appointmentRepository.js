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
exports.AppointmentRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentModel_1 = __importDefault(require("../databases/appointmentModel"));
const notificationModel_1 = __importDefault(require("../databases/notificationModel"));
const prescriptionModel_1 = __importDefault(require("../databases/prescriptionModel"));
const ruleModel_1 = __importDefault(require("../databases/ruleModel"));
class AppointmentRepository {
    /*..........................saving appointment as pending......................................*/
    saveData(appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = new appointmentModel_1.default(appointment);
                const savedAppointment = yield data.save();
                return savedAppointment;
            }
            catch (error) {
                console.error("Error saving appointment:", error);
                return null;
            }
        });
    }
    /*.................................update appointment................................................*/
    updateData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield appointmentModel_1.default.findByIdAndUpdate(id, { paymentStatus: 'Success' }, { new: true });
                const slot = yield ruleModel_1.default.findByIdAndUpdate(data === null || data === void 0 ? void 0 : data.slotId, { status: 'Booked' });
                return data;
            }
            catch (error) {
                console.error('Error updating appointment:', error);
                return null;
            }
        });
    }
    /*...................................update failure...............................................*/
    updateFailure(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield appointmentModel_1.default.findByIdAndUpdate(id, { paymentStatus: 'Failed' }, { new: true });
                return data;
            }
            catch (error) {
                console.error('Error in updating');
                return null;
            }
        });
    }
    /*............................................send notification...................................*/
    sendNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new notificationModel_1.default(notificationData);
                const savedOne = yield notification.save();
                return savedOne;
            }
            catch (error) {
                console.error('Error in saving notification');
                return null;
            }
        });
    }
    /*.........................................fetch appointments....................................*/
    fetchAppointments(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const appointments = yield appointmentModel_1.default.find({ parentId: id, paymentStatus: "Success" }).skip(skip).limit(limit).sort({ createdAt: -1 });
                return appointments;
            }
            catch (error) {
                return null;
            }
        });
    }
    countDocuments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appointmentModel_1.default.countDocuments({ parentId: id, paymentStatus: "Success" });
        });
    }
    /*......................................fetch doctor's appointments............................*/
    fetchDoctorAppointments(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const appointments = yield appointmentModel_1.default.find({ doctorId: id, paymentStatus: "Success" }).skip(skip).limit(limit).sort({ createdAt: -1 });
                return appointments;
            }
            catch (error) {
                return null;
            }
        });
    }
    countDoctorDocuments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appointmentModel_1.default.countDocuments({ doctorId: id, paymentStatus: "Success" });
        });
    }
    /*..................................change status of appointment.............................*/
    updateAppointment(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOne = yield appointmentModel_1.default.findByIdAndUpdate(id, { $set: {
                        appointmentStatus: status
                    } }, { new: true });
                return updatedOne;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*...................................update and save..........................................*/
    updateAndSave(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(data.id);
                const prescription = new prescriptionModel_1.default({ data: data.data, appointmentId: objectId });
                const r = yield prescription.save();
                yield appointmentModel_1.default.findByIdAndUpdate(data.id, { prescription: true });
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*....................................get prescription.............................*/
    findUsingId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prescriptionModel_1.default.findOne({ appointmentId: id });
            return res;
        });
    }
    /*...................................................history......................................*/
    findUsingChildId(childId, doctorId, cname) {
        return __awaiter(this, void 0, void 0, function* () {
            const cId = childId && mongoose_1.default.isValidObjectId(childId) ? new mongoose_1.default.Types.ObjectId(childId) : null;
            const dId = new mongoose_1.default.Types.ObjectId(doctorId);
            const res = yield appointmentModel_1.default.aggregate([
                {
                    $match: {
                        doctorId: dId,
                        name: cname,
                        $or: [
                            { childId: cId },
                            { childId: null }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: "prescriptions",
                        localField: "_id",
                        foreignField: "appointmentId",
                        as: "prescriptionDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$prescriptionDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        doctorId: 1,
                        doctorName: 1,
                        age: 1,
                        gender: 1,
                        date: 1,
                        startTime: 1,
                        endTime: 1,
                        appointmentStatus: 1,
                        fees: 1,
                        paymentStatus: 1,
                        prescription: 1,
                        "prescriptionDetails.data": 1
                    }
                }
            ]);
            return res;
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
