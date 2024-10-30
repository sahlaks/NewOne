import mongoose, { Document, Schema } from "mongoose";

interface IChild extends Document{
    _id: string
    name: string
    age: number
    gender: string
    parentId: mongoose.Schema.Types.ObjectId
}

export default IChild;