import mongoose from "mongoose";
import { ISlotRepository } from "../../usecases/interface/ISlotRepository";
import ISlot from "../../domain/entity/slots";
import slotModel from "../databases/slotModel";
import ruleModel from "../databases/ruleModel";

export class SlotRepository implements ISlotRepository{

    /*............................................create slots......................................*/
    async createSlot(data: { date: string; startTime: string; endTime: string; doctorId: string}): Promise<ISlot | null> {
        try {
            const newSlot = new slotModel({
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                doctorId: data.doctorId 
            });
            const savedSlot = await newSlot.save();
            return savedSlot;
        }catch (error) {
            console.error("Error creating slot:", error);
            return null;
        }
    }

    /*...................................fetch slots...........................................*/
    async fetchSlots(id: string, page: number, limit: number, search: string, available: string): Promise<ISlot[] | null> {
        try{
            const skip = (page - 1) * limit;
            const filter: any = { doctorId: id };

            const today = new Date();
            const formattedToday = today.toISOString().split('T')[0];
            today.setHours(0, 0, 0, 0);
            filter.date = { $gte: formattedToday };

            if (available) {
                filter.isAvailable = available === 'true';
            }
            if (search) {
                filter.$or = [
                    { day: { $regex: search, $options: 'i' } },
                    { date: { $regex: search, $options: 'i' } }
                ];
            }

            const slots = await ruleModel.find(filter).skip(skip).limit(limit).sort({createdAt: -1});
            return slots
        }catch(error){
            console.error("Error fetching slot:", error);
            return null;
        }
    }

    async countDocuments(id: string): Promise<number> {
        const res = await ruleModel.countDocuments({doctorId: id})
        return res
        
    }


    /*..........................................available slots for doctor..............................*/
    async fetchAvailableSlots(id: string): Promise<ISlot[] | null> {
        try{
            const slots = await ruleModel.find({doctorId: id, isAvailable: true, status: 'Available'})
            return slots
        }catch(error){
            console.error("Error fetching slot:", error);
            return null;
        }
    }

    /*..................................update Slot availability......................................*/
    async updateSlot(slotId: string, doctorId: string): Promise<ISlot | null> {
        try{
            const slot = await ruleModel.findById(slotId)
            if(slot){
                if (slot.doctorId.toString() !== doctorId) return null;
                 slot.isAvailable = !slot.isAvailable;
                await slot.save();
                return slot
            }
            return null;

        } catch(error){
            return null
        }
    }

    /*.........................................delete slot................................*/
    async deleteSlot(slotId: string, doctorId: string): Promise<ISlot | null>{
        try{
            const deletedSlot = await ruleModel.findOneAndDelete({ _id: slotId, doctorId: doctorId });
            return deletedSlot
        }catch(error){
            return null
        }
    }

    /*.................................deleting slots.................................*/
        async deleteSlotsBefore(date: Date): Promise<number> {
            try {
                const result = await ruleModel.deleteMany({
                    date: { $lt: date },
                });
                return result.deletedCount || 0;
            } catch (error) {
                console.error('Error deleting slots:', error);
                throw new Error('Could not delete slots')
            }
        }


} 