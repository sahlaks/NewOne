import mongoose, { mongo } from "mongoose";
import IDoctor from "../../domain/entity/doctor";
import INotification from "../../domain/entity/notification";
import IAppointment from "../../domain/entity/Appointment";
import IReview from "../../domain/entity/review";

export interface IDoctorRepository{
    findDoctorByEmail(email: string): Promise<IDoctor | null>;
    saveUserDetails(data: IDoctor): Promise<IDoctor | null>;
    updateDoctorDetails(email: string, password: string): Promise<IDoctor | null>;
    updateDoctorPassword(id: string, password: string): Promise<IDoctor | null>
    findDoctor(query: string, skip: number, limit: number): Promise<IDoctor[] | null>
    findDetailsById(id: string): Promise< IDoctor | null>;
    findDoctorByIdandUpdate(id: string, update: object): Promise<IDoctor | null>
    findAndVerify(id: string): Promise<IDoctor | null>
    findAndDeleteById(id: string): Promise<IDoctor | null>
    saveDoctor(data: IDoctor): Promise<IDoctor | null>
    findDoctors(query: string, skip: number, limit: number, isVerified: boolean): Promise<IDoctor[] | null>
    countDocuments(query: string, isVerified: boolean): Promise<number>
    countAll(isVerified: boolean): Promise<number>
    collectDocData(skip: number, limit: number, isVerified: boolean): Promise<IDoctor[]>
    updateDoctorwithApointment(id: string, doctorId: string): Promise<boolean>
    getNotifications(id: string): Promise<INotification[] | null>
    clearAll(id: string): Promise<{success: boolean, message: string}>
    makeRead(id: string): Promise<boolean>
    fetchPatients(id: string, page: number, limit: number, search: string): Promise<{data: IAppointment[], total: number}>
    fetchParentCount(id: string): Promise<number>
    countScheduled(id: string): Promise<number>
    countCompleted(id: string): Promise<number>
    revenue(id: string): Promise<number>
    latest(id: string): Promise<IAppointment|null>
    analytics(id: string): Promise<{ totalRevenue: number; totalAppointments: number}>  
    countPending(id: string): Promise<number>
    feedback(id: string): Promise<IReview | null>
}