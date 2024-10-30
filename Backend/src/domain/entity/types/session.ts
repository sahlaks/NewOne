import session from "express-session";

interface SignupData{
    parentName: string;
    email: string;
    mobileNumber: string;
    password: string;
}

interface DoctorData{
    doctorName: string;
    email: string;
    mobileNumber: string;
    password: string;
   document: string;
}

declare module 'express-session' {
    interface Session {
        signupData?: SignupData;
        doctorData?: DoctorData;
        otp?: string;
        dotp?: string;
        pEmail?: string;
        dEmail?: string;
    }
}