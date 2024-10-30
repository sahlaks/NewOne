import mongoose from "mongoose";

interface IPrescription extends Document {
    _id: string
   data:  { id: number; text: string }[]
   appointmentId:  mongoose.Schema.Types.ObjectId
}

export default IPrescription