import mongoose, { Model, Schema } from "mongoose";
import INotification from "../../domain/entity/notification";

const notificationSchema: Schema<INotification> = new mongoose.Schema({
    
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Parent'
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    message: {type: String},
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    toParent: {type: Boolean}
})

const notificationModel: Model<INotification> = mongoose.model('Notification', notificationSchema)
export default notificationModel
