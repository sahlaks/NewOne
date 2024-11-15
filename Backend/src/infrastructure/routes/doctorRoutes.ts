import express from "express";
import { DoctorController } from "../../controller/doctorController";
import { DoctorRepository } from "../repository/doctorRepository";
import { DoctorUseCase } from "../../usecases/doctorUsecases";
import SendEmail from "../services/mailService";
import { validateDoctorTokens } from "../middleware/tokenValidation";
import upload from "../services/upload";
import { SlotRepository } from "../repository/slotRepository";
import uploadDoc from "../services/uploadDoc";
import { AppointmentRepository } from "../repository/appointmentRepository";
import { AppointmentUseCase } from "../../usecases/appointmentUsecase";
import { AppointmentController } from "../../controller/appointmentController";
import { ParentRepository } from "../repository/parentRepository";
import checkBlockedStatus from "../middleware/checkBlockedStatus";
import { ChatRepository } from "../repository/chatRepository";
import { ChatUseCase } from "../../usecases/chatUsecases";
import { ChatController } from "../../controller/chatController";

const doctorRouter = express.Router();
const sendEmail = new SendEmail();
const slotRepository = new SlotRepository();
const doctorRepository = new DoctorRepository();
const doctorUseCase = new DoctorUseCase(
  doctorRepository,
  sendEmail,
  slotRepository
);
const controller = new DoctorController(doctorUseCase);

const parentRepository = new ParentRepository();
//appointment
const appointmentRepository = new AppointmentRepository();
const appointmentUsecase = new AppointmentUseCase(
  appointmentRepository,
  parentRepository,
  doctorRepository
);
const appointmentController = new AppointmentController(appointmentUsecase);

//chat
const chatRepository = new ChatRepository()
const chatUsecase = new ChatUseCase(chatRepository)
const chatController = new ChatController(chatUsecase)

//signup
doctorRouter.post("/signup", uploadDoc.single("document"), (req, res, next) => {
  controller.createDoctor(req, res, next);
});

//verify-otp
doctorRouter.post("/verify-otp", (req, res, next) => {
  controller.verifyOtp(req, res, next);
});

//resend-otp
doctorRouter.post("/resend-otp", (req, res, next) => {
  controller.resendOtp(req, res, next);
});

//login
doctorRouter.post("/login", (req, res, next) => {
  controller.loginDoctor(req, res, next);
});

//forgot-password
doctorRouter.post("/forgot-pwd", (req, res, next) => {
  controller.forgotPassword(req, res, next);
});

//verifyOtp
doctorRouter.post("/verifyOtp", (req, res, next) => {
  controller.verifyforForgotPassword(req, res, next);
});

//resendOtp
doctorRouter.post("/resendOtp", (req, res, next) => {
  controller.resendforForgotPassword(req, res, next);
});

//for new password
doctorRouter.post("/new-password", (req, res, next) => {
  controller.passwordSaver(req, res, next);
});

//fetch data
doctorRouter.get(
  "/doctor-profile",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.fetchDoctorData(req, res, next);
  }
);

//update data
doctorRouter.post(
  "/updateprofile",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  upload,
  (req, res, next) => {
    controller.updateProfile(req, res, next);
  }
);

//change password
doctorRouter.post(
  "/change-password",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.changePassword(req, res, next);
  }
);

//refresh access token
doctorRouter.post("/refreshToken", (req, res, next) => {
  controller.refreshToken(req, res, next);
});

//save time slots
doctorRouter.post(
  "/slots",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.saveSlots(req, res, next);
  }
);

//rrule
doctorRouter.post('/rruleslots',  validateDoctorTokens("Doctor"), checkBlockedStatus, (req,res,next)=>{
  controller.createSlotsUsingRule(req,res,next)
})

doctorRouter.post('/saveslots', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next) => {
  controller.saveCreatedSlots(req,res,next)
})

//fetch time slots
doctorRouter.get(
  "/fetchslots",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.fetchSlots(req, res, next);
  }
);

//change availability
doctorRouter.put(
  "/:id/availability",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.changeAvailability(req, res, next);
  }
);

//delete slot
doctorRouter.delete(
  "/:id/delete",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.deleteSlot(req, res, next);
  }
);

//fetchappointments
doctorRouter.get(
  "/getappointments",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    appointmentController.getDoctorAppointments(req, res, next);
  }
);

//changestatus
doctorRouter.put(
  "/:id/status",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    appointmentController.changeStatus(req, res, next);
  }
);

//notifications
doctorRouter.get(
  "/notifications/:id",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  async (req, res, next) => {
    controller.getNotifications(req, res, next);
  }
);

doctorRouter.get(
  "/clearNotifications",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  async (req, res, next) => {
    controller.clearNotifications(req, res, next);
  }
);


//notification-read
doctorRouter.post(
  "/mark-notification-read",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    controller.changeToRead(req, res, next);
  }
);

//search parents
doctorRouter.get('/parents',validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next)=>{
  chatController.searchParent(req,res,next)
})

//fetch messages
doctorRouter.get(
  "/fetchmessages",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    chatController.fetchMessages(req, res, next);
  }
);

//save message
doctorRouter.post(
  "/savemessage",
  validateDoctorTokens("Doctor"),
  checkBlockedStatus,
  (req, res, next) => {
    chatController.saveMessage(req, res, next);
  }
);

//chat lists
doctorRouter.get('/chatlists',validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next)=>{
  chatController.chatLists(req,res,next)
})

doctorRouter.delete('/deletechats/:id', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next) => {
  chatController.deleteDoctorChat(req,res,next);
})

//update to completed
doctorRouter.put('/updateStatus/:id', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next)=>{
  appointmentController.updateStatus(req,res,next)
})

//prescription
doctorRouter.post('/prescription', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next) => {
  appointmentController.savePrescription(req,res,next)
})

//fetch prescription
doctorRouter.get('/prescription/:id', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next)=>{
  appointmentController.fetchPrescription(req,res,next)
})

//patients
doctorRouter.get('/patients',validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next)=>{
  controller.fetchPatients(req,res,next)
})

//history
doctorRouter.get('/appointment-history/:id/:name', validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next) => {
  appointmentController.fetchHistory(req,res,next)
})

//logout
doctorRouter.post("/logout", (req, res, next) => {
  controller.logoutDoctor(req, res, next);
});

//doctor dashboard
doctorRouter.get('/fetchDashboardData',validateDoctorTokens('Doctor'), checkBlockedStatus, (req,res,next) => {
  controller.dashboardData(req,res,next)
})

export default doctorRouter;
