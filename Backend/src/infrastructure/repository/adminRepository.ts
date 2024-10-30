import IAdmin from "../../domain/entity/admin";
import IAppointment from "../../domain/entity/Appointment";
import ISlot from "../../domain/entity/slots";
import { IAdminRepository } from "../../usecases/interface/IAdminRepository";
import adminModel from "../databases/adminModel";
import appointmentModel from "../databases/appointmentModel";
import childModel from "../databases/childModel";
import doctorModel from "../databases/doctorModel";
import parentModel from "../databases/parentModel";
import slotModel from "../databases/slotModel";

export class AdminRepository implements IAdminRepository{

    /*...............................................find with email.............................................*/
    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        const admin = await adminModel.findOne({email})
            return admin;
    }

    /*..........................................appointments per month...................................*/
    async findAppointments(): Promise<IAppointment[] | null> {
        try {
          const appointmentsPerMonth = await appointmentModel.aggregate([
            {
              $addFields: {
                dateObject: {
                  $dateFromString: {
                    dateString: "$date",
                  }
                }
              }
            },
            {
              $addFields: {
                year: { $year: "$dateObject" },
                month: { $month: "$dateObject" }
              }
            },
            {
              $group: {
                _id: {
                  year: "$year",
                  month: "$month"
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1
              }
            }
          ]);
            return  appointmentsPerMonth
          } catch (err) {
            return null
          }

    }

    /*..............................................fetch gender details...................................*/
    async findDetails(): Promise<{ _id: string; count: number} []> {
      const genderDistribution = await childModel.aggregate([
        {
          $group: {
            _id: "$gender", 
            count: { $sum: 1 } 
          }
        }
      ]); 
    
    console.log(genderDistribution);
    return genderDistribution
    
    }
    
    /*.............................................appointment status.................................*/
    async findAppointmentStatus(): Promise<IAppointment[] | null> {
      try {
        const appointmentStatuses = await appointmentModel.aggregate([
            {
                $group: {
                    _id: "$appointmentStatus",
                    count: { $sum: 1 },
                }
            },
            {
                $project: {
                    status: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);
        console.log(appointmentStatuses);
        return appointmentStatuses
    } catch(err){
      return null
    }
}

/*..........................................user count........................................*/
async findUsers(): Promise<{ doctors: any[], parents: any[]}> {
  const doctorData = await doctorModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
        _id: 0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);

  
  const parentData = await parentModel.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        count: 1,
        _id: 0
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
return {parents: parentData, doctors: doctorData}
}

/*.................................................find slots......................................*/
async findSlots(): Promise<{totalScheduled: Number, totalCanceled: Number}> {
  const totalScheduled = await appointmentModel.countDocuments({ appointmentStatus: 'Scheduled' });
  const totalCanceled = await appointmentModel.countDocuments({ appointmentStatus: 'Canceled' });
return {totalScheduled,totalCanceled}
}
}