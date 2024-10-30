import mongoose, { Schema, Model } from "mongoose";
import IParent from "../../domain/entity/Parents";

const parentSchema: Schema<IParent> = new mongoose.Schema({
  parentName: {
    type: String,
  },
  image: {
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
  numberOfKids: {
    type: Number
  },
  isLoggin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "parent",
  },
  isGoogleSignUp: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  children: [{ type: Schema.Types.ObjectId, ref: 'Child' }],
  appointments: [{type: Schema.Types.ObjectId, ref: 'Appointment'}]
},
  {
    timestamps: true
});

const parentModel: Model<IParent> = mongoose.model("Parent", parentSchema);

export default parentModel;
