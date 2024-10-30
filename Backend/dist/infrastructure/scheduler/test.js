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
const slotRepository_1 = require("../repository/slotRepository"); // Adjust the path as necessary
const node_cron_1 = __importDefault(require("node-cron"));
// Create an instance of your SlotRepository
const slotRepository = new slotRepository_1.SlotRepository();
// Function to test the deletion of slots
function testDeleteSlotsBefore() {
    return __awaiter(this, void 0, void 0, function* () {
        // Set the date for testing (e.g., for 5th October 2024)
        const testDate = new Date('2024-10-06T00:00:00Z');
        // Call the method directly
        const deletedCount = yield slotRepository.deleteSlotsBefore(testDate);
        console.log(`Deleted ${deletedCount} slots for ${testDate.toDateString()}`);
    });
}
// Schedule the job for testing
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running the test job to delete expired slots...');
    yield testDeleteSlotsBefore();
}));
