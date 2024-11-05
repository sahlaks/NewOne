import mongoose, { Document } from "mongoose";

interface ITemp extends Document{
    _id: string
    parentName: string,
    doctorName: string,
    email:  string,
    mobileNumber: string,
    password: string,
    document: string,
    otp: string,
    createdAt: Date
}

export default ITemp;