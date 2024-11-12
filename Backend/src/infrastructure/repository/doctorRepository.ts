import mongoose from "mongoose";
import IDoctor from "../../domain/entity/doctor";
import { IDoctorRepository } from "../../usecases/interface/IDoctorRepository";
import doctorModel from "../databases/doctorModel";
import { count } from "console";
import notificationModel from "../databases/notificationModel";
import INotification from "../../domain/entity/notification";
import IAppointment from "../../domain/entity/Appointment";
import appointmentModel from "../databases/appointmentModel";

export class DoctorRepository implements IDoctorRepository {
  /*..........................................verify with email.............................................*/
  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    const doctor = await doctorModel.findOne({ email }).exec();
    return doctor;
  }

  /*...........................................save details..............................................*/
  async saveUserDetails(data: IDoctor): Promise<IDoctor | null> {
    try {
      const savedUser = await doctorModel.create(data);
      return savedUser;
    } catch (error) {
      console.error("Error in save doctor details:", error);
      return null;
    }
  }

  /*.........................................update password with email.................................................*/
  async updateDoctorDetails(
    email: string,
    password: string
  ): Promise<IDoctor | null> {
    const doctor = await doctorModel.findOneAndUpdate(
      { email: email },
      { $set: { password: password } },
      { new: true }
    );
    return doctor;
  }

  /*............................................find by ID...................................................*/
  async findDoctorById(id: mongoose.Types.ObjectId): Promise<IDoctor | null> {
    try {
      const doctor = await doctorModel.findById(id);
      return doctor;
    } catch (error) {
      console.error("Error in find doctor details:", error);
      return null;
    }
  }

  /*.....................................find by id then update password..........................................*/
  async updateDoctorPassword(
    id: string,
    password: string
  ): Promise<IDoctor | null> {
    const doctor = await doctorModel.findByIdAndUpdate(
      { _id: id },
      { $set: { password: password } },
      { new: true }
    );
    return doctor;
  }

  /*........................................find all doctors.........................................*/
  async findDoctor(
    searchQuery: string,
    skip: number,
    limit: number
  ): Promise<IDoctor[] | null> {
    return await doctorModel
      .find({ doctorName: { $regex: searchQuery, $options: "i" } })
      .skip(skip)
      .limit(limit);
  }

  async findDoctors(
    searchQuery: string,
    skip: number,
    limit: number,
    isVerified: boolean
  ): Promise<IDoctor[] | null> {
    return await doctorModel
      .find({
        doctorName: { $regex: searchQuery, $options: "i" },
        isVerified: isVerified,
      })
      .skip(skip)
      .limit(limit);
  }

  async countDocuments(query: string, isVerified: boolean): Promise<number> {
    return await doctorModel.countDocuments({
      doctorName: { $regex: query, $options: "i" },
      isVerified: isVerified,
    });
  }

  async countAll(isVerified: boolean): Promise<number> {
    return await doctorModel.countDocuments({ isVerified: isVerified });
  }

  async collectDocData(
    skip: number,
    limit: number,
    isVerified: boolean
  ): Promise<IDoctor[]> {
    return await doctorModel
      .find({ isVerified: isVerified })
      .skip(skip)
      .limit(limit);
  }

  /*................................................find by Id.................................................*/
  async findDetailsById(id: string): Promise<IDoctor | null> {
    const doctor = await doctorModel.findById(id);
    return doctor;
  }

  /*...............................................find by Id and then block......................................*/
  async findDoctorByIdandUpdate(
    id: string,
    update: object
  ): Promise<IDoctor | null> {
    const doctor = await doctorModel.findByIdAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
    return doctor;
  }

  /*..............................................find with Id and verify a doctor.....................................*/
  async findAndVerify(id: string): Promise<IDoctor | null> {
    const doctor = await doctorModel.findByIdAndUpdate(
      { _id: id },
      { $set: { isVerified: true } },
      { new: true }
    );
    return doctor;
  }

  /*........................................find and delete a doctor.........................................*/
  async findAndDeleteById(id: string): Promise<IDoctor | null> {
    const doctor = await doctorModel.findByIdAndDelete(id);
    return doctor;
  }

  /*........................................save updates....................................*/
  async saveDoctor(data: IDoctor): Promise<IDoctor | null> {
    try {
      const doctor = await doctorModel.findOneAndUpdate(
        { email: data.email },
        data,
        { new: true, upsert: true }
      );
      return doctor;
    } catch (error) {
      console.error("Error updating doctor", error);
      return null;
    }
  }

  /*............................update doctor with appointment...............................................*/
  async updateDoctorwithApointment(
    id: string,
    doctorId: string
  ): Promise<boolean> {
    const appointmentObjectId = new mongoose.Types.ObjectId(id);
    try {
      const res = await doctorModel.findByIdAndUpdate(
        doctorId,
        { $addToSet: { appointments: appointmentObjectId } },
        { new: true }
      );
      if (res) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error updating doctor", error);
      return false;
    }
  }

  /*..............................................all notifications.............................................*/
  async getNotifications(id: string): Promise<INotification[] | null> {
    try {
      const notifications = await notificationModel
        .find({ doctorId: id, toParent: false })
        .sort({ createdAt: -1 });
      return notifications;
    } catch (error) {
      return null;
    }
  }

  /*........................................update to read................................................*/
  async makeRead(id: string): Promise<boolean> {
    try {
      await notificationModel.findByIdAndUpdate(id, { $set: { isRead: true } });
      return true;
    } catch (error) {
      return false;
    }
  }

  /*..............................patients from appointments..............................*/
  async fetchPatients(
    id: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ data: IAppointment[]; total: number }> {
    const dObjectId = new mongoose.Types.ObjectId(id);
    const res = await appointmentModel.aggregate([
      {
        $match: {
          doctorId: dObjectId,

        },
      },
      {
        $group: {
          _id: { childName: "$name" },
          childInfo: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "parents",
          localField: "childInfo.parentId",
          foreignField: "_id",
          as: "parentDetails",
        },
      },
      {
        $unwind: "$parentDetails",
      },
      {
    $match: {
      $or: [
        { "childInfo.name": { $regex: search, $options: "i" } },  // Search by child's name
        { "parentDetails.parentName": { $regex: search, $options: "i" } }, // Search by parent's name
        { "parentDetails.email": { $regex: search, $options: "i" } },  // Search by parent's email
      ],
    },
  },
      {
        $project: {
          "childInfo.name": 1,
          "childInfo._id": 1,
          "childInfo.childId": 1,
          "parentDetails.image": 1,
          "parentDetails.parentName": 1,
          "parentDetails.email": 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const data = res[0]?.data || [];
    const total = res[0]?.totalCount[0]?.count || 0;

    return { data, total };
  }
}
