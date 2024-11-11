import mongoose, { Model, Schema } from "mongoose"
import IRule from "../../domain/entity/rule"


const ruleSchema: Schema<IRule> = new mongoose.Schema({
    date: {
        type: String
    },
    day: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type:String
    },
    isAvailable:{
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['Available', 'Booked'],
        default: 'Available'
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    },
        { timestamps: true }
)

const ruleModel: Model<IRule> = mongoose.model('Rule', ruleSchema)

export default ruleModel