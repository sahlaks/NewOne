import mongoose, { Document, Schema } from "mongoose";

interface ISlot extends Document{
    _id: string
    date: string
    startTime: string
    endTime: string
    isAvailable: boolean
    status: string
    doctorId: mongoose.Schema.Types.ObjectId
}

export default ISlot;