import mongoose,{Schema, Model} from "mongoose";
import IAdmin from "../../domain/entity/admin";


const adminSchema: Schema<IAdmin> = new mongoose.Schema({
    email: {
        type: String},

    password: {
        type: String},
    
    role: {
        type: String,
        default: 'admin'
    }

})

const adminModel: Model<IAdmin> = mongoose.model('Admin', adminSchema)
export default adminModel