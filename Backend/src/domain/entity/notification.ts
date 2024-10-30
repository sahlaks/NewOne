import { Schema } from "mongoose"

interface INotification extends Document {
    _id: string
    parentId: Schema.Types.ObjectId
    doctorId: Schema.Types.ObjectId
    appointmentId: Schema.Types.ObjectId
    message: string
    isRead: boolean
    createdAt: Date
    toParent: boolean
}

export default INotification