import IAdmin from "../domain/entity/admin";
import IParent from "../domain/entity/Parents";
import { jwtCreation } from "../infrastructure/services/JwtCreation";
import { IAdminRepository } from "./interface/IAdminRepository";
import bcrypt from 'bcrypt';
import { IParentRepository } from "./interface/IParentRepository";
import { log } from "util";
import { bool } from "aws-sdk/clients/signer";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import IDoctor from "../domain/entity/doctor";
import SendEmail from "../infrastructure/services/mailService";
import IAppointment from "../domain/entity/Appointment";
import ISlot from "../domain/entity/slots";

export class AdminUseCase {
    private adminRepository: IAdminRepository;
    private parentRepository: IParentRepository;
    private doctorRepository: IDoctorRepository;
    private SendEmail: SendEmail;
  
    constructor(adminRepository: IAdminRepository, parentRepository: IParentRepository, doctorRepository: IDoctorRepository, sendEmail: SendEmail) {
      this.adminRepository = adminRepository;
      this.parentRepository = parentRepository;
      this.doctorRepository = doctorRepository;
      this.SendEmail = sendEmail
    }

    /*..............................................find admin...................................................*/
    async findAdmin(email: string, password: string): Promise<{status: boolean, message?: string, data?: IAdmin, token?: string}> {
        const exist = await this.adminRepository.findAdminByEmail(email);
        if(exist){
            const isMatch = await bcrypt.compare(password, exist.password);
            if (!isMatch) {
                return { status: false, message: 'Invalid credentials'}
            }
            const accessToken = jwtCreation(exist._id, 'Admin')
            return { status: true, message: 'Admin logged successfully', data: exist, token: accessToken}
        } else {
            return {status: false, message: 'Admin not exists!'}
        }
    }

    /*.......................................collect parent data.........................................*/
    async collectParentData(page: number, limit: number): Promise<{status: boolean, message?: string, data?: IParent[], totalPages?: number}> {
        const parent = await this.parentRepository.findParent(page,limit)
        const totalParents = await this.parentRepository.countDocuments();
        const totalPages = Math.ceil(totalParents / limit);
        if(parent){
            return {status: true, message: 'Fetch Parent Data Successfully', data: parent,  totalPages: totalPages}
        }
        return {status: false, message: 'No data available'}
    }

    /*..........................................find parent by id and block..........................................*/
    async findParentAndBlock(id: string): Promise<{status: boolean; message?: string; data?: IParent}> {
        const parent = await this.parentRepository.findDetailsById(id)
        if(parent){
            const updated = await this.parentRepository.findParentByIdandUpdate(id,{isBlocked: !parent.isBlocked})
            if(updated){
                const message = updated.isBlocked ? 'User blocked' : 'User unblocked';
                return { status: true, message, data: updated };
            }
        }
        return { status: false, message: 'User does not exist' };
    }

    /*........................................find and delete parent..................................*/
    async findAndDelete(id: string): Promise<{status: boolean; message?: string}>{
        const parent = await this.parentRepository.findAndDeleteById(id)
        if(!parent) return { status: false, message: 'Parent not found' };
        return {status: true, message: 'Parent deleted successfully!'}
    }

    /*.............................................collect doctor data...........................................*/
    async collectDoctorData(query: string, page: number, limit: number, isVerified: boolean): Promise<{status: boolean, message?: string, data?: IDoctor[]}> {
        const skip = (page - 1) * limit;
        const doctor = await this.doctorRepository.findDoctors(query, skip, limit, isVerified)
        if(doctor){
            return {status: true, message: 'Fetch Doctor Data Successfully', data: doctor}
        }
        return {status: false, message: 'No data available'}
    } 

    async countSearchResults(query: string, isVerified: boolean): Promise<number> {
        return await this.doctorRepository.countDocuments(query, isVerified)
    }

    async countAllDoctors(isVerified: boolean): Promise<number>{
        return await this.doctorRepository.countAll(isVerified)
    }

    async collectDocData(page: number, limit: number,isVerified: boolean): Promise<{data: IDoctor[]}>{
        const skip = (page - 1) * limit;
        const doctors = await this.doctorRepository.collectDocData(skip, limit, isVerified);
        return { data: doctors};
    }

    /*..........................................find doctor and block.................................*/
    async findAndBlockDoctor(id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findDetailsById(id)
        if(doc){
            const updated = await this.doctorRepository.findDoctorByIdandUpdate(id,{isBlocked: !doc.isBlocked})
            if(updated){
                const message = updated.isBlocked ? 'Doctor blocked' : 'Doctor unblocked';
                return { status: true, message, data: updated };
            }
        }
        return { status: false, message: 'Doctor does not exist' };
    }

    /*......................................find doctor and verify..................................*/
    async verifyDoctorwithId (id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findDetailsById(id)
        if(doc){
            if (doc.isVerified) return { status: false, message: 'Doctor is already verified' };
            
            const updated = await this.doctorRepository.findAndVerify(id)
            if(updated){
                const mailOptions = {
                    email: updated.email,
                    subject: `Dr. ${updated.doctorName}, verification process `,
                    code: 'You are Successfully Verified',
                  };
                  await this.SendEmail.sendEmail(mailOptions);
            
                return { status: true, message: 'Doctor is verified and send email', data:updated };
            }
        }
        return { status: false, message: 'Doctor does not exist' };
    }

    /*...........................................find and delete a doctor........................................*/
    async deleteDoctorwithId (id: string): Promise<{status: boolean; message?: string; data?: IDoctor}> {
        const doc = await this.doctorRepository.findAndDeleteById(id)
        if(!doc) return { status: false, message: 'Doctor not found' };
        return {status: true, message: 'Doctor deleted successfully!'}
    }

    /*.............................find and rejct..................................................... */
    async rejectWithId(id: string, reason: string): Promise<{status: boolean; message?: string}>{
        const doc = await this.doctorRepository.findDetailsById(id)
        if(doc){
            const mailOptions = {
                email: doc.email,
                subject: `Dr. ${doc.doctorName}, application rejection `,
                code: `You are Rejected due to ${reason}`,
              };
              await this.SendEmail.sendEmail(mailOptions);
            const d = await this.doctorRepository.findAndDeleteById(id)
            return { status: true, message: 'Doctor profile got rejected'}
        } else{
            return { status: false, message: 'Doctor does not exist' }; 
        }
    }

    /*..........................................appointments..................................................*/
    async collectAppointments(): Promise<{status: boolean; message?: string; data?: IAppointment[]}>{
        const appointments = await this.adminRepository.findAppointments()
        if(!appointments) return { status: false, message: 'No appointments' };
        return {status: true, message: 'Appointments fetched!', data: appointments}
    }

    /*.........................................gender status..........................................*/
    async collectGenderDetails(): Promise<{status: boolean; message?: string; data?: {_id: string, count: number}[]}>{
        const gender = await this.adminRepository.findDetails()
        if(!gender) return { status: false, message: 'No data' };
        return {status: true, message: 'Gender data fetched!', data: gender}
    }

    /*.............................................fetch appointments...........................................*/
    async collectAppointmentDetails(): Promise<{status: boolean; message?: string; data?:IAppointment[]}>{
        const status = await this.adminRepository.findAppointmentStatus()
        if(!status) return { status: false, message: 'No data' };
        return {status: true, message: 'Status fetched!', data: status}
    }

    /*.............................................user count...........................................*/
    async collectUserDetails(): Promise<{status: boolean; message?: string; data?:{ doctors: any[], parents: any[]}}>{
        const users = await this.adminRepository.findUsers()
        if(!users) return { status: false, message: 'No data' };
        return {status: true, message: 'Count fetched!', data: users}
    }

    /*.............................................slot count...........................................*/
    async collectSlots(): Promise<{status: boolean; message?: string; data?: {totalScheduled: Number, totalCanceled: Number}}>{
        const users = await this.adminRepository.findSlots()
        if(!users) return { status: false, message: 'No data' };
        return {status: true, message: 'Count fetched!', data: users}
    }

}