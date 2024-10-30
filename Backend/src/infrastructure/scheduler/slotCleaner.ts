import cron from 'node-cron';
import { SlotRepository } from '../repository/slotRepository';
const slotRepository = new SlotRepository();


// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running the cron job to delete expired slots...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
        const result = await slotRepository.deleteSlotsBefore(today);
        console.log(`Deleted ${result} slots for ${today.toDateString()}`);
    } catch (error) {
        console.error('Failed to delete expired slots:', error);
    }
});