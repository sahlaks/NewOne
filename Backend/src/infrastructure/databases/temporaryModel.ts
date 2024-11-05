import mongoose, { Schema, Model } from "mongoose";
import ITemp from "../../domain/entity/temporary";

const tempSchema: Schema<ITemp> = new mongoose.Schema({
  parentName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  document: {
    type: String
},
doctorName: {
    type: String },
  otp: {
  type: String
  },
createdAt: { type: Date, default: Date.now, expires: '1h' }
});

const tempModel: Model<ITemp> = mongoose.model("Temp", tempSchema);

export default tempModel;
