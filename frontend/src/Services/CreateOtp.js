import axiosInstance from "./AxiosConfig";


export const generateOTP = async (email) => {
    try {
        const response = await axiosInstance.post('/api/parents/generate-otp', { email });
        if (response.data.success) {
            console.log('OTP:', response.data.otp);
        }
    } catch (error) {
        console.error('Error generating OTP:', error);
    }
};