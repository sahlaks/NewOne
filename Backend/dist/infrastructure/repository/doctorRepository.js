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
exports.DoctorRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const notificationModel_1 = __importDefault(require("../databases/notificationModel"));
const appointmentModel_1 = __importDefault(require("../databases/appointmentModel"));
class DoctorRepository {
    /*..........................................verify with email.............................................*/
    findDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findOne({ email }).exec();
            return doctor;
        });
    }
    /*...........................................save details..............................................*/
    saveUserDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUser = yield doctorModel_1.default.create(data);
                return savedUser;
            }
            catch (error) {
                console.error("Error in save doctor details:", error);
                return null;
            }
        });
    }
    /*.........................................update password with email.................................................*/
    updateDoctorDetails(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findOneAndUpdate({ email: email }, { $set: { password: password } }, { new: true });
            return doctor;
        });
    }
    /*............................................find by ID...................................................*/
    findDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.default.findById(id);
                return doctor;
            }
            catch (error) {
                console.error("Error in find doctor details:", error);
                return null;
            }
        });
    }
    /*.....................................find by id then update password..........................................*/
    updateDoctorPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { password: password } }, { new: true });
            return doctor;
        });
    }
    /*........................................find all doctors.........................................*/
    findDoctor(searchQuery, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield doctorModel_1.default
                .find({ doctorName: { $regex: searchQuery, $options: "i" } })
                .skip(skip)
                .limit(limit);
        });
    }
    findDoctors(searchQuery, skip, limit, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield doctorModel_1.default
                .find({
                doctorName: { $regex: searchQuery, $options: "i" },
                isVerified: isVerified,
            })
                .skip(skip)
                .limit(limit);
        });
    }
    countDocuments(query, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield doctorModel_1.default.countDocuments({
                doctorName: { $regex: query, $options: "i" },
                isVerified: isVerified,
            });
        });
    }
    countAll(isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield doctorModel_1.default.countDocuments({ isVerified: isVerified });
        });
    }
    collectDocData(skip, limit, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield doctorModel_1.default
                .find({ isVerified: isVerified })
                .skip(skip)
                .limit(limit);
        });
    }
    /*................................................find by Id.................................................*/
    findDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findById(id);
            return doctor;
        });
    }
    /*...............................................find by Id and then block......................................*/
    findDoctorByIdandUpdate(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findByIdAndUpdate({ _id: id }, { $set: update }, { new: true });
            return doctor;
        });
    }
    /*..............................................find with Id and verify a doctor.....................................*/
    findAndVerify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } }, { new: true });
            return doctor;
        });
    }
    /*........................................find and delete a doctor.........................................*/
    findAndDeleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorModel_1.default.findByIdAndDelete(id);
            return doctor;
        });
    }
    /*........................................save updates....................................*/
    saveDoctor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield doctorModel_1.default.findOneAndUpdate({ email: data.email }, data, { new: true, upsert: true });
                return doctor;
            }
            catch (error) {
                console.error("Error updating doctor", error);
                return null;
            }
        });
    }
    /*............................update doctor with appointment...............................................*/
    updateDoctorwithApointment(id, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointmentObjectId = new mongoose_1.default.Types.ObjectId(id);
            try {
                const res = yield doctorModel_1.default.findByIdAndUpdate(doctorId, { $addToSet: { appointments: appointmentObjectId } }, { new: true });
                if (res) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error("Error updating doctor", error);
                return false;
            }
        });
    }
    /*..............................................all notifications.............................................*/
    getNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.default
                    .find({ doctorId: id, toParent: false })
                    .sort({ createdAt: -1 });
                return notifications;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*........................................update to read................................................*/
    makeRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notificationModel_1.default.findByIdAndUpdate(id, { $set: { isRead: true } });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /*..............................patients from appointments..............................*/
    fetchPatients(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const dObjectId = new mongoose_1.default.Types.ObjectId(id);
            const res = yield appointmentModel_1.default.aggregate([
                {
                    $match: {
                        doctorId: dObjectId,
                    },
                },
                {
                    $group: {
                        _id: { childName: "$name" },
                        childInfo: { $first: "$$ROOT" },
                    },
                },
                {
                    $lookup: {
                        from: "parents",
                        localField: "childInfo.parentId",
                        foreignField: "_id",
                        as: "parentDetails",
                    },
                },
                {
                    $unwind: "$parentDetails",
                },
                {
                    $project: {
                        "childInfo.name": 1,
                        "childInfo._id": 1,
                        "childInfo.childId": 1,
                        "parentDetails.image": 1,
                        "parentDetails.parentName": 1,
                        "parentDetails.email": 1,
                    },
                },
                {
                    $facet: {
                        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                        totalCount: [{ $count: "count" }],
                    },
                },
            ]);
            const data = ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
            const total = ((_c = (_b = res[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            return { data, total };
        });
    }
}
exports.DoctorRepository = DoctorRepository;
