import mongoose  from "mongoose"

interface IFeedback extends Document {
    _id: string
    parentId: mongoose.Types.ObjectId
    message: string
    createdAt: Date
}

export default IFeedback