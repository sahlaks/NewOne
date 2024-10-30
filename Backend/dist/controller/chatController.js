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
exports.ChatController = void 0;
class ChatController {
    constructor(ChatUsecase) {
        this.ChatUsecase = ChatUsecase;
    }
    /*.................................search doctor..................................*/
    searchDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const searchQuery = req.query.search || "";
            try {
                const doctors = yield this.ChatUsecase.collectDoctorData(searchQuery);
                if (doctors.status)
                    return res.status(200).json({ success: true, data: doctors.data });
                return res.status(400).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*.................................search parent..................................*/
    searchParent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const searchQuery = req.query.search || "";
            try {
                const parents = yield this.ChatUsecase.collectParentData(searchQuery);
                if (parents.status)
                    return res.status(200).json({ success: true, data: parents.data });
                return res.status(400).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*..............................................fetch messages of a doctor.............................*/
    fetchMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const receiverID = req.query.id;
            try {
                const messages = yield this.ChatUsecase.fetchMessagesUsingId(senderId, receiverID);
                if (messages.status)
                    return res.status(200).json({ success: true, data: messages.data });
                return res.status(400).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*.........................................save message............................................*/
    saveMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId, message, createdAt, read } = req.body.message;
            try {
                const messageData = {
                    senderId,
                    receiverId,
                    message,
                    read,
                };
                const msg = yield this.ChatUsecase.saveMessage(messageData);
                if (msg.status)
                    return res.status(200).json({ success: true });
                return res.status(400).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
    /*.....................................chat lists..................................*/
    chatLists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            try {
                const chats = yield this.ChatUsecase.fetchChatLists(userId, role);
                if (chats.status)
                    return res.status(200).json({ success: true, data: chats.data });
                return res.status(400).json({ success: false });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.ChatController = ChatController;
