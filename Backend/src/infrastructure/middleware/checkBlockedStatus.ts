import { NextFunction, Response } from "express";
import { AuthRequest } from "../../domain/entity/types/auth";
import parentModel from "../databases/parentModel";
import doctorModel from "../databases/doctorModel";

const checkBlockedStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const role = req.user?.role
    try {
        let user;
        if(role==='Parent') user = await parentModel.findById(userId)
        else user = await doctorModel.findById(userId)
    
        if(!user) return res.status(404).json({ message: 'User/Doctor not found' });

        if (user.isBlocked) return res.status(403).json({ message: 'Access denied. Your account has been blocked.' })
        
        next();
        
    } catch (error) {
        console.error('Error checking blocked status:', error);
        return res.status(500).json({ message: 'Server error' });
      }
}

export default checkBlockedStatus;