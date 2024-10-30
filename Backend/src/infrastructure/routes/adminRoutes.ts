import exress from 'express';
import { AdminController } from '../../controller/adminController';
import { AdminUseCase } from '../../usecases/adminUsecases';
import { AdminRepository } from '../repository/adminRepository';
import { ParentRepository } from '../repository/parentRepository';
import { DoctorRepository } from '../repository/doctorRepository';
import SendEmail from '../services/mailService';

const adminRouter = exress.Router()
const sendEmail = new SendEmail()
const parentRepository = new ParentRepository()
const doctorRepository = new DoctorRepository()
const adminRepository = new AdminRepository()
const adminUsecase = new AdminUseCase(adminRepository, parentRepository, doctorRepository, sendEmail)
const controller = new AdminController(adminUsecase)

adminRouter.post('/admin-login',(req,res,next) => {
    controller.adminLogin(req,res,next);
})

adminRouter.get('/fetch-parents',(req,res,next) => {
    controller.fetchParents(req,res,next)
})

adminRouter.put('/block-parent/:id',(req,res,next) => {
    controller.blockAParent(req,res,next)
})

adminRouter.delete('/delete-parent/:id',(req,res,next) => {
    controller.deleteAParent(req,res,next)
})

adminRouter.get('/fetch-doctors',(req,res,next) => {
    controller.fetchdoctors(req,res,next)
})

adminRouter.put('/doctor/:id/block',(req,res,next) => {
    controller.blockDoctor(req,res,next)
})

adminRouter.post('/doctor/:id/verify',(req,res,next) => { 
    controller.verifyDoctor(req,res,next)
})

adminRouter.delete('/doctor/:id/delete',(req,res,next) => {
    controller.deleteDoctor(req,res,next)
})

adminRouter.post('/doctor/:id/reject',(req,res,next) => {
    controller.rejectDoctor(req,res,next)  
})

adminRouter.get('/appointments-per-month',(req,res,next) => {
    controller.fetchAppointments(req,res,next)
})

adminRouter.get('/gender-distribution',(req,res,next) => {
    controller.fetchGenderData(req,res,next)
})

adminRouter.get('/appointment-status',(req,res,next) => {
    controller.fetchAppointmentStatus(req,res,next)
})

adminRouter.get('/user-growth',(req,res,next) => {
    controller.fetchUserCount(req,res,next)
})

adminRouter.get('/slot-usage',(req,res,next) => {
    controller.fetchSlotUsage(req,res,next)
})

export default adminRouter