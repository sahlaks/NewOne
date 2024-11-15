import mongoose from "mongoose";
import IDoctor from "../../domain/entity/doctor";
import { IDoctorRepository } from "../../usecases/interface/IDoctorRepository";
import doctorModel from "../databases/doctorModel";
import { count } from "console";
import notificationModel from "../databases/notificationModel";
import INotification from "../../domain/entity/notification";
import IAppointment from "../../domain/entity/Appointment";
import appointmentModel from "../databases/appointmentModel";
import reviewModel from "../databases/reviewModel";
import IReview from "../../domain/entity/review";

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

  /*..............................................clear all..............................................*/
  async clearAll(id: string): Promise<{success: boolean, message: string}> {
    try {
      const result = await notificationModel.deleteMany({ doctorId: id });
      if (result.deletedCount > 0) {
        return { success: true, message: "Notifications cleared successfully" };
      } else {
        return { success: true, message: "No notifications to clear" };
      }
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      return { success: false, message: "Error clearing notifications" };
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

  /*................................dashboard data...............................*/
  async fetchParentCount(id: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(id)
    const count = await appointmentModel.aggregate([
      {$match: {doctorId: objectId}},
      {$group: {_id:"$name"}},
      { $count: "Count" }
    ])
    return count[0]?.Count || 0;
  }

  async countScheduled(id: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(id)
    const count = await appointmentModel.aggregate([
      {$match:{doctorId: objectId, appointmentStatus: 'Scheduled'}},
      {$count: 'Count'}
    ])
    return count[0]?.Count || 0;
  }

  async countCompleted(id: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(id)
    const count = await appointmentModel.aggregate([
      {$match:{doctorId: objectId, appointmentStatus: 'Completed'}},
      {$count: 'Count'}
    ])
    return count[0]?.Count || 0;
  }

  async revenue(id: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(id)
    const total = await appointmentModel.aggregate([
      {$match:{doctorId: objectId,  appointmentStatus: { $in: ["Completed", "Scheduled"] }}},
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fees" }
        }
      }
    ])
    return total[0]?.totalRevenue || 0;
  }

  async latest(id: string): Promise<IAppointment | null> {
    const objectId = new mongoose.Types.ObjectId(id)
    const latest = await appointmentModel.findOne({
      doctorId: objectId
    }).sort({createdAt: -1}).limit(1).exec()
    return latest
  }

  async analytics(id: string): Promise<{ totalRevenue: number; totalAppointments: number;}> {
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await appointmentModel.aggregate([
      { $match: { doctorId: objectId, appointmentStatus: { $in: ["Completed", "Scheduled"] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fees" },
          totalAppointments: { $sum: 1 }
        }
      }
    ]);
    return {
      totalRevenue: result[0]?.totalRevenue || 0,
      totalAppointments: result[0]?.totalAppointments || 0,
    };
  }

  async countPending(id: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(id)
    const count = await appointmentModel.aggregate([
      {$match:{doctorId: objectId, appointmentStatus: 'Pending'}},
      {$count: 'Count'}
    ])
    return count[0]?.Count || 0;
  }

  async feedback(id: string): Promise<IReview | null> {
    const objectId = new mongoose.Types.ObjectId(id)
    return await reviewModel.findOne({
      doctorId: objectId
    }).sort({createdAt: -1}).exec()
  }


}
