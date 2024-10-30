import mongoose from "mongoose";

interface IAppointment extends Document {
    _id: string
    name: string
    age: number
    gender: string
    doctorId: mongoose.Schema.Types.ObjectId
    doctorName: string
    parentId: mongoose.Schema.Types.ObjectId
    parentName: string
    childId: mongoose.Schema.Types.ObjectId
    slotId: string
    date: string
    startTime: string
    endTime: string
    fees: number
    prescription: boolean
    appointmentStatus: string
    paymentStatus: string

}

export default IAppointment