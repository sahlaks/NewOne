import mongoose, { Model, Schema } from "mongoose";
import IFeedback from "../../domain/entity/feedback";

const feedbackSchema: Schema<IFeedback> = new mongoose.Schema({
    
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Parent'
    },
    message: {type: String},
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const feedbackModel: Model<IFeedback> = mongoose.model('Feedback', feedbackSchema)
export default feedbackModel
