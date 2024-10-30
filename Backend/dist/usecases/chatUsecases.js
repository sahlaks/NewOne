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
exports.ChatUseCase = void 0;
class ChatUseCase {
    constructor(chatRepository) {
        this.ichatRepository = chatRepository;
    }
    /*.....................................search doctor............................................*/
    collectDoctorData(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.ichatRepository.findDoctor(search);
            if (res)
                return { status: true, data: res };
            else
                return { status: false };
        });
    }
    /*.....................................search parent............................................*/
    collectParentData(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.ichatRepository.findParent(search);
            if (res)
                return { status: true, data: res };
            else
                return { status: false };
        });
    }
    /*................................fetch messages using ids....................................*/
    fetchMessagesUsingId(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.ichatRepository.getMessages(sender, receiver);
            if (res)
                return { status: true, data: res };
            else
                return { status: false };
        });
    }
    /*.........................................save message....................................*/
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.ichatRepository.saveMessage(message);
            if (res)
                return { status: true };
            else
                return { status: false };
        });
    }
    /*.............................................chat lists.............................................*/
    fetchChatLists(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if (role === 'Parent')
                res = yield this.ichatRepository.findChats(id);
            else
                res = yield this.ichatRepository.findDoctorChats(id);
            if (res)
                return { status: true, data: res };
            else
                return { status: false };
        });
    }
}
exports.ChatUseCase = ChatUseCase;
