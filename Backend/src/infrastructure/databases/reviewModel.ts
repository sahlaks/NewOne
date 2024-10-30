import mongoose, { Model, Schema } from "mongoose";
import IReview from "../../domain/entity/review";

const reviewSchema: Schema<IReview> = new mongoose.Schema({
    
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Parent'
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    parentName: {type: String},
    reviewRating: {type: Number},
    feedback: {type: String},
    },
    {timestamps: true})

const reviewModel: Model<IReview> = mongoose.model('Review', reviewSchema)
export default reviewModel
