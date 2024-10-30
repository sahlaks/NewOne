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
exports.AdminRepository = void 0;
const adminModel_1 = __importDefault(require("../databases/adminModel"));
const appointmentModel_1 = __importDefault(require("../databases/appointmentModel"));
const childModel_1 = __importDefault(require("../databases/childModel"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const parentModel_1 = __importDefault(require("../databases/parentModel"));
class AdminRepository {
    /*...............................................find with email.............................................*/
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield adminModel_1.default.findOne({ email });
            return admin;
        });
    }
    /*..........................................appointments per month...................................*/
    findAppointments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentsPerMonth = yield appointmentModel_1.default.aggregate([
                    {
                        $addFields: {
                            dateObject: {
                                $dateFromString: {
                                    dateString: "$date",
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            year: { $year: "$dateObject" },
                            month: { $month: "$dateObject" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: "$year",
                                month: "$month"
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: {
                            "_id.year": 1,
                            "_id.month": 1
                        }
                    }
                ]);
                return appointmentsPerMonth;
            }
            catch (err) {
                return null;
            }
        });
    }
    /*..............................................fetch gender details...................................*/
    findDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const genderDistribution = yield childModel_1.default.aggregate([
                {
                    $group: {
                        _id: "$gender",
                        count: { $sum: 1 }
                    }
                }
            ]);
            console.log(genderDistribution);
            return genderDistribution;
        });
    }
    /*.............................................appointment status.................................*/
    findAppointmentStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentStatuses = yield appointmentModel_1.default.aggregate([
                    {
                        $group: {
                            _id: "$appointmentStatus",
                            count: { $sum: 1 },
                        }
                    },
                    {
                        $project: {
                            status: "$_id",
                            count: 1,
                            _id: 0
                        }
                    }
                ]);
                console.log(appointmentStatuses);
                return appointmentStatuses;
            }
            catch (err) {
                return null;
            }
        });
    }
    /*..........................................user count........................................*/
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const doctorData = yield doctorModel_1.default.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        year: "$_id.year",
                        month: "$_id.month",
                        count: 1,
                        _id: 0
                    }
                },
                { $sort: { year: 1, month: 1 } }
            ]);
            const parentData = yield parentModel_1.default.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        year: "$_id.year",
                        month: "$_id.month",
                        count: 1,
                        _id: 0
                    }
                },
                { $sort: { year: 1, month: 1 } }
            ]);
            return { parents: parentData, doctors: doctorData };
        });
    }
    /*.................................................find slots......................................*/
    findSlots() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalScheduled = yield appointmentModel_1.default.countDocuments({ appointmentStatus: 'Scheduled' });
            const totalCanceled = yield appointmentModel_1.default.countDocuments({ appointmentStatus: 'Canceled' });
            return { totalScheduled, totalCanceled };
        });
    }
}
exports.AdminRepository = AdminRepository;
