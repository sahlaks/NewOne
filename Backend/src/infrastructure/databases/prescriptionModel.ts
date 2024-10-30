import mongoose, { Model, Schema } from "mongoose";
import IPrescription from "../../domain/entity/prescription";

const prescriptionSchema: Schema<IPrescription> = new mongoose.Schema({
   data:[{
    id: { type: Number},
    text: { type: String}
   }],
   appointmentId: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
   }
},
{
    timestamps: true
})

const prescriptionModel: Model<IPrescription> = mongoose.model("Prescription", prescriptionSchema);

export default prescriptionModel;
