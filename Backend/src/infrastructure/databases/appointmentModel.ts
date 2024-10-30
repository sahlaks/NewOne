import mongoose, { Model, Schema } from "mongoose";
import IAppointment from "../../domain/entity/Appointment";

const appointmentSchema: Schema<IAppointment> = new mongoose.Schema({
    name: {type: String},
    age: {type: Number},
    gender: {type: String},
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'},
    doctorName: {type: String},
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'},
    parentName: {type: String},
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'},
    slotId: {type: String},
    date: {type: String},
    startTime: {type: String},
    endTime: {type: String},
    fees: {type: Number},
    prescription: {
        type: Boolean,
        default: false},
    appointmentStatus: {
        type: String,
        enum: ['Pending', 'Scheduled', 'Completed', 'Canceled'],
        default: 'Pending'},
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'}
},
{
    timestamps: true
})

const appointmentModel: Model<IAppointment> = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
