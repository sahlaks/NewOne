import { Request, Response, NextFunction } from "express";
import IDoctor from "../domain/entity/doctor";
import { DoctorUseCase } from "../usecases/doctorUsecases";
import mongoose from "mongoose";
import { uploadDocumentFile, uploadImage } from "../infrastructure/services/cloudinaryService";
import { verifyRefreshToken } from "../infrastructure/services/tokenVerification";
import { jwtCreation } from "../infrastructure/services/JwtCreation";
import { AuthRequest } from "../domain/entity/types/auth";
import uploadDocument from "../infrastructure/services/documentUpload";



export class DoctorController {
  constructor(private DoctorUseCase: DoctorUseCase) {}

  /*...........................................signup......................................*/
  async createDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { doctorName, email, mobileNumber, password } =
        req.body;
        const file = req.file
        
        if (!file) {
          return res.status(400).json({
            success: false,
            message: "Document is required and must be a PDF",
          });
        }

        const documentUrl = `uploads/${file.filename}`;
        
      req.session.doctorData = {
        doctorName,
        email,
        mobileNumber,
        password,
        document: documentUrl
      };

      const result = await this.DoctorUseCase.registrationDoctor(email);

      if (result.status) {
        req.session.dotp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
     } else {
        return res.json({
          success: false,
          message: result.message,
       });
     }
    } catch (error) {
      next(error);
    }
  }

  /*...........................................verify otp....................................................*/
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { otp } = req.body;
      const sessionOtp = req.session.dotp;
      const doctorData = req.session.doctorData;
      console.log(sessionOtp);

      if (!doctorData) {
        return res
          .status(400)
          .json({ success: false, message: "No signup data found" });
      }

      if (otp !== sessionOtp) {
        return res.json({ success: false, message: "Incorrect OTP" });
      }

      const result = await this.DoctorUseCase.saveUser(doctorData as IDoctor);
      if (result.status) {
        res.cookie("doc_auth_token", result.token, { httpOnly: true });
        res.cookie("doc_refresh_token", result.refreshtoken, {
          httpOnly: true,
        });
        if (result.user?.password) {
          delete (result.user as { password?: string }).password;
        }
        return res
          .status(200)
          .json({ success: true, message: result.message, user: result.user });
      } else {
        return res.json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error in DoctorController:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /*...........................................resend otp..........................................*/
  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const email = req.session.doctorData?.email;
      if (!email) {
        console.error(
          "Email is missing in doctorData:",
          req.session.doctorData
        );

        return res.status(400).json({
          success: false,
          message: "Email is missing in session",
        });
      }
      const result = await this.DoctorUseCase.sendOtp(email);
      if (result.status) {
        req.session.dotp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
      } else {
        return res.json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.................................login...................................*/
  async loginDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, password } = req.body;
      const result = await this.DoctorUseCase.validateDoctor(email, password);
      if (result.status) {
        if (result.data?.password) {
          delete (result.data as { password?: string }).password;
        }
        
        res.cookie("doc_auth_token", result.token, { httpOnly: true });
        res.cookie("doc_refresh_token", result.refreshtoken, {
          httpOnly: true,
        });
        return res.status(200).json({ success: true, data: result.data });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error in DoctorController:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  
  /*...............................forgot password...................................*/
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email } = req.body;
      const result = await this.DoctorUseCase.verifyEmail(email);
      if (result.status) {
        req.session.dEmail = email;
        req.session.dotp = result.otp;
        return res
          .status(200)
          .json({
            success: true,
            message: "OTP send to your email, change password",
            changePassword: true,
          });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error in DoctorController:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /*................................verify otp in forgot password..............................*/
  async verifyforForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { otp } = req.body;
      const sessionOtp = req.session.dotp;

      if (otp !== sessionOtp) {
        return res.json({ success: false, message: "Incorrect OTP" });
      } else {
        return res.json({
          success: true,
          message: "OTP is verified, create a new password!",
          doctor: true,
        });
      }
    } catch (error) {
      console.error("Error in DoctorController:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  /*.....................................resend otp in forgot password...............................*/
  async resendforForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const email = req.session.dEmail as string;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "No email found in session." });
    }
    try {
      const result = await this.DoctorUseCase.sendOtp(email);
      if (result.status) {
        req.session.dotp = result.otp;
        return res.status(200).json({
          success: true,
          message: "OTP send to your email",
        });
      } else {
        return res.json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*................................password saving....................................*/
  async passwordSaver(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { password } = req.body;
      const email = req.session.dEmail;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "No email found in session." });
      }
      const result = await this.DoctorUseCase.savePassword(email, password);
      if (result.status) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }

  /*.............................fetch doctor data from database.................................*/
  async fetchDoctorData(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const doctorId = req.user?.id as string;
    try {
      if (!doctorId)    res.status(400).json({ success: false, message: "Id is not there" });
    
      const result = await this.DoctorUseCase.findDoctorwithId(doctorId);
      if (result.status) {
        return res
          .status(200)
          .json({
            success: true,
            message: "Doctor data availble",
            data: result.data,
          });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Doctor data not available" });
      }
    } catch (error) {
      next(error);
    }
  }

  /*...............................change password...................................*/
  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
    const details = req.body
    const doctorId = req.user?.id as string;
    try{
        const exist = await this.DoctorUseCase.verifyPassword(doctorId,details.oldPassword)
        if(!exist.status) return res.status(400).json({success: false, message: exist.message})
        else{
            const result = await this.DoctorUseCase.findDoctorwithIdandUpdate(doctorId,details.password)
            if(result.status)
                return res.status(200).json({success: true, message: 'Updated Successfully'})
            else
                return res.status(400).json({success: false, message: result.message})
        }
    }catch(error){
        next(error)
    }
    
  }

/*.................................refresh accesstoken.........................................*/
async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
  const refreshToken = req.cookies.doc_refresh_token
  if(!refreshToken) res.status(401).json({success: false, message: 'Refresh Token Expired' })
  try{
      const decoded = verifyRefreshToken(refreshToken)
      
      if (!decoded || !decoded.id) {
          res.status(401).json({ success: false, message: 'Refresh Token Expired' });
      }

      const result = await this.DoctorUseCase.findDoctorById(decoded.id);

      if (!result || !result.data) {
      return res.status(401).json({ success: false, message: 'Invalid Refresh Token' });
      }

      const doc = result.data; 

      if (!doc._id) {
      return res.status(400).json({ success: false, message: 'Invalid parent data, missing _id' });
      }

      const newAccessToken = jwtCreation(doc._id, 'Doctor');
      res.cookie('doc_auth_token',newAccessToken)
      res.status(200).json({ success: true, message: 'Token Updated' });
  }catch(error){
      next(error)
  }
}

/*................................................update profile..........................................*/
async updateProfile(req: AuthRequest,res: Response, next: NextFunction): Promise<Response | void>{
  const { name, email, phone, gender, age, degree, fees, street, city, state, country, bio} = req.body;
  const imageBuffer = req.file?.buffer;

  try{
      let imageUrl: string | undefined;
      if (imageBuffer) {
          imageUrl = await uploadImage(imageBuffer, 'calmnest');
        }

     const doctorData: Partial<IDoctor> = {
      doctorName : name, 
      email, 
      age,
      image: imageUrl, 
      mobileNumber: phone, 
      specialization: degree,
      gender,
      fees,
      street, 
      city, 
      state, 
      country,
      bio,
  };

      const result = await this.DoctorUseCase.addDoctor(doctorData as IDoctor)

      if(result.status)
          return res.status(201).json({ success: true, message: 'Doctor added successfully', doctor: result });
      return res.json({success: false, message: result.message})
  }catch(error){
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Error saving parent and kids' });
  }
  
}

/*..............................................save slots..............................................*/
async saveSlots(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const {slots} = req.body
  const doctorId = req.user?.id as string;
  if (!slots || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Invalid slotsArray format" });
  }
  try{
    const result = await this.DoctorUseCase.addTimeSlots(slots,doctorId)
    if(result.status) return res.status(200).json({success: true, message: result.message})
    return res.status(400).json({success: false, message: result.message})
  }catch(error){
    next(error)
  }
   
}

/*....................................fetch slots....................................*/
async fetchSlots(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const doctorId = req.user?.id as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;

  try{
    const result = await this.DoctorUseCase.fetchSlotsDetails(doctorId,page,limit)
    if(result.status) return res.status(200).json({success: true, message: result.message, slots: result.data,totalPages: result.totalPages, currentPage: page})
    return res.status(400).json({success: false, message: result.message})
  }catch(error){
    next(error)
  }
}

/*.....................................change availability.......................................................*/
async changeAvailability(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const doctorId = req.user?.id as string;
  const slotId = req.params.id
  
  try{
    const result = await this.DoctorUseCase.changeAvailabilityWithId(slotId,doctorId)
    if(result.status) return res.status(200).json({success:true, message: result.message, data: result.data})
    return res.status(400).json({success: false, message: result.message})
  }catch(error){
    next(error)
  }
}

/*.............................................delete a slot..............................................*/
async deleteSlot(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const doctorId = req.user?.id as string
  const slotId = req.params.id
  try{
    const result = await this.DoctorUseCase.deleteSlotWithId(slotId,doctorId)
    if(result.status) return res.status(200).json({success:true, message: result.message})
    return res.status(400).json({success: false, message: result.message})
  }catch(error){
    next(error)
  }
}

/*...........................................notifications...............................................*/
async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const docId = req.params.id as string
  try{
    const result = await this.DoctorUseCase.fetchingNotifications(docId)
    if(result.status) return res.status(200).json({success: true, message: result.message, data: result.data})
    return res.status(400).json({success: false, message: result.message})
  } catch(error) {
    next(error)
  }
}

/*................................................read notification....................................*/
async changeToRead(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>{
  const { notificationId } = req.body;
  
  try{
    const result = await this.DoctorUseCase.updateNotification(notificationId)
    if(result.status) return res.status(200).json({success: true, message: result.message})
    return res.status(400).json({success: false, message: result.message})
  } catch(error) {
    next(error)
  }
}

/*................................................fetch patients....................................................*/
async fetchPatients(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
  const doctorId = req.user?.id as string
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  try{
    const result = await this.DoctorUseCase.getPatients(doctorId, page, limit)
    if(result.status) return res.status(200).json({success: true, data: result.data, total: result.total, currentPage: page, totalPages: Math.ceil((result.total || 0) / limit)})
      return res.status(400).json({success: false})
  }catch(error){
    next(error)
  }
}

  /*...............................logout.................................*/
  async logoutDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return reject(
            res
              .status(500)
              .json({ success: false, message: "Failed to log out" })
          );
        }
        res.clearCookie("doc_auth_token");
        res.clearCookie("doc_refresh_token");
        return resolve(
          res
            .status(200)
            .json({ success: true, message: "Successfully logged out" })
        );
      });
    });
  }
}
