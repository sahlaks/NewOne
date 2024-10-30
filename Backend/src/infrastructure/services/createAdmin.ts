import IAdmin from "../../domain/entity/admin";
import bcrypt from 'bcrypt';
import adminModel from "../databases/adminModel";

export async function createAdmin(): Promise<void> {
    const adminExists = await adminModel.findOne({email: process.env.ADMIN_EMAIL})
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
        const admin = new adminModel({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
        });
        await admin.save();
        console.log('Admin created successfully');
    } else {
        console.log('Admin already exists');
    }
}