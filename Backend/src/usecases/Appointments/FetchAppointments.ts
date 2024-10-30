import appointmentModel from "../../infrastructure/databases/appointmentModel"

export const getAppointments = async ()=>{
    return  await appointmentModel.find({appointmentStatus:'Scheduled'})
}