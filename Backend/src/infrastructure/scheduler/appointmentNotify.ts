import cron from 'node-cron';
import appointmentModel from '../databases/appointmentModel';
import { sendNotificationToUser } from '../services/socketServerConnection'

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000); 

    try{
        const upcomingAppointments = await appointmentModel.find({
            date: todayStart.toDateString(),
            startTime: {
                $gte: now.toTimeString().slice(0, 5),
                $lte: fifteenMinutesLater.toTimeString().slice(0, 5),
            },
            appointmentStatus:'Scheduled'
        })
    
        for (const appointment of upcomingAppointments) {
             let pmessage = `Remainder: Your child's appointment with Dr. ${appointment.doctorName} is at ${appointment.startTime}.`;
             sendNotificationToUser(appointment.parentId.toString(), pmessage);
             
             // Send notification to doctor
             let dmessage = `Remainder: You have an appointment with ${appointment.parentName} in at ${appointment.startTime}.`;
             sendNotificationToUser(appointment.doctorId.toString(), dmessage);
            }
    } catch (error) {
        console.error('Error checking for upcoming appointments:', error); 
    }

})