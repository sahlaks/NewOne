import mongoose, { Model, Schema } from "mongoose"
import IChild from "../../domain/entity/Child"

const childSchema: Schema<IChild> = new mongoose.Schema({
    name:{
        type: String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    },
    parentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    }
})

const childModel: Model<IChild> = mongoose.model('Child', childSchema)

export default childModel