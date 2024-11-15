import { bool } from "aws-sdk/clients/signer";
import IAppointment from "../domain/entity/Appointment";
import { IAppointmentRepository } from "./interface/IAppointmentRepositiry";
import { IParentRepository } from "./interface/IParentRepository";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import IPrescription from "../domain/entity/prescription";

export class AppointmentUseCase {
    private iappointmentRepository: IAppointmentRepository;
    private iparentRepository: IParentRepository;
    private idoctorRepository: IDoctorRepository;
    constructor(appointmentRepository: IAppointmentRepository, parentRepository: IParentRepository, doctorRepository: IDoctorRepository) {
        this.iappointmentRepository = appointmentRepository;
        this.iparentRepository = parentRepository;
        this.idoctorRepository = doctorRepository;
    }

/*..............................saving appointment details...................................*/
async savePendingAppointment(details: any): Promise<{status: boolean; message?: string; data?: IAppointment}> {
    const appointment = {
        ...details,
        appointmentStatus: "Pending",
        paymentStatus: "Pending"
      };
      const savedAppointment = await this.iappointmentRepository.saveData(appointment);
      if(savedAppointment) return {status: true, message: 'Appointment Saved', data: savedAppointment}
      else return {status: false, message: 'Failed to save'}
    }

/*.............................updating success payment...................................*/
async updateSuccessPayment(id: string, parentId: string): Promise<{status: boolean; message?: string; data?: IAppointment}> {
    const update = await this.iappointmentRepository.updateData(id);
    if(update) {
        const message = `New appointment scheduled for ${update.childId ? update.name : 'a child'} for you on ${update.date} from ${update.startTime} to ${update.endTime}.`;
        const notificationData = {
            parentId: update.parentId,
            doctorId: update.doctorId,
            appointmentId: update._id,
            message: message,
            isRead: false,
            toParent: false,
          };
        const notify = await this.iappointmentRepository.sendNotification(notificationData)
        
        const parent = await this.iparentRepository.updateParentwithPayment(update._id, parentId)
        return {status: true, message: 'Updated Successfully', data:update}
    }
    else return {status: false, message: 'Failed to save'}
    }

/*.......................................failure updating...........................................*/
async updateFailurePayment(id: string): Promise<{status: boolean; message?: string}>{
    const update = await this.iappointmentRepository.updateFailure(id)
    if(update) return {status: true, message: 'Updated Successfully'}
    return {status: false, message: 'Failed to update'}
    }

/*.........................................get appointments.......................................*/
async fetchAppointment(id: string, page: number, limit: number, search: string, status: string): Promise<{status: boolean; message?: string; data?: IAppointment[]; totalPages?: number}>{
    const appointments = await this.iappointmentRepository.fetchAppointments(id,page,limit,search,status)
    const totalAppointments = await this.iappointmentRepository.countDocuments(id)
    const totalPages = Math.ceil(totalAppointments / limit);
    if(appointments) return {status:true, message: 'Appointments details fetched successfully', data: appointments, totalPages: totalPages}
    return {status: false, message: 'Error in fetching appointments details'}
    
    }

/*.........................................fetch doctor's appointments...........................*/
async fetchDoctorsAppointments(id: string, page: number, limit: number): Promise<{status: boolean; message?: string; data?: IAppointment[]; totalPages?: number}>{
    const appointments = await this.iappointmentRepository.fetchDoctorAppointments(id,page,limit)
    const total = await this.iappointmentRepository.countDoctorDocuments(id)
    const totalPages = Math.ceil(total / limit);
    if(appointments) return {status: true, message: 'Appointments fetched successfully!!', data: appointments, totalPages: totalPages}
    return {status: false, message: 'Error in fetching appointments details'}
    }

/*........................................change status of appointment..................................*/
async changeStatusOfAppointment(appointmentId: string, status: string, doctorId: string): Promise<{status: boolean; message?: string; data?: IAppointment}>{
    const update = await this.iappointmentRepository.updateAppointment(appointmentId,status)
    if(update) {
        const message = `Dear Parent, your appointment has been ${status} for ${update.childId ? update.name : 'a child'} on ${update.date} from ${update.startTime} to ${update.endTime}.`;
        const notificationData = {
            parentId: update.parentId,
            doctorId: update.doctorId,
            appointmentId: update._id,
            message: message,
            isRead: false,
            toParent: true,
          };
        await this.iappointmentRepository.sendNotification(notificationData)
        if(status=== 'Scheduled')
            await this.idoctorRepository.updateDoctorwithApointment(update._id, doctorId)
        return {status: true, message: 'Status updated successfully!', data: update}
        }
    return {status: false, message: 'Error in updating status'}
    }

    /*.............................status to completed.................................*/
    async changeToCompleted(appointmentId: string, doctorId: string): Promise<{status: boolean; message?: string}>{
        await this.iappointmentRepository.updateAppointment(appointmentId,'Completed')
        return {status: true, message: 'Status updated successfully!'}
    }

    /*....................................save prescription......................................*/
    async savePrescription(data: {id: string,data:{id:string, text:string}[]}): Promise<{status: boolean}>{
        await this.iappointmentRepository.updateAndSave(data)
        return {status: true}
    }

    /*............................................fetch prescription..................................*/
    async fetchPrescription(id: string): Promise<{status: boolean; data?: IPrescription}>{
        const res = await this.iappointmentRepository.findUsingId(id)
        if(res) return {status: true, data:res}
        return {status: false}
    }

    /*...........................................history...........................................*/
    async getHistory(childId: string, doctorId: string, name: string): Promise<{status: boolean; data?: IAppointment[]; message?: string}>{
        const res = await this.iappointmentRepository.findUsingChildId(childId, doctorId, name)
        if(res) return {status: true, data:res}
        return {status: false, message: 'No history!'}
    }
}