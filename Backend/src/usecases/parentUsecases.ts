import IParent from "../domain/entity/Parents";
import { AuthRequest } from "../domain/entity/types/auth";
import SendEmail from "../infrastructure/services/mailService";
import { generateOTP } from "../infrastructure/services/otpGenerator";
import { IParentRepository } from "./interface/IParentRepository";
import { Request } from "express";
import bcrypt from "bcrypt";
import {
  jwtCreation,
  refreshToken,
} from "../infrastructure/services/JwtCreation";
import { generateRandomPassword } from "../infrastructure/services/generatePassword";
import IChild from "../domain/entity/Child";
import { IChildRepository } from "./interface/IChildRepository";
import mongoose from "mongoose";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import IDoctor from "../domain/entity/doctor";
import ISlot from "../domain/entity/slots";
import { ISlotRepository } from "./interface/ISlotRepository";
import INotification from "../domain/entity/notification";
import IFeedback from "../domain/entity/feedback";
import IReview from "../domain/entity/review";

export class ParentUseCase {
  private iparentRepository: IParentRepository;
  private ichildRepository: IChildRepository;
  private idoctorRepository: IDoctorRepository;
  private islotRepository: ISlotRepository;
  private sendEmail: SendEmail;

  constructor(parentRepository: IParentRepository, sendEmail: SendEmail, childRepository: IChildRepository, doctorRepository: IDoctorRepository, slotRepository: ISlotRepository) {
    this.iparentRepository = parentRepository;
    this.sendEmail = sendEmail;
    this.ichildRepository = childRepository
    this.idoctorRepository = doctorRepository
    this.islotRepository = slotRepository
  }


  /*......................................find user by email and send otp to it.........................................*/
  async registrationParent(
    req: Request
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const signupData = req.session.signupData;
      const email = signupData?.email as string;
      //check user
      const existingUser = await this.iparentRepository.findParentByEmail(
        email
      );
      if (existingUser) {
        return { status: false, message: "Email already registered" };
      }

      const otp = generateOTP();
      req.session.otp = otp;
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest Signup",
        code: otp,
      };
      await this.sendEmail.sendEmail(mailOptions);
      return { status: true, message: "OTP sent successfully" };
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during parent registration:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*.....................................verify email and save data............................................*/
  async saveUser(data: IParent): Promise<{
    status: boolean;
    message?: string;
    user?: IParent;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      data.isLoggin = true;

      const savedUser = await this.iparentRepository.saveUserDetails(data);
      if (savedUser) {
        const accesstoken = jwtCreation(savedUser._id, 'Parent');
        const refreshtoken = refreshToken(savedUser._id, 'Parent');

        return {
          status: true,
          message: "User registered successfully",
          user: savedUser,
          accesstoken,
          refreshtoken,
        };
      } else {
        return { status: false, message: "Failed to register user" };
      }
    } catch (error) {
      console.error("Error in saveUser:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*........................................validate a parent in login...................................*/
  async validateParent(
    email: string,
    password: string
  ): Promise<{
    status: boolean;
    data?: IParent;
    message?: string;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      //check user
      const existingUser = await this.iparentRepository.findParentByEmail(
        email
      );

      if (existingUser) {
        //check blocked or not
        if(existingUser.isBlocked){
          return {status: false, message:' Sorry! Your account is blocked'}
        }
        // Check password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
          const accesstoken = jwtCreation(existingUser._id, 'Parent');
          const refreshtoken = refreshToken(existingUser._id, 'Parent');
          return {
            status: true,
            message: "Valid credentials",
            data: existingUser,
            accesstoken,
            refreshtoken,
          };
        } else {
          return { status: false, message: "Wrong password" };
        }
      } else {
        return { status: false, message: "User does not exist!" };
      }
    } catch (error) {
      console.error("Error in login:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }


  /*..............................................send otp...................................................*/
  async sendOtp(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const otp = generateOTP();
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest",
        code: otp,
      };
      await this.sendEmail.sendEmail(mailOptions);
      return { status: true, message: "OTP sent successfully", otp };
    } catch (error) {
      console.error("Error during resend otp:", error);
      return { status: false, message: "An error occurred during resend otp" };
    }
  }

  /*.......................................verify email for forgot password.....................................*/
  async verifyEmail(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const user = await this.iparentRepository.findParentByEmail(email);
      if (user) {
        const otp = generateOTP();
        const mailOptions = {
          email,
          subject: "Your OTP for changing password",
          code: otp,
        };
        await this.sendEmail.sendEmail(mailOptions);
        return { status: true, message: "OTP sent successfully", otp };
      } else {
        return { status: false, message: "You are not registered yet!!" };
      }
    } catch (error) {
      console.error("Error during sending otp:", error);
      return { status: false, message: "An error occurred during resend otp" };
    }
  }


  /*............................................saving new password......................................*/
  async savePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser = await this.iparentRepository.updateUserDetails(
        email,
        password
      );
      if (savedUser)
        return { status: true, message: "Updated password successfully!" };
      else return { status: false, message: "Updation failed.." };
    } catch (error) {
      console.error("Error during password updation", error);
      return {
        status: false,
        message: "An error occurred during password updation",
      };
    }
  }


  /*...............................data by ID.......................................*/
  async findParentById(
    id: string
  ): Promise<{ status: boolean; message?: string; parent?: IParent }> {
    try {
      const parent = await this.iparentRepository.findDetailsById(id);
      
      if (parent) {
        return { status: true, message: "User exist", parent };
      } else {
        return { status: false, message: "User not exist" };
      }
    } catch (error) {
      return {
        status: false,
        message: "An error occured during fetching data",
      };
    }
  }


  /*.......................................google auth..........................*/
  async findParentByEmail(user: IParent): Promise<{
    status: boolean;
    message?: string;
    parent?: IParent;
    accesstoken?: string;
    refreshtoken?: string;
  }> {
    try {
      const parent = await this.iparentRepository.findParentByEmail(user.email);
      if (parent) {
        const accesstoken = jwtCreation(parent._id, 'Parent');
        const refreshtoken = refreshToken(parent._id, 'Parent');
        return {
          status: true,
          message: "User exist",
          parent,
          accesstoken,
          refreshtoken,
        };
      } else {
        let password = generateRandomPassword(8);
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const isGoogleSignUp = true;
        const parent = await this.iparentRepository.saveUser(
          user,
          password,
          isGoogleSignUp
        );

        if (parent) {
          const accesstoken = jwtCreation(parent._id, 'Parent');
          const refreshtoken = refreshToken(parent._id, 'Parent');

          return {
            status: true,
            message: "User authenticated and added",
            parent,
            accesstoken,
            refreshtoken,
          };
        }
      }
      return { status: false, message: "Error in user authentication" };
    } catch (error) {
      return {
        status: false,
        message: "An error occured during authenticating data",
      };
    }
  }


  /*.................................find with email for google authentication..........................*/
  async findParentWithEmail(
    email: string
  ): Promise<{ status: boolean; isGoogleAuth: boolean }> {
    try {
      const user = await this.iparentRepository.findParentByEmail(email);
      if (user) {
        if (user.isGoogleSignUp) {
          return { status: true, isGoogleAuth: true };
        } else {
          return { status: false, isGoogleAuth: false };
        }
      } else {
        return { status: false, isGoogleAuth: false };
      }
    } catch (error) {
      console.error("Error checking Google auth:", error);
      return { status: false, isGoogleAuth: false };
    }
  }
  
  /*..............................find child data with parent Id.......................................*/
  async findChildData(id: string): Promise<{status: boolean, message?: string, child?: IChild[]}>{
    const parentId = new mongoose.Types.ObjectId(id)
    try{
      const data = await this.ichildRepository.findChild(parentId)
      if(data){
        return {status: true, message: 'Data exist', child: data}
      }
      return {status: false, message: 'Child data not exist'}
    } catch(error){
      return {status: false, message: 'Failure to find data'}
    }
  }
  
  /*.............................................save parent and kids data....................................*/
  async addParentandKids(
    parentData: IParent,
    childrenData: IChild[]
): Promise<{ status: boolean; message?: string; child?: IChild[] }> {
    try {
        // Save the parent first
        const savedParent = await this.iparentRepository.saveParent(parentData);
        if (!savedParent) {
            return { status: false, message: 'Failed to save parent' };
        }

        if (!Array.isArray(childrenData) || childrenData.length === 0) {
            return { status: true, message: 'Parent details updated successfully without child data' };
        }

        const parentId = new mongoose.Types.ObjectId(savedParent._id);

        // Validate existing children
        const existingChildren = await this.ichildRepository.validateChild(childrenData, parentId);
        const existingChildrenArray = existingChildren ?? [];
        // Filter out children that already exist in the database
        const newChildren = childrenData.filter(child =>
            !existingChildrenArray.some(existing =>
                existing.name === child.name &&
                existing.age === child.age &&
                existing.gender === child.gender
            )
        );

        // If no new children to save
        if (newChildren.length === 0) {
            return { status: false, message: 'All provided child data already exists in the database' };
        }

        // Save only new children
        const savedChildren = await this.ichildRepository.saveChild(newChildren, parentId);
        if (!savedChildren) {
            return { status: false, message: 'Failed to save children' };
        }

        const childIds = savedChildren.map(child => new mongoose.Types.ObjectId(child._id));

        // Update parent with children IDs
        const updatedParent = await this.iparentRepository.updateParentChildren(parentId, childIds);
        if (!updatedParent) {
            return { status: false, message: 'Failed to update parent with children' };
        }

        return { status: true, message: 'Updated data successfully', child: savedChildren };
    } catch (error) {
        console.error('Error:', error);
        return { status: false, message: 'Failure to update data' };
    }
}


  /*...........................................remove kid data with id..................................*/
  async deleteKidById(id: string, parentId: string): Promise<{status: boolean; message?: string}>{
    try{
      const deletekid = await this.ichildRepository.deleteById(id)
      if (!deletekid) return { status: false, message: 'Kid not found' };

      const kidId = new mongoose.Types.ObjectId(id);
      const updatedParent = await this.iparentRepository.updateParentOnDelete(kidId,parentId)
      if (!updatedParent) {
        return { status: false, message: 'Failed to update parent with kid removal' };
      }
      return { status: true, message: 'Kid deleted successfully' };
    } catch(error){
      return { status: false, message: 'Server error' };
    }
  }

   /*................................verify password...................................*/
   async verifyPassword(id: string, password: string): Promise<{status: boolean; message?: string}>{
    try{
    const existingUser = await this.iparentRepository.findDetailsById(id);
  
    if(existingUser){
       // Check password
       const isMatch = await bcrypt.compare(password, existingUser.password);
       if(isMatch)
            return {status: true, message: 'Matching Password'}
        else
            return {status: false, message: 'Wrong Password!..Please enter the matching one'}
    }else{
        return {status: false, message: 'User does not exist'}
    }
}catch(error){
    return { status: false, message: 'An error occurred during fetching data'};
}
}


/*..................................find with id and update password....................................*/
async findParentwithIdandUpdate(id: string, password: string): Promise<{status: boolean, message?: string}>{
  try{
     const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser =  await this.iparentRepository.updateParentPassword(id,password);
      if(savedUser)
          return {status: true, message: 'Updated password successfully!'}
      else
          return {status: false, message: 'Updation failed..'}   
  } catch(error){
      console.error('Error during password updation', error);
      return { status: false, message: 'An error occurred during password updation'};
  }
}

/*..................................doctor and its slots........................................*/
async findDoctor(id: string): Promise<{status: boolean; message?: string; data?: IDoctor; slots?: ISlot[]}>{
  try{
    const res = await this.idoctorRepository.findDetailsById(id)
    if(res){
      const slots = await this.islotRepository.fetchAvailableSlots(id)
      if(slots) return {status: true, message:'Data fetched along with slots',data: res, slots}
      return {status: true, message: 'Doctor details fetched', data: res}
    }
    return {status: false, message: 'No data available'}
  }catch(error){
    return { status: false, message: 'An error occurred during data fetching'};
}

}

/*...............................................feedbacks...................................................*/
async fetchFeedbacks(id: string): Promise<{status: boolean; data?: IReview[]}>{
  try{
    const res = await this.iparentRepository.findFeedbacks(id)
    if(res) return {status: true, data: res}
    return {status: false}
    } catch(err){
      return { status: false }
    }
  }

/*..............................................fetching notifications...................................*/
async fetchingNotifications(id: string): Promise<{status: boolean; message?: string; data?: INotification[]}>{
  try{
    const res = await this.iparentRepository.getNotifications(id)
    if(res) return{status:true, message: 'Fetched Notifications', data: res}
    return {status:false, message: 'Failed to fetch notifications'}
  } catch (error) {
    return { status: false, message: "An error occured during fetching"}
  }
}

/*........................................make read.............................................*/
async updateNotification(id: string): Promise<{status: boolean; message?: string}>{
  try{
    const res = await this.iparentRepository.makeRead(id)
    if(res) return{status:true, message: 'Read the Notification'}
    return {status:false, message: 'Failed to make READ'}
  } catch (error) {
    return { status: false, message: "An error occured during fetching"}
  }
}

/*.............................................feedback...............................................*/
async saveFeedback(id: string, feedback: string): Promise<{status: boolean; message?: string}>{
  try{
    const feedbackData = {
      parentId: new mongoose.Types.ObjectId(id),
      message: feedback,
      createdAt: new Date()
    };
  const res = await this.iparentRepository.saveData(feedbackData);
  if (res) return { status: true, message: 'Feedback Submitted Successfully!' };
  return {status: false, message: 'Failed to save feedback!!'}
  } catch (error) {
    console.error('Error saving feedback:', error);
    return { status: false };
  }
}

/*..................................................submit review.............................................*/
async ratingsAndReview(id: string, name: string, rating: number, review: string, dId: string): Promise<{status: boolean; message?: string}>{
  try{
    const ratingData = {
      parentId: new mongoose.Types.ObjectId(id),
      doctorId: new mongoose.Types.ObjectId(dId),
      parentName: name,
      reviewRating: rating,
      feedback: review,
    };
    const res = await this.iparentRepository.submitReview(ratingData);
    if (res) return { status: true, message: 'Feedback Submitted Successfully!' };
    return {status: false, message: 'Failed to save feedback!!'}
  }catch(error){
    return { status: false };
  }
}


}

