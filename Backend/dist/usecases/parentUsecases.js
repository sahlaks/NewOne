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
exports.ParentUseCase = void 0;
const otpGenerator_1 = require("../infrastructure/services/otpGenerator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const JwtCreation_1 = require("../infrastructure/services/JwtCreation");
const generatePassword_1 = require("../infrastructure/services/generatePassword");
const mongoose_1 = __importDefault(require("mongoose"));
class ParentUseCase {
    constructor(parentRepository, sendEmail, childRepository, doctorRepository, slotRepository) {
        this.iparentRepository = parentRepository;
        this.sendEmail = sendEmail;
        this.ichildRepository = childRepository;
        this.idoctorRepository = doctorRepository;
        this.islotRepository = slotRepository;
    }
    /*......................................find user by email and send otp to it.........................................*/
    registrationParent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupData = req.session.signupData;
                const email = signupData === null || signupData === void 0 ? void 0 : signupData.email;
                //check user
                const existingUser = yield this.iparentRepository.findParentByEmail(email);
                if (existingUser) {
                    return { status: false, message: "Email already registered" };
                }
                const otp = (0, otpGenerator_1.generateOTP)();
                req.session.otp = otp;
                const mailOptions = {
                    email,
                    subject: "Your OTP for CalmNest Signup",
                    code: otp,
                };
                yield this.sendEmail.sendEmail(mailOptions);
                return { status: true, message: "OTP sent successfully" };
            }
            catch (error) {
                // Handle unexpected errors
                console.error("Error during parent registration:", error);
                return {
                    status: false,
                    message: "An error occurred during registration",
                };
            }
        });
    }
    /*.....................................verify email and save data............................................*/
    saveUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hash the password before saving
                const salt = yield bcrypt_1.default.genSalt(10);
                data.password = yield bcrypt_1.default.hash(data.password, salt);
                data.isLoggin = true;
                const savedUser = yield this.iparentRepository.saveUserDetails(data);
                if (savedUser) {
                    const accesstoken = (0, JwtCreation_1.jwtCreation)(savedUser._id, 'Parent');
                    const refreshtoken = (0, JwtCreation_1.refreshToken)(savedUser._id, 'Parent');
                    return {
                        status: true,
                        message: "User registered successfully",
                        user: savedUser,
                        accesstoken,
                        refreshtoken,
                    };
                }
                else {
                    return { status: false, message: "Failed to register user" };
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
    /*........................................validate a parent in login...................................*/
    validateParent(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //check user
                const existingUser = yield this.iparentRepository.findParentByEmail(email);
                if (existingUser) {
                    //check blocked or not
                    if (existingUser.isBlocked) {
                        return { status: false, message: ' Sorry! Your account is blocked' };
                    }
                    // Check password
                    const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
                    if (isMatch) {
                        const accesstoken = (0, JwtCreation_1.jwtCreation)(existingUser._id, 'Parent');
                        const refreshtoken = (0, JwtCreation_1.refreshToken)(existingUser._id, 'Parent');
                        return {
                            status: true,
                            message: "Valid credentials",
                            data: existingUser,
                            accesstoken,
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
    /*..............................................send otp...................................................*/
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.generateOTP)();
                const mailOptions = {
                    email,
                    subject: "Your OTP for CalmNest",
                    code: otp,
                };
                yield this.sendEmail.sendEmail(mailOptions);
                return { status: true, message: "OTP sent successfully", otp };
            }
            catch (error) {
                console.error("Error during resend otp:", error);
                return { status: false, message: "An error occurred during resend otp" };
            }
        });
    }
    /*.......................................verify email for forgot password.....................................*/
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iparentRepository.findParentByEmail(email);
                if (user) {
                    const otp = (0, otpGenerator_1.generateOTP)();
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
    /*............................................saving new password......................................*/
    savePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                password = yield bcrypt_1.default.hash(password, salt);
                const savedUser = yield this.iparentRepository.updateUserDetails(email, password);
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
    findParentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parent = yield this.iparentRepository.findDetailsById(id);
                if (parent) {
                    return { status: true, message: "User exist", parent };
                }
                else {
                    return { status: false, message: "User not exist" };
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
    /*.......................................google auth..........................*/
    findParentByEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parent = yield this.iparentRepository.findParentByEmail(user.email);
                if (parent) {
                    const accesstoken = (0, JwtCreation_1.jwtCreation)(parent._id, 'Parent');
                    const refreshtoken = (0, JwtCreation_1.refreshToken)(parent._id, 'Parent');
                    return {
                        status: true,
                        message: "User exist",
                        parent,
                        accesstoken,
                        refreshtoken,
                    };
                }
                else {
                    let password = (0, generatePassword_1.generateRandomPassword)(8);
                    const salt = yield bcrypt_1.default.genSalt(10);
                    password = yield bcrypt_1.default.hash(password, salt);
                    const isGoogleSignUp = true;
                    const parent = yield this.iparentRepository.saveUser(user, password, isGoogleSignUp);
                    if (parent) {
                        const accesstoken = (0, JwtCreation_1.jwtCreation)(parent._id, 'Parent');
                        const refreshtoken = (0, JwtCreation_1.refreshToken)(parent._id, 'Parent');
                        return {
                            status: true,
                            message: "User authenticated and added",
                            parent,
                            accesstoken,
                            refreshtoken,
                        };
                    }
                }
                return { status: false, message: "Error in user authentication" };
            }
            catch (error) {
                return {
                    status: false,
                    message: "An error occured during authenticating data",
                };
            }
        });
    }
    /*.................................find with email for google authentication..........................*/
    findParentWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iparentRepository.findParentByEmail(email);
                if (user) {
                    if (user.isGoogleSignUp) {
                        return { status: true, isGoogleAuth: true };
                    }
                    else {
                        return { status: false, isGoogleAuth: false };
                    }
                }
                else {
                    return { status: false, isGoogleAuth: false };
                }
            }
            catch (error) {
                console.error("Error checking Google auth:", error);
                return { status: false, isGoogleAuth: false };
            }
        });
    }
    /*..............................find child data with parent Id.......................................*/
    findChildData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parentId = new mongoose_1.default.Types.ObjectId(id);
            try {
                const data = yield this.ichildRepository.findChild(parentId);
                if (data) {
                    return { status: true, message: 'Data exist', child: data };
                }
                return { status: false, message: 'Child data not exist' };
            }
            catch (error) {
                return { status: false, message: 'Failure to find data' };
            }
        });
    }
    /*.............................................save parent and kids data....................................*/
    addParentandKids(parentData, childrenData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Save the parent first
                const savedParent = yield this.iparentRepository.saveParent(parentData);
                if (!savedParent) {
                    return { status: false, message: 'Failed to save parent' };
                }
                if (!Array.isArray(childrenData) || childrenData.length === 0) {
                    return { status: true, message: 'Parent details updated successfully without child data' };
                }
                const parentId = new mongoose_1.default.Types.ObjectId(savedParent._id);
                // Validate existing children
                const existingChildren = yield this.ichildRepository.validateChild(childrenData, parentId);
                const existingChildrenArray = existingChildren !== null && existingChildren !== void 0 ? existingChildren : [];
                // Filter out children that already exist in the database
                const newChildren = childrenData.filter(child => !existingChildrenArray.some(existing => existing.name === child.name &&
                    existing.age === child.age &&
                    existing.gender === child.gender));
                // If no new children to save
                if (newChildren.length === 0) {
                    return { status: false, message: 'All provided child data already exists in the database' };
                }
                // Save only new children
                const savedChildren = yield this.ichildRepository.saveChild(newChildren, parentId);
                if (!savedChildren) {
                    return { status: false, message: 'Failed to save children' };
                }
                const childIds = savedChildren.map(child => new mongoose_1.default.Types.ObjectId(child._id));
                // Update parent with children IDs
                const updatedParent = yield this.iparentRepository.updateParentChildren(parentId, childIds);
                if (!updatedParent) {
                    return { status: false, message: 'Failed to update parent with children' };
                }
                return { status: true, message: 'Updated data successfully', child: savedChildren };
            }
            catch (error) {
                console.error('Error:', error);
                return { status: false, message: 'Failure to update data' };
            }
        });
    }
    /*...........................................remove kid data with id..................................*/
    deleteKidById(id, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletekid = yield this.ichildRepository.deleteById(id);
                if (!deletekid)
                    return { status: false, message: 'Kid not found' };
                const kidId = new mongoose_1.default.Types.ObjectId(id);
                const updatedParent = yield this.iparentRepository.updateParentOnDelete(kidId, parentId);
                if (!updatedParent) {
                    return { status: false, message: 'Failed to update parent with kid removal' };
                }
                return { status: true, message: 'Kid deleted successfully' };
            }
            catch (error) {
                return { status: false, message: 'Server error' };
            }
        });
    }
    /*................................verify password...................................*/
    verifyPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.iparentRepository.findDetailsById(id);
                if (existingUser) {
                    // Check password
                    const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
                    if (isMatch)
                        return { status: true, message: 'Matching Password' };
                    else
                        return { status: false, message: 'Wrong Password!..Please enter the matching one' };
                }
                else {
                    return { status: false, message: 'User does not exist' };
                }
            }
            catch (error) {
                return { status: false, message: 'An error occurred during fetching data' };
            }
        });
    }
    /*..................................find with id and update password....................................*/
    findParentwithIdandUpdate(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt_1.default.genSalt(10);
                password = yield bcrypt_1.default.hash(password, salt);
                const savedUser = yield this.iparentRepository.updateParentPassword(id, password);
                if (savedUser)
                    return { status: true, message: 'Updated password successfully!' };
                else
                    return { status: false, message: 'Updation failed..' };
            }
            catch (error) {
                console.error('Error during password updation', error);
                return { status: false, message: 'An error occurred during password updation' };
            }
        });
    }
    /*..................................doctor and its slots........................................*/
    findDoctor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.idoctorRepository.findDetailsById(id);
                if (res) {
                    const slots = yield this.islotRepository.fetchAvailableSlots(id);
                    if (slots)
                        return { status: true, message: 'Data fetched along with slots', data: res, slots };
                    return { status: true, message: 'Doctor details fetched', data: res };
                }
                return { status: false, message: 'No data available' };
            }
            catch (error) {
                return { status: false, message: 'An error occurred during data fetching' };
            }
        });
    }
    /*...............................................feedbacks...................................................*/
    fetchFeedbacks(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iparentRepository.findFeedbacks(id);
                if (res)
                    return { status: true, data: res };
                return { status: false };
            }
            catch (err) {
                return { status: false };
            }
        });
    }
    /*..............................................fetching notifications...................................*/
    fetchingNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.iparentRepository.getNotifications(id);
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
                const res = yield this.iparentRepository.makeRead(id);
                if (res)
                    return { status: true, message: 'Read the Notification' };
                return { status: false, message: 'Failed to make READ' };
            }
            catch (error) {
                return { status: false, message: "An error occured during fetching" };
            }
        });
    }
    /*.............................................feedback...............................................*/
    saveFeedback(id, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbackData = {
                    parentId: new mongoose_1.default.Types.ObjectId(id),
                    message: feedback,
                    createdAt: new Date()
                };
                const res = yield this.iparentRepository.saveData(feedbackData);
                if (res)
                    return { status: true, message: 'Feedback Submitted Successfully!' };
                return { status: false, message: 'Failed to save feedback!!' };
            }
            catch (error) {
                console.error('Error saving feedback:', error);
                return { status: false };
            }
        });
    }
    /*..................................................submit review.............................................*/
    ratingsAndReview(id, name, rating, review, dId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ratingData = {
                    parentId: new mongoose_1.default.Types.ObjectId(id),
                    doctorId: new mongoose_1.default.Types.ObjectId(dId),
                    parentName: name,
                    reviewRating: rating,
                    feedback: review,
                };
                const res = yield this.iparentRepository.submitReview(ratingData);
                if (res)
                    return { status: true, message: 'Feedback Submitted Successfully!' };
                return { status: false, message: 'Failed to save feedback!!' };
            }
            catch (error) {
                return { status: false };
            }
        });
    }
}
exports.ParentUseCase = ParentUseCase;
