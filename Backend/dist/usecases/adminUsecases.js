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
exports.AdminUseCase = void 0;
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminUseCase {
    constructor(adminRepository, parentRepository, doctorRepository, sendEmail) {
        this.adminRepository = adminRepository;
        this.parentRepository = parentRepository;
        this.doctorRepository = doctorRepository;
        this.SendEmail = sendEmail;
    }
    /*..............................................find admin...................................................*/
    findAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield this.adminRepository.findAdminByEmail(email);
            if (exist) {
                const isMatch = yield bcrypt_1.default.compare(password, exist.password);
                if (!isMatch) {
                    return { status: false, message: 'Invalid credentials' };
                }
                const accessToken = (0, JwtCreation_1.jwtCreation)(exist._id, 'Admin');
                return { status: true, message: 'Admin logged successfully', data: exist, token: accessToken };
            }
            else {
                return { status: false, message: 'Admin not exists!' };
            }
        });
    }
    /*.......................................collect parent data.........................................*/
    collectParentData(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findParent(page, limit);
            const totalParents = yield this.parentRepository.countDocuments();
            const totalPages = Math.ceil(totalParents / limit);
            if (parent) {
                return { status: true, message: 'Fetch Parent Data Successfully', data: parent, totalPages: totalPages };
            }
            return { status: false, message: 'No data available' };
        });
    }
    /*..........................................find parent by id and block..........................................*/
    findParentAndBlock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findDetailsById(id);
            if (parent) {
                const updated = yield this.parentRepository.findParentByIdandUpdate(id, { isBlocked: !parent.isBlocked });
                if (updated) {
                    const message = updated.isBlocked ? 'User blocked' : 'User unblocked';
                    return { status: true, message, data: updated };
                }
            }
            return { status: false, message: 'User does not exist' };
        });
    }
    /*........................................find and delete parent..................................*/
    findAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield this.parentRepository.findAndDeleteById(id);
            if (!parent)
                return { status: false, message: 'Parent not found' };
            return { status: true, message: 'Parent deleted successfully!' };
        });
    }
    /*.............................................collect doctor data...........................................*/
    collectDoctorData(query, page, limit, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const doctor = yield this.doctorRepository.findDoctors(query, skip, limit, isVerified);
            if (doctor) {
                return { status: true, message: 'Fetch Doctor Data Successfully', data: doctor };
            }
            return { status: false, message: 'No data available' };
        });
    }
    countSearchResults(query, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doctorRepository.countDocuments(query, isVerified);
        });
    }
    countAllDoctors(isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doctorRepository.countAll(isVerified);
        });
    }
    collectDocData(page, limit, isVerified) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const doctors = yield this.doctorRepository.collectDocData(skip, limit, isVerified);
            return { data: doctors };
        });
    }
    /*..........................................find doctor and block.................................*/
    findAndBlockDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findDetailsById(id);
            if (doc) {
                const updated = yield this.doctorRepository.findDoctorByIdandUpdate(id, { isBlocked: !doc.isBlocked });
                if (updated) {
                    const message = updated.isBlocked ? 'Doctor blocked' : 'Doctor unblocked';
                    return { status: true, message, data: updated };
                }
            }
            return { status: false, message: 'Doctor does not exist' };
        });
    }
    /*......................................find doctor and verify..................................*/
    verifyDoctorwithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findDetailsById(id);
            if (doc) {
                if (doc.isVerified)
                    return { status: false, message: 'Doctor is already verified' };
                const updated = yield this.doctorRepository.findAndVerify(id);
                if (updated) {
                    const mailOptions = {
                        email: updated.email,
                        subject: `Dr. ${updated.doctorName}, verification process `,
                        code: 'You are Successfully Verified',
                    };
                    yield this.SendEmail.sendEmail(mailOptions);
                    return { status: true, message: 'Doctor is verified and send email', data: updated };
                }
            }
            return { status: false, message: 'Doctor does not exist' };
        });
    }
    /*...........................................find and delete a doctor........................................*/
    deleteDoctorwithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findAndDeleteById(id);
            if (!doc)
                return { status: false, message: 'Doctor not found' };
            return { status: true, message: 'Doctor deleted successfully!' };
        });
    }
    /*.............................find and rejct..................................................... */
    rejectWithId(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.doctorRepository.findDetailsById(id);
            if (doc) {
                const mailOptions = {
                    email: doc.email,
                    subject: `Dr. ${doc.doctorName}, application rejection `,
                    code: `You are Rejected due to ${reason}`,
                };
                yield this.SendEmail.sendEmail(mailOptions);
                const d = yield this.doctorRepository.findAndDeleteById(id);
                return { status: true, message: 'Doctor profile got rejected' };
            }
            else {
                return { status: false, message: 'Doctor does not exist' };
            }
        });
    }
    /*..........................................appointments..................................................*/
    collectAppointments() {
        return __awaiter(this, void 0, void 0, function* () {
            const appointments = yield this.adminRepository.findAppointments();
            if (!appointments)
                return { status: false, message: 'No appointments' };
            return { status: true, message: 'Appointments fetched!', data: appointments };
        });
    }
    /*.........................................gender status..........................................*/
    collectGenderDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const gender = yield this.adminRepository.findDetails();
            if (!gender)
                return { status: false, message: 'No data' };
            return { status: true, message: 'Gender data fetched!', data: gender };
        });
    }
    /*.............................................fetch appointments...........................................*/
    collectAppointmentDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.adminRepository.findAppointmentStatus();
            if (!status)
                return { status: false, message: 'No data' };
            return { status: true, message: 'Status fetched!', data: status };
        });
    }
    /*.............................................user count...........................................*/
    collectUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.adminRepository.findUsers();
            if (!users)
                return { status: false, message: 'No data' };
            return { status: true, message: 'Count fetched!', data: users };
        });
    }
    /*.............................................slot count...........................................*/
    collectSlots() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.adminRepository.findSlots();
            if (!users)
                return { status: false, message: 'No data' };
            return { status: true, message: 'Count fetched!', data: users };
        });
    }
}
exports.AdminUseCase = AdminUseCase;
