import mongoose from "mongoose";
import IDoctor from "../domain/entity/doctor";
import {
  jwtCreation,
  refreshToken,
} from "../infrastructure/services/JwtCreation";
import SendEmail from "../infrastructure/services/mailService";
import { generateOTP } from "../infrastructure/services/otpGenerator";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import bcrypt from "bcrypt";
import { ISlotRepository } from "./interface/ISlotRepository";
import ISlot from "../domain/entity/slots";
import { SlotRepository } from "../infrastructure/repository/slotRepository";
import INotification from "../domain/entity/notification";
import IAppointment from "../domain/entity/Appointment";
import tempModel from "../infrastructure/databases/temporaryModel";

export class DoctorUseCase {
  private idoctorRepository: IDoctorRepository;
  private sendEmail: SendEmail;
  private islotRepository: ISlotRepository;

  constructor(doctorRepository: IDoctorRepository, sendEmail: SendEmail, slotRepository: ISlotRepository) {
    this.idoctorRepository = doctorRepository;
    this.sendEmail = sendEmail;
    this.islotRepository = slotRepository;
  }

  /*............................check email registered or not, then send otp............................*/
  async registrationDoctor(
    doctorName: string,email: string, mobileNumber: string, password: string, document: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      // Check if the user already exists
      const existingUser = await this.idoctorRepository.findDoctorByEmail(
        email
      );
      if (existingUser) {
        return { status: false, message: "Email already registered" };
      }

      // Generate and store OTP securely
      const otp = generateOTP();
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const tempUser = new tempModel({
        doctorName,
        email,
        mobileNumber,
        password,
        document,
        otp
      })
      await tempUser.save()
      console.log('user', tempUser);
      
      
      // Send email with OTP
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest Doctor Signup",
        code: otp,
      };
      await this.sendEmail.sendEmail(mailOptions);

      return { status: true, message: "OTP sent successfully", otp };
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during doctor registration:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }

  /*.....................................save details when otp is verified...............................*/
  async saveUser(
    data: IDoctor
  ): Promise<{
    status: boolean;
    message?: string;
    user?: IDoctor;
    token?: string;
    refreshtoken?: string;
  }> {
    try {
      const savedUser = await this.idoctorRepository.saveUserDetails(data);

      if (savedUser) {
        const token = jwtCreation(savedUser._id,'Doctor');
        const refreshtoken = refreshToken(savedUser._id, 'Doctor');

        return {
          status: true,
          message: "Doctor registered successfully",
          user: savedUser,
          token,
          refreshtoken,
        };
      } else {
        return { status: false, message: "Failed to register doctor" };
      }
    } catch (error) {
      console.error("Error in saveUser:", error);
      return {
        status: false,
        message: "An error occurred during registration",
      };
    }
  }
  
/*...............................................otp.....................................................*/
  async sendOtp(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const otp = generateOTP();
      const mailOptions = {
        email,
        subject: "Your OTP for CalmNest Doctor Signup",
        code: otp,
      };
      await tempModel.findOneAndUpdate({email: email}, {$set: {otp: otp}},{new: true, upsert: false})
      await this.sendEmail.sendEmail(mailOptions);
      return { status: true, message: "OTP sent successfully", otp };
    } catch (error) {
      console.error("Error during resend otp:", error);
      return { status: false, message: "An error occurred during resend otp" };
    }
  }

  /*..................................validate by email then password....................................*/
  async validateDoctor(
    email: string,
    password: string
  ): Promise<{
    status: boolean;
    data?: IDoctor;
    message?: string;
    token?: string;
    refreshtoken?: string;
  }> {
    try {
      //check user
      const existingUser = await this.idoctorRepository.findDoctorByEmail(
        email
      );

      if (existingUser) {
        // Check if the doctor is verified
        if (!existingUser.isVerified) {
          return {
            status: false,
            message:
              "Your account is not verified. Please verify your account to proceed.",
          };
        }
        //check blocked or not
        if(existingUser.isBlocked){
          return {
            status: false,
            message: 'Sorry! Your account is blocked!!'
          }
        }
        // Check password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) {
          const token = jwtCreation(existingUser._id, 'Doctor');
          const refreshtoken = refreshToken(existingUser._id, 'Doctor');
        
          return {
            status: true,
            message: "Valid credentials",
            data: existingUser,
            token,
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

  /*....................forgot password.............................*/
  async verifyEmail(
    email: string
  ): Promise<{ status: boolean; message?: string; otp?: string }> {
    try {
      const user = await this.idoctorRepository.findDoctorByEmail(email);

      if (user) {
        const otp = generateOTP();
        const tempUser = new tempModel({
          email: email,
          otp: otp
        })
        await tempUser.save()
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

  /*..............................update password.......................................*/
  async savePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message?: string; doctor: boolean }> {
    try {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser = await this.idoctorRepository.updateDoctorDetails(
        email,
        password
      );
      if (savedUser)
        return {
          status: true,
          message: "Updated password successfully!",
          doctor: true,
        };
      else
        return { status: false, message: "Updation failed..", doctor: false };
    } catch (error) {
      console.error("Error during password updation", error);
      return {
        status: false,
        message: "An error occurred during password updation",
        doctor: false,
      };
    }
  }

  /*............................find the doctor using id....................................*/
  async findDoctorwithId(
    id: string
  ): Promise<{ status: boolean; message?: string; data?: IDoctor }> {
    try {
      const doctor = await this.idoctorRepository.findDetailsById(id);
      if (doctor) {
        return {
          status: true,
          message: "Doctor exist in database",
          data: doctor,
        };
      } else {
        return { status: false, message: "Doctor not available" };
      }
    } catch (error) {
      console.error("Error during fetching data", error);
      return {
        status: false,
        message: "An error occurred during fetching data",
      };
    }
  }

  /*................................verify password...................................*/
  async verifyPassword(
    id: string,
    password: string
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const existingUser = await this.idoctorRepository.findDetailsById(id);
      if (existingUser) {
        // Check password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (isMatch) return { status: true, message: "Matching Password" };
        else
          return {
            status: false,
            message: "Wrong Password!..Please enter the matching one",
          };
      } else {
        return { status: false, message: "User does not exist" };
      }
    } catch (error) {
      return {
        status: false,
        message: "An error occurred during fetching data",
      };
    }
  }

  /*..................................find with id and update password....................................*/
  async findDoctorwithIdandUpdate(
    id: string,
    password: string
  ): Promise<{ status: boolean; message?: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const savedUser = await this.idoctorRepository.updateDoctorPassword(
        id,
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
  async findDoctorById(
    id: string
  ): Promise<{ status: boolean; message?: string; data?: IDoctor }> {
    try {
      const data = await this.idoctorRepository.findDetailsById(id);
      
      if (data) {
        return { status: true, message: "Doctor exist", data };
      } else {
        return { status: false, message: "Doctor not exist" };
      }
    } catch (error) {
      return {
        status: false,
        message: "An error occured during fetching data",
      };
    }
  }

  /*.....................................................save doctor details.......................................*/
  async addDoctor(doctor: IDoctor): Promise<{status: boolean; message?: string; data?: IDoctor}>{
    try{
      const savedDoctor = await this.idoctorRepository.saveDoctor(doctor)
      if (!savedDoctor) {
        return { status: false, message: 'Failed to save doctor' };
      }
      return {status: true, message: 'Updated data successfully'}
    } catch(error){
      return {status: false, message: 'Failure to update data'}
    }
  }

  /*.........................................save slots..........................................*/
  async addTimeSlots(slots:  Array<{ date: string; slots: Array<{ start: string; end: string }> }>,id: string): Promise<{status: boolean; message?: string}>{
    try{
      for (const slot of slots) {
        for (const entry of slot.slots) {
          await this.islotRepository.createSlot({date:slot.date, startTime:entry.start, endTime:entry.end,doctorId: id})
        }
      }
    return { status: true, message: "Slots saved successfully" };
    } catch (error) {
      console.error("Error in addTimeSlots:", error);
      return { status: false, message: "Failed to save slots" };
    }
  }
  
  /*............................................fetch slot..........................................*/
  async fetchSlotsDetails(id: string, page: number, limit: number, search: string, available: string): Promise<{status: boolean; message?: string; data?: ISlot[], totalPages?: number}>{
    try{
      const res = await this.islotRepository.fetchSlots(id,page,limit,search,available)
      const total = await this.islotRepository.countDocuments(id)
      const totalPages = Math.ceil(total / limit);
      if(res) return {status: true, message: 'Slots fetched successfully', data: res, totalPages: totalPages}
      return {status: false, message: 'Error fetching slots'}
    }catch(error){
      return { status: false, message: "Failed to fetch slots" };
    }
  }

  /*.........................................change availability....................................*/
  async changeAvailabilityWithId(slotId: string,doctorId: string): Promise<{status: boolean; message?: string; data?: ISlot}>{
    try{
      const updatedSlot = await this.islotRepository.updateSlot(slotId,doctorId)
      if (!updatedSlot) return { status: false, message: "Slot not found or unauthorized access",}
      return { status: true, message: "Slot availability updated successfully", data: updatedSlot}
    }catch(error){
      return { status: false, message: "An error occurred while updating the slot availability"};
    }
  }

  /*..............................................delete a slot..............................................*/
  async deleteSlotWithId(slotId: string, doctorId: string): Promise<{status: boolean; message?: string;}>{
    try{
      const updatedSlot = await this.islotRepository.deleteSlot(slotId,doctorId)
      if (!updatedSlot) return { status: false, message: "Slot not found or unauthorized access",}
      return { status: true, message: "Slot deleted successfully"}
    }catch(error){
      return { status: false, message: "An error occurred while deleting the slot availability"};
    }
  
  }

/*..............................................fetching notifications...................................*/
async fetchingNotifications(id: string): Promise<{status: boolean; message?: string; data?: INotification[]}>{
  try{
    const res = await this.idoctorRepository.getNotifications(id)
    if(res) return{status:true, message: 'Fetched Notifications', data: res}
    return {status:false, message: 'Failed to fetch notifications'}
  } catch (error) {
    return { status: false, message: "An error occured during fetching"}
  }
}

/*........................................make read.............................................*/
async updateNotification(id: string): Promise<{status: boolean; message?: string}>{
  try{
    const res = await this.idoctorRepository.makeRead(id)
    
    if(res) return{status:true, message: 'Read the Notification'}
    return {status:false, message: 'Failed to make READ'}
  } catch (error) {
    return { status: false, message: "An error occured during fetching"}
  }
}

/*...........................................patients.............................................*/
async getPatients(id: string, page: number, limit: number, search: string): Promise<{status: boolean; data?: IAppointment[], total?: number}>{
  try{
    const res = await this.idoctorRepository.fetchPatients(id,page,limit,search)
    if(res) return {status: true, data: res.data, total: res.total}
    return {status: false}
  } catch (error) {
    return { status: false}
  }
}

}


