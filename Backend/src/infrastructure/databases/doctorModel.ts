import mongoose,{Schema, Model} from "mongoose";
import IDoctor from "../../domain/entity/doctor";

const doctorSchema: Schema<IDoctor> = new mongoose.Schema({
    
    doctorName: {
        type: String },

    email: {
        type: String},

    password: {
        type: String},

    mobileNumber: {
        type: String},

    licenseGrade: {
        type: String},

    age: {
        type: Number},

    specialization: {
        type: String},

    image: {
        type: String},

    gender: {
        type: String},
    street: {
        type: String},

    city: {
        type: String},

    dob: {
        type: String},

    state: {
        type: String},

    country: {
        type: String},

    fees: {
        type: Number},
        
    isVerified: {
        type: Boolean,
        default: false},
        
    isBlocked: {
        type: Boolean,
        default: false},

    role: {
        type: String,
        default: 'doctor'},

    isGoogleSignUp: {
        type: Boolean,
        default: false},

    document: {
        type: String
    },
    bio: {
        type: String
    },
    appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
    },
    {
        timestamps: true 
    }    
)

const doctorModel: Model<IDoctor> = mongoose.model('Doctor', doctorSchema)

export default doctorModel