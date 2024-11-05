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
exports.ParentRepository = void 0;
const parentModel_1 = __importDefault(require("../databases/parentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const notificationModel_1 = __importDefault(require("../databases/notificationModel"));
const feedbackModel_1 = __importDefault(require("../databases/feedbackModel"));
const reviewModel_1 = __importDefault(require("../databases/reviewModel"));
class ParentRepository {
    /*..............................find user through email............................................*/
    findParentByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findOne({ email }).exec();
            return parent;
        });
    }
    /*................................................save a user...................................................*/
    saveUserDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUser = yield parentModel_1.default.create(data);
                return savedUser;
            }
            catch (error) {
                console.error("Error in saveUserDetails:", error);
                return null;
            }
        });
    }
    /*.....................................saving user through google authentication.......................................*/
    saveUser(data, password, isGoogleSignUp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new parentModel_1.default(Object.assign(Object.assign({}, data), { password,
                    isGoogleSignUp }));
                const parent = yield newUser.save();
                return parent;
            }
            catch (error) {
                console.error("Error saving user to database:", error);
                return null;
            }
        });
    }
    /*...............................................save new password......................................*/
    updateUserDetails(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findOneAndUpdate({ email: email }, { $set: { password: password } }, { new: true });
            return parent;
        });
    }
    /*..........................................find a user throug ID........................................*/
    findDetailsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findById(id);
            return parent;
        });
    }
    /*..........................................update parent data........................................*/
    saveParent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parent = yield parentModel_1.default.findOneAndUpdate({ email: data.email }, data, { new: true, upsert: true });
                return parent;
            }
            catch (error) {
                console.error("Error updating parent:", error);
                return null;
            }
        });
    }
    /*.....................................find by id then update password..........................................*/
    updateParentPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield parentModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { password: password } }, { new: true });
            return doctor;
        });
    }
    /*.................................................find whole data...........................................*/
    findParent(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const parents = yield parentModel_1.default.find().skip(skip).limit(limit).populate('children').exec();
            return parents;
        });
    }
    countDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            return parentModel_1.default.countDocuments();
        });
    }
    /*....................................................find and update by blocking..................................*/
    findParentByIdandUpdate(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findByIdAndUpdate({ _id: id }, { $set: update }, { new: true });
            return parent;
        });
    }
    /*............................................find and delete..........................................*/
    findAndDeleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield parentModel_1.default.findByIdAndDelete(id);
            return parent;
        });
    }
    /*...........................................update with child Ids...................................................*/
    updateParentChildren(parentId, childIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield parentModel_1.default.findByIdAndUpdate(parentId, { $push: { children: { $each: childIds } } }, { new: true });
        });
    }
    /*........................................update parent on deleting kid.....................................*/
    updateParentOnDelete(kidId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield parentModel_1.default.updateOne({ _id: parentId }, { $pull: { children: kidId } });
            return result.modifiedCount > 0;
        });
    }
    /*.......................................update payment id.......................................*/
    updateParentwithPayment(appointmentId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appointmentObjectId = new mongoose_1.default.Types.ObjectId(appointmentId);
                const res = yield parentModel_1.default.findByIdAndUpdate(parentId, { $addToSet: { appointments: appointmentObjectId } }, { new: true });
                if (res) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    /*..............................................all notifications.............................................*/
    getNotifications(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.default.find({ parentId: id, toParent: true }).sort({ createdAt: -1 });
                return notifications;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*..............................................clear all..............................................*/
    clearAll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield notificationModel_1.default.deleteMany({ parentId: id });
                if (result.deletedCount > 0) {
                    return { success: true, message: "Notifications cleared successfully" };
                }
                else {
                    return { success: true, message: "No notifications to clear" };
                }
            }
            catch (error) {
                console.error("Failed to clear notifications:", error);
                return { success: false, message: "Error clearing notifications" };
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
    /*........................................feedback............................................*/
    saveData(feedbackData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedOne = new feedbackModel_1.default(feedbackData);
                yield savedOne.save();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /*..............................................submit review....................................*/
    submitReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = new reviewModel_1.default(reviewData);
                const save = yield review.save();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /*.............................................feedbacks..........................................*/
    findFeedbacks(dId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(dId);
                const feedbacks = yield reviewModel_1.default.find({ doctorId: id });
                return feedbacks;
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.ParentRepository = ParentRepository;
