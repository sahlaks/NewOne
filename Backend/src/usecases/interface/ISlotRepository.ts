import mongoose, { Schema } from "mongoose";
import ISlot from "../../domain/entity/slots";


export interface ISlotRepository{
   createSlot(slots: { date: string; startTime: string; endTime: string; doctorId: string}): Promise<ISlot | null>
   fetchSlots(id: string, page: number, limit: number): Promise<ISlot[] | null>
   countDocuments(id: string): Promise<number>
   fetchAvailableSlots(id: string): Promise<ISlot[] | null>
   updateSlot(slotId: string, doctorId: string): Promise<ISlot | null>
   deleteSlot(slotId: string, doctorId: string): Promise<ISlot | null>
   deleteSlotsBefore(date: any): Promise<number>
}
