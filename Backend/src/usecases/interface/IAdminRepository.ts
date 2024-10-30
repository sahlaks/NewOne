import IAdmin from "../../domain/entity/admin";
import IAppointment from "../../domain/entity/Appointment";
import ISlot from "../../domain/entity/slots";

export interface IAdminRepository{
    findAdminByEmail(email: string): Promise<IAdmin | null>
    findAppointments(): Promise<IAppointment[] | null>
    findDetails(): Promise<{ _id: string, count: number}[]>
    findAppointmentStatus(): Promise<IAppointment[] | null>
    findUsers(): Promise<{ doctors: any[], parents: any[]}>
    findSlots(): Promise<{totalScheduled: Number, totalCanceled: Number}>
}