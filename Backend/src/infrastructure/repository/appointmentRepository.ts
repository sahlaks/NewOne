import mongoose from "mongoose";
import IAppointment from "../../domain/entity/Appointment";
import INotification from "../../domain/entity/notification";
import IPrescription from "../../domain/entity/prescription";
import { IAppointmentRepository } from "../../usecases/interface/IAppointmentRepositiry";
import appointmentModel from "../databases/appointmentModel";
import notificationModel from "../databases/notificationModel";
import prescriptionModel from "../databases/prescriptionModel";
import slotModel from "../databases/slotModel";

export class AppointmentRepository implements IAppointmentRepository{
    
    /*..........................saving appointment as pending......................................*/
    async saveData(appointment: any): Promise<IAppointment | null> {
        try {
        const data = new appointmentModel(appointment);
        const savedAppointment = await data.save();
        return savedAppointment
    }  catch (error) {
        console.error("Error saving appointment:", error);
        return null;
    }
    }

    /*.................................update appointment................................................*/
    async updateData(id: string): Promise<IAppointment | null> {
        try{
            const data = await appointmentModel.findByIdAndUpdate(id,{paymentStatus: 'Success'},{new: true})
            const slot = await slotModel.findByIdAndUpdate(data?.slotId,{status: 'Booked'})
            return data;
        } catch (error) {
          console.error('Error updating appointment:', error);
          return null;
        }
    }

    /*...................................update failure...............................................*/
    async updateFailure(id: string): Promise<IAppointment | null> {
        try{
            const data = await appointmentModel.findByIdAndUpdate(id,{paymentStatus: 'Failed'},{new: true})
            return data;
        } catch(error) {
            console.error('Error in updating')
            return null;
        }
    }

    /*............................................send notification...................................*/
    async sendNotification(notificationData: any): Promise<INotification | null> {
        try{
            const notification = new notificationModel(notificationData)
            const savedOne = await notification.save()
            return savedOne
        } catch(error) {
            console.error('Error in saving notification')
            return null;
        }
    }

    /*.........................................fetch appointments....................................*/
    async fetchAppointments(id: string, page: number, limit: number): Promise<IAppointment[] | null> {
        try{
            const skip = (page - 1) * limit;
            const appointments = await appointmentModel.find({parentId:id,paymentStatus: "Success"}).skip(skip).limit(limit).sort({createdAt:-1})
            return appointments
        } catch(error){
            return null
        }
    }

    async countDocuments(id: string): Promise<number> {
        return appointmentModel.countDocuments({parentId: id, paymentStatus: "Success"})
      }
      
    /*......................................fetch doctor's appointments............................*/
    async fetchDoctorAppointments(id: string, page: number, limit: number): Promise<IAppointment[] | null> {
        try{
            const skip = (page - 1) * limit;
            const appointments = await appointmentModel.find({doctorId:id,paymentStatus: "Success"}).skip(skip).limit(limit).sort({createdAt: -1})
            return appointments
        } catch(error){
            return null
        }
    }

    async countDoctorDocuments(id: string): Promise<number> {
        return appointmentModel.countDocuments({doctorId: id, paymentStatus: "Success"})
    }

    /*..................................change status of appointment.............................*/
    async updateAppointment(id: string, status: string): Promise<IAppointment | null> {
        try{
            const updatedOne = await appointmentModel.findByIdAndUpdate(
                id,
                {$set:{
                appointmentStatus: status}},
            {new: true});
            return updatedOne;
        } catch(error){
            return null
        }
    }

    /*...................................update and save..........................................*/
    async updateAndSave(data: { id: string; data: { id: string; text: string; }[]; }): Promise<boolean> {
        try {
            const objectId = new mongoose.Types.ObjectId(data.id)
            const prescription = new prescriptionModel({ data: data.data, appointmentId: objectId});
            const r = await prescription.save();
            await appointmentModel.findByIdAndUpdate(data.id, { prescription: true });
    
            return true 
        } catch (error) {
            throw error;
        }
    }

    /*....................................get prescription.............................*/
    async findUsingId(id: string): Promise<IPrescription | null> {
        const res = await prescriptionModel.findOne({appointmentId: id}) 
        return res;
    }
    
    /*...................................................history......................................*/
    async findUsingChildId(childId: string, doctorId: string, cname: string): Promise<IAppointment[]> {
        const cId = childId && mongoose.isValidObjectId(childId) ? new mongoose.Types.ObjectId(childId) : null;        
        const dId = new mongoose.Types.ObjectId(doctorId)
        
        const res = await appointmentModel.aggregate([
            {
                $match: {
                    doctorId: dId,
                    name: cname,
                    $or: [
                        { childId: cId },  
                        { childId: null }   
                    ]
                },
            },
            {
                $lookup: {
                    from: "prescriptions",
                    localField: "_id",
                    foreignField: "appointmentId",
                    as: "prescriptionDetails",
                },
            },
            {
                $unwind: {
                    path: "$prescriptionDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,            
            doctorId: 1,
            doctorName: 1,           
             age:1,
             gender:1,           
            date: 1,              
            startTime: 1,          
            endTime: 1,            
            appointmentStatus: 1,  
            fees:1,
            paymentStatus: 1,  
            prescription: 1,    
            "prescriptionDetails.data": 1
                }
            }
        ]);
        return res;
    }

    
}