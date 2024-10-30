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
exports.SlotRepository = void 0;
const slotModel_1 = __importDefault(require("../databases/slotModel"));
class SlotRepository {
    /*............................................create slots......................................*/
    createSlot(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSlot = new slotModel_1.default({
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    doctorId: data.doctorId
                });
                const savedSlot = yield newSlot.save();
                return savedSlot;
            }
            catch (error) {
                console.error("Error creating slot:", error);
                return null;
            }
        });
    }
    /*...................................fetch slots...........................................*/
    fetchSlots(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const slots = yield slotModel_1.default.find({ doctorId: id }).skip(skip).limit(limit).sort({ createdAt: -1 });
                return slots;
            }
            catch (error) {
                console.error("Error fetching slot:", error);
                return null;
            }
        });
    }
    countDocuments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield slotModel_1.default.countDocuments({ doctorId: id });
            return res;
        });
    }
    /*..........................................available slots for doctor..............................*/
    fetchAvailableSlots(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slots = yield slotModel_1.default.find({ doctorId: id, isAvailable: true, status: 'Available' });
                return slots;
            }
            catch (error) {
                console.error("Error fetching slot:", error);
                return null;
            }
        });
    }
    /*..................................update Slot availability......................................*/
    updateSlot(slotId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield slotModel_1.default.findById(slotId);
                if (slot) {
                    if (slot.doctorId.toString() !== doctorId)
                        return null;
                    slot.isAvailable = false;
                    yield slot.save();
                    return slot;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*.........................................delete slot................................*/
    deleteSlot(slotId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedSlot = yield slotModel_1.default.findOneAndDelete({ _id: slotId, doctorId: doctorId });
                return deletedSlot;
            }
            catch (error) {
                return null;
            }
        });
    }
    /*.................................deleting slots.................................*/
    deleteSlotsBefore(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield slotModel_1.default.deleteMany({
                    date: { $lt: date },
                });
                return result.deletedCount || 0;
            }
            catch (error) {
                console.error('Error deleting slots:', error);
                throw new Error('Could not delete slots');
            }
        });
    }
}
exports.SlotRepository = SlotRepository;
