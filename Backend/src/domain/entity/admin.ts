import { Document } from "mongodb";

interface IAdmin extends Document {
    _id: string
    email: string
    password: string
    role: string
}

export default IAdmin