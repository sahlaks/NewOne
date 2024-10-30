import { axiosInstance } from "../AxiosConfig";

/*........................................feedback.................................*/
export const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get('/api/testimonials'); 
      return response.data
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };