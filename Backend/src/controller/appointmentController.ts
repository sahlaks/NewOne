import { Request, Response, NextFunction } from "express";
import { createCheckoutSession, retrieveSession } from "../infrastructure/services/stripeService";
import { AppointmentUseCase } from "../usecases/appointmentUsecase";
import { AuthRequest } from "../domain/entity/types/auth";
import { Auth } from "aws-sdk/clients/docdbelastic";

export class AppointmentController {
    constructor( private AppointmentUsecase: AppointmentUseCase) {}

    /*.............................................calling stripe.........................................*/
    async callingStripe(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
        const parentId = req.user?.id as string
        const { amount, name, age, gender, doctorId, doctorName, parentName, childId, date, startTime, endTime, fees, slotId } = req.body;
        const appointmentDetails = {
            name,
            age,
            gender,
            doctorId,
            doctorName,
            parentId,
            parentName,
            childId,
            slotId,
            date,
            startTime,
            endTime,
            fees
          };
         
        try {
            const result = await this.AppointmentUsecase.savePendingAppointment(appointmentDetails)
            if (!result.status) return res.status(400).json({ error: result.message });
            const appointmentId = result.data?._id;
            const appointmentIdString = String(appointmentId);
            const session = await createCheckoutSession(amount, appointmentIdString); 
            res.status(200).json({ id: session.id });
        } catch (error) {
          next(error)
        }
    }

    /*......................................success update...............................................*/
    async successUpdate(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const parentId = req.user?.id as string
        const sessionId = req.params.session_id;
        try{
            const session = await retrieveSession(sessionId)
            if(session) {
                var appointmentId = session.metadata?.appointmentId;
                const result = await this.AppointmentUsecase.updateSuccessPayment(appointmentId as string, parentId)
                if(result.status) return res.status(200).json({success: true, message: 'Appointment Saved Successfully', data: result.data})
                else return res.status(400).json({success: false, message: 'Payment Failed'})
            }  
        } catch (error){
            next(error)
        } 
    }

    /*...........................................making failure........................................*/
    async failureUpdate(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const parentId = req.user?.id as string
        const sessionId = req.params.session_id;
         try{
            const session = await retrieveSession(sessionId)
            if(session) {
                var appointmentId = session.metadata?.appointmentId;
                const result = await this.AppointmentUsecase.updateFailurePayment(appointmentId as string)
                if(result.status) return res.status(200).json({success: true, message: 'Appointment Failed'})
                else return res.status(400).json({success: false, message: 'Payment Failed'})
            }
        } catch(error) {
            next(error)
        }
    }

    /*......................................get appointments...................................*/
    async getAppointments(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
        const parentId = req.user?.id as string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
      
        try{
            const result = await this.AppointmentUsecase.fetchAppointment(parentId,page,limit)
            if(result.status) return res.status(200).json({success: true, message: result.message, data: result.data, totalPages: result.totalPages, currentPage: page})
            return res.status(400).json({success: false})
        } catch(error){
            next(error)}
    }

    /*......................................get doctor appointments...........................................*/
    async getDoctorAppointments(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const doctorId = req.user?.id as string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;

        try{
            const result = await this.AppointmentUsecase.fetchDoctorsAppointments(doctorId,page,limit)
            if(result.status) return res.status(200).json({success: true, message: result.message, data: result.data, totalPages: result.totalPages, currentPage: page})
            return res.status(400).json({success: false})
        } catch(error){
            next(error)} 
    }

    /*..................................change status of appointment................................*/
    async changeStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const doctorId = req.user?.id as string
        const {status} = req.body
        const appointmentId = req.params.id
        try{
            const result = await this.AppointmentUsecase.changeStatusOfAppointment(appointmentId,status,doctorId)
            if(result.status) return res.status(200).json({success: true, message: result.message, data: result.data})
            return res.status(400).json({success: false})
        } catch(error){
            next(error)
        } 
    }

    /*...................................change status to completed..........................................*/
    async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const doctorId = req.user?.id as string
        const appointmentId = req.params.id
        try{
            const result = await this.AppointmentUsecase.changeToCompleted(appointmentId,doctorId)
            if(result.status) return res.status(200).json({success: true, message: result.message})
            return res.status(400).json({success: false})
        }catch(error){
            next(error)
        }   
    }

    /*.................................................save prescription...............................................*/
    async savePrescription(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        try{
        const result = await this.AppointmentUsecase.savePrescription(req.body)
        if(result.status) return res.status(200).json({success: true})
            return res.status(400).json({success: false})
        }catch(error){
            next(error)
        }   
    }

    /*..............................................fetch prescription................................................*/
    async fetchPrescription(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const id = req.params.id
            const result = await this.AppointmentUsecase.fetchPrescription(id)
            if(result.status) return res.status(200).json({success: true, data: result.data})
            return res.status(400).json({success: false})
            }catch(error){
                next(error)
            }  
    }

    /*.....................................................fetch history....................................................*/
    async fetchHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
        const id = req.user?.id as string;
        const childId = req.params.id;
        const name = req.params.name;
        try{
            const result = await this.AppointmentUsecase.getHistory(childId,id,name)
            if(result.status) return res.status(200).json({success: true, data: result.data})
            return res.status(400).json({success: false})
        }catch(error){
            next(error)
        }
        
    }

}
