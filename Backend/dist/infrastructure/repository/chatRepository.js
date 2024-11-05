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
exports.ChatRepository = void 0;
const chatModel_1 = __importDefault(require("../databases/chatModel"));
const doctorModel_1 = __importDefault(require("../databases/doctorModel"));
const parentModel_1 = __importDefault(require("../databases/parentModel"));
class ChatRepository {
    /*......................................search.................................*/
    findDoctor(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield doctorModel_1.default.find({ doctorName: { $regex: search, $options: "i" }, isVerified: true });
            return res;
        });
    }
    /*......................................search.................................*/
    findParent(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield parentModel_1.default.find({ parentName: { $regex: search, $options: "i" } });
            return res;
        });
    }
    /*...............................get messages..................................*/
    getMessages(sender, receiver, role) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(role);
            const visibilityFilter = role === 'Doctor' ? { visibleToDoctor: true } : { visibleToParent: true };
            const res = yield chatModel_1.default.find({ $and: [
                    {
                        $or: [
                            { senderId: sender, receiverId: receiver },
                            { senderId: receiver, receiverId: sender }
                        ]
                    },
                    visibilityFilter
                ]
            }).sort({ createdAt: 1 });
            if (res)
                return res;
            return null;
        });
    }
    /*.........................................save message....................................*/
    saveMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new chatModel_1.default(msg);
            const res = yield message.save();
            if (res)
                return res;
            return null;
        });
    }
    /*....................................find chats.......................................*/
    findChats(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatList = yield chatModel_1.default.aggregate([
                    {
                        $match: {
                            $or: [
                                { senderId: id },
                                { receiverId: id }
                            ],
                            visibleToParent: true,
                        }
                    },
                    {
                        $group: {
                            _id: {
                                $cond: [
                                    { $eq: ["$senderId", id] },
                                    "$receiverId",
                                    "$senderId"
                                ]
                            },
                            lastMessage: { $last: "$$ROOT" }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $addFields: {
                            doctorId: { $toObjectId: "$_id" }
                        }
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctorId",
                            foreignField: "_id",
                            as: "doctorInfo"
                        }
                    },
                    {
                        $unwind: "$doctorInfo"
                    },
                    {
                        $project: {
                            _id: 0,
                            doctorId: "$doctorInfo._id",
                            doctorName: "$doctorInfo.doctorName",
                            doctorImage: "$doctorInfo.image",
                            lastMessage: {
                                message: "$lastMessage.message",
                                createdAt: "$lastMessage.createdAt",
                                read: "$lastMessage.read",
                                senderId: "$lastMessage.senderId"
                            }
                        }
                    },
                    {
                        $sort: { "lastMessage.createdAt": -1 }
                    },
                ]);
                return chatList;
            }
            catch (error) {
                return null;
            }
        });
    }
    ;
    /*..................................................doctor chats.......................................................*/
    findDoctorChats(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatList = yield chatModel_1.default.aggregate([
                    {
                        $match: {
                            $or: [
                                { senderId: id },
                                { receiverId: id }
                            ],
                            visibleToDoctor: true,
                        }
                    },
                    {
                        $group: {
                            _id: {
                                $cond: [
                                    { $eq: ["$senderId", id] },
                                    "$receiverId",
                                    "$senderId"
                                ]
                            },
                            lastMessage: { $last: "$$ROOT" }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $addFields: {
                            parentId: { $toObjectId: "$_id" }
                        }
                    },
                    {
                        $lookup: {
                            from: "parents",
                            localField: "parentId",
                            foreignField: "_id",
                            as: "parentInfo"
                        }
                    },
                    {
                        $unwind: "$parentInfo"
                    },
                    {
                        $project: {
                            _id: 0,
                            parentId: "$parentInfo._id",
                            parentName: "$parentInfo.parentName",
                            parentImage: "$parentInfo.image",
                            lastMessage: {
                                message: "$lastMessage.message",
                                createdAt: "$lastMessage.createdAt",
                                read: "$lastMessage.read",
                                senderId: "$lastMessage.senderId"
                            }
                        }
                    },
                    {
                        $sort: { "lastMessage.createdAt": -1 }
                    },
                ]);
                console.log(chatList);
                return chatList;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*...........................................delete chat.......................................*/
    deleteChat(id, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield chatModel_1.default.updateMany({
                $or: [
                    { senderId: id, receiverId: docId },
                    { senderId: docId, receiverId: id }
                ]
            }, { $set: { visibleToParent: false } });
            return res.modifiedCount > 0;
        });
    }
    /*...........................................delete chat.......................................*/
    deleteChatDoctor(id, pId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield chatModel_1.default.updateMany({
                $or: [
                    { senderId: id, receiverId: pId },
                    { senderId: pId, receiverId: id }
                ]
            }, { $set: { visibleToDoctor: false } });
            return res.modifiedCount > 0;
        });
    }
}
exports.ChatRepository = ChatRepository;
