import mongoose, { Model, Schema } from "mongoose"
import IChat from "../../domain/entity/chat"


const chatSchema: Schema<IChat> = new mongoose.Schema({
    senderId: {type: String},
    receiverId: {type: String},
    message: {type: String},
    read: {type: Boolean,
        default: false},
    visibleToParent: {type: Boolean,
        default: true},
    visibleToDoctor: {type: Boolean,
        default: true}
    },
{ timestamps: true }
)

const chatModel: Model<IChat> = mongoose.model('Chat', chatSchema)

export default chatModel