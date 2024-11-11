import mongoose, { Document } from "mongoose";

interface IRule extends Document{
    _id: string
    date: string
    day: string
    startTime: string
    endTime: string
    isAvailable: boolean
    status: string
    doctorId: mongoose.Schema.Types.ObjectId
}

export default IRule;