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
const node_cron_1 = __importDefault(require("node-cron"));
const appointmentModel_1 = __importDefault(require("../databases/appointmentModel"));
const socketServerConnection_1 = require("../services/socketServerConnection");
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);
    try {
        const upcomingAppointments = yield appointmentModel_1.default.find({
            date: todayStart.toDateString(),
            startTime: {
                $gte: now.toTimeString().slice(0, 5),
                $lte: fifteenMinutesLater.toTimeString().slice(0, 5),
            },
            appointmentStatus: 'Scheduled'
        });
        for (const appointment of upcomingAppointments) {
            let pmessage = `Remainder: Your child's appointment with Dr. ${appointment.doctorName} is at ${appointment.startTime}.`;
            (0, socketServerConnection_1.sendNotificationToUser)(appointment.parentId.toString(), pmessage);
            // Send notification to doctor
            let dmessage = `Remainder: You have an appointment with ${appointment.parentName} in at ${appointment.startTime}.`;
            (0, socketServerConnection_1.sendNotificationToUser)(appointment.doctorId.toString(), dmessage);
        }
    }
    catch (error) {
        console.error('Error checking for upcoming appointments:', error);
    }
}));
