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
exports.DoctorUseCase = void 0;
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const otpGenerator_1 = require("../infrastructure/services/otpGenerator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const temporaryModel_1 = __importDefault(require("../infrastructure/databases/temporaryModel"));
class DoctorUseCase {
    constructor(doctorRepository, sendEmail, slotRepository) {
        this.idoctorRepository = doctorRepository;
        this.sendEmail = sendEmail;
        this.islotRepository = slotRepository;
    }
    /*............................check email registered or not, then send otp............................*/
    registrationDoctor(doctorName, email, mobileNumber, password, document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user already exists
                const existingUser = yield this.idoctorRepository.findDoctorByEmail(email);
                if (existingUser) {
                    return { status: false, message: "Email already registered" };
                }
                // Generate and store OTP securely
                const otp = (0, otpGenerator_1.generateOTP)();
                const salt = yield bcrypt_1.default.genSalt(10);
                password = yield bcrypt_1.default.hash(password, salt);
                const tempUser = new temporaryModel_1.default({
                    doctorName,
                    email,
                    mobileNumber,
                    password,
                    document,
                    otp
                });
                yield tempUser.save();
                console.log('user', tempUser);
                // Send email with OTP
                const mailOptions = {
                    email,
                    subject: "Your OTP for CalmNest Doctor Signup",
                    code: otp,
                };
                yield this.sendEmail.sendEmail(mailOptions);
                return { status: true, message: "OTP sent successfully", otp };
            }
            catch (error) {
                // Handle unexpected errors
                console.error("Error during doctor registration:", error);
                return {
                    status: false,
                    message: "An error occurred during registration",
                };
            }
        });
    }
    /*.....................................save details when otp is verified...............................*/
    saveUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUser = yield this.idoctorRepository.saveUserDetails(data);
                if (savedUser) {
                    const token = (0, JwtCreation_1.jwtCreation)(savedUser._id, 'Doctor');
                    const refreshtoken = (0, JwtCreation_1.refreshToken)(savedUser._id, 'Doctor');
                    return {
                        status: true,
                        message: "Doctor registered successfully",
                        user: savedUser,
                        token,
                        refreshtoken,
                    };
                }
                else {
                    return { status: false, message: "Failed to register doctor" };
                }
            }
            catch (error) {
                console.error("Error in saveUser:", error);
                return {
                    status: false,
                    message: "An error occurred during registration",
                };
            }
        });
    }
    /*...............................................otp.....................................................*/
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.generateOTP)();
                const mailOptions = {
                    email,
                    subject: "Your OTP for CalmNest Doctor Signup",
                    code: otp,
                };
                yield temporaryModel_1.default.findOneAndUpdate({ email: email }, { $set: { otp: otp } }, { new: true, upsert: false });
                yield this.sendEmail.sendEmail(mailOptions);
                return { status: true, message: "OTP sent successfully", otp };
            }
            catch (error) {
                console.error("Error during resend otp:", error);
                return { status: false, message: "An error occurred during resend otp" };
            }
        });
    }
    /*..................................validate by email then password....................................*/
    validateDoctor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check user
                const existingUser = yield this.idoctorRepository.findDoctorByEmail(email);
                if (existingUser) {
                    // Check if the doctor is verified
                    if (!existingUser.isVerified) {
                        return {
                            status: false,
                            message: "Your account is not verified. Please verify your account to proceed.",
                        };
                    }
                    //check blocked or not
                    if (existingUser.isBlocked) {
                        return {
                            status: false,
                            message: 'Sorry! Your account is blocked!!'
                        };
                    }
                    // Check password
                    const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
                    if (isMatch) {
                        const token = (0, JwtCreation_1.jwtCreation)(existingUser._id, 'Doctor');
                        const refreshtoken = (0, JwtCreation_1.refreshToken)(existingUser._id, 'Doctor');
                        return {
                            status: true,
                            message: "Valid credentials",
                            data: existingUser,
                            token,
                            refreshtoken,
                        };
                    }
                    else {
                        return { status: false, message: "Wrong password" };
                    }
                }
                else {
                    return { status: false, message: "User does not exist!" };
                }
            }
            catch (error) {
                console.error("Error in login:", error);
                return {
                    status: false,
                    message: "An error occurred during registration",
                };
            }
        });
    }
    /*....................forgot password.............................*/
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.idoctorRepository.findDoctorByEmail(email);
                if (user) {
                    const otp = (0, otpGenerator_1.generateOTP)();
                    const tempUser = new temporaryModel_1.default({
                        email: email,
                        otp: otp
                    });
                    yield tempUser.save();
                    const mailOptions = {
                        email,
                        subject: "Your OTP for changing password",
                        code: otp,
                    };
                    yield this.sendEmail.sendEmail(mailOptions);
                    return { status: true, message: "OTP sent successfully", otp };
                }
                else {
                    return { status: false, message: "You are not registered yet!!" };
                }
            }
            catch (error) {
                console.error("Error during sending otp:", error);
                return { status: false, message: "An error occurred during resend otp" };
            }
        });
    }
    /*..............................update password.......................................*/
    savePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                password = yield bcrypt_1.default.hash(password, salt);
                const savedUser = yield this.idoctorRepository.updateDoctorDetails(email, password);
                if (savedUser)
                    return {
                        status: true,
                        message: "Updated password successfully!",
                        doctor: true,
                    };
                else
                    return { status: false, message: "Updation failed..", doctor: false };
            }
            catch (error) {
                console.error("Error during password updation", error);
                return {
                    status: false,
                    message: "An error occurred during password updation",
                    doctor: false,
                };
            }
        });
    }
    /*............................find the doctor using id....................................*/
    findDoctorwithId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield this.idoctorRepository.findDetailsById(id);
                if (doctor) {
                    return {
                        status: true,
                        message: "Doctor exist in database",
                        data: doctor,
                    };
                }
                else {
                    return { status: false, message: "Doctor not available" };
                }
            }
            catch (error) {
                console.error("Error during fetching data", error);
                return {
                    status: false,
                    message: "An error occurred during fetching data",
                };
            }
        });
    }
    /*................................verify password...................................*/
    verifyPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.idoctorRepository.findDetailsById(id);
                if (existingUser) {
                    // Check password
                    const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
                    if (isMatch)
                        return { status: true, message: "Matching Password" };
                    else
                        return {
                            status: false,
                            message: "Wrong Password!..Please enter the matching one",
                        };
                }
                else {
                    return { status: false, message: "User does not exist" };
                }
            }
            catch (error) {
                return {
                    status: false,
                    message: "An error occurred during fetching data",
                };
            }
        });
    }
    /*..................................find with id and update password....................................*/
    findDoctorwithIdandUpdate(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                password = yield bcrypt_1.default.hash(password, salt);
                const savedUser = yield this.idoctorRepository.updateDoctorPassword(id, password);
                if (savedUser)
                    return { status: true, message: "Updated password successfully!" };
                else
                    return { status: false, message: "Updation failed.." };
            }
            catch (error) {
                console.error("Error during password updation", error);
                return {
                    status: false,
                    message: "An error occurred during password updation",
                };
            }
        });
    }
    /*...............................data by ID.......................................*/
    findDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.idoctorRepository.findDetailsById(id);
                if (data) {
                    return { status: true, message: "Doctor exist", data };
                }
                else {
                    return { status: false, message: "Doctor not exist" };
                }
            }
            catch (error) {
                return {
                    status: false,
                    message: "An error occured during fetching data",
                };
            }
        });
    }
    /*.....................................................save doctor details.......................................*/
    addDoctor(doctor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedDoctor = yield this.idoctorRepository.saveDoctor(doctor);
                if (!savedDoctor) {
                    return { status: false, message: 'Failed to save doctor' };
                }
                return { status: true, message: 'Updated data successfully' };
            }
            catch (error) {
                return { status: false, message: 'Failure to update data' };
            }
        });
    }
    /*.........................................save slots..........................................*/
    addTimeSlots(slots, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const slot of slots) {
                    for (const entry of slot.slots) {
                        yield this.islotRepository.createSlot({ date: slot.date, startTime: entry.start, endTime: entry.end, doctorId: id });
                    }
                }
                return { status: true, message: "Slots saved successfully" };
            }
            catch (error) {
                console.error("Error in addTimeSlots:", error);
                return { status: false, message: "Failed to save slots" };
            }
        });
    }
    /*............................................fetch slot..........................................*/
    fetchSlotsDetails(id, page, limit, search, available) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.islotRepository.fetchSlots(id, page, limit, search, available);
                const total = yield this.islotRepository.countDocuments(id);
                const totalPages = Math.ceil(total / limit);
                if (res)
                    return { status: true, message: 'Slots fetched successfully', data: res, totalPages: totalPages };
                return { status: false, message: 'Error fetching slots' };
            }
            catch (error) {
                return { status: false, message: "Failed to fetch slots" };
            }
        });
    }
    /*.........................................change availability....................................*/
    changeAvailabilityWithId(slotId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSlot = yield this.islotRepository.updateSlot(slotId, doctorId);
                if (!updatedSlot)
                    return { status: false, message: "Slot not found or unauthorized access", };
                return { status: true, message: "Slot availability updated successfully", data: updatedSlot };
            }
            catch (error) {
                return { status: false, message: "An error occurred while updating the slot availability" };
            }
        });
    }
    /*..............................................delete a slot..............................................*/
    deleteSlotWithId(slotId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSlot = yield this.islotRepository.deleteSlot(slotId, doctorId);
                if (!updatedSlot)
                    return { status: false, message: "Slot not found or unauthorized access", };
                return { status: true, message: "Slot deleted successfully" };
            }
            catch (error) {
                return { status: false, message: "An error occurred while deleting the slot availability" };
            }
        });
    }
    /*..............................................fetching notifications...................................*/
    fetchingNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.idoctorRepository.getNotifications(id);
                if (res)
                    return { status: true, message: 'Fetched Notifications', data: res };
                return { status: false, message: 'Failed to fetch notifications' };
            }
            catch (error) {
                return { status: false, message: "An error occured during fetching" };
            }
        });
    }
    /*........................................make read.............................................*/
    updateNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.idoctorRepository.makeRead(id);
                if (res)
                    return { status: true, message: 'Read the Notification' };
                return { status: false, message: 'Failed to make READ' };
            }
            catch (error) {
                return { status: false, message: "An error occured during fetching" };
            }
        });
    }
    /*...........................................patients.............................................*/
    getPatients(id, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.idoctorRepository.fetchPatients(id, page, limit, search);
                if (res)
                    return { status: true, data: res.data, total: res.total };
                return { status: false };
            }
            catch (error) {
                return { status: false };
            }
        });
    }
}
exports.DoctorUseCase = DoctorUseCase;
