import mongoose, { Schema } from "mongoose"

interface IReview extends Document {
    _id: string
    parentId: mongoose.Types.ObjectId
    doctorId: mongoose.Types.ObjectId
    parentName: string
    reviewRating: number
    feedback: string
}

export default IReview