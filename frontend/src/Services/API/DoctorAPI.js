import { axiosInstanceDoctor } from "../AxiosConfig";

export const handleLogoutDoctor = async() => {
    try {
        const response = await axiosInstanceDoctor.post('/api/doctor/logout',{},{withCredentials:true});
        if (response.status === 200) {
            window.localStorage.removeItem('doctorData');
            window.localStorage.removeItem('isLoggin');
            window.localStorage.removeItem('role');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('An error occurred during logout:', error);
      }
}

export async function generateDoctorAccessToken(){
    try{
      const response = await axiosInstanceDoctor.post('/api/doctor/refreshToken',{},{withCredentials: true})
    }catch(error){
  
    }
  }

  export const saveTimeSlots = async (slotsArray) => {
    try {
      const response = await axiosInstanceDoctor.post(`/api/doctor/slots`, {slots: slotsArray}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error saving time slots:', error);
      throw error;
    }
  };

  export const fetchSlotsFromDB = async (page, limit) => {
    try {
    const res = await axiosInstanceDoctor.get('/api/doctor/fetchslots', {params: { page: page, 
      limit: limit  } , withCredentials: true });
    return res.data
  } catch (error) {
    console.error('Error saving time slots:', error);
    throw error;
  }
}

export const updateSlotAvailability = async (slotId, isAvailable) => {
  const res = await axiosInstanceDoctor.put(`/api/doctor/${slotId}/availability`, { isAvailable }, {withCredentials: true})
  return res;
}

export const deleteSlot = async (slotId) => {
  const res = await axiosInstanceDoctor.delete(`/api/doctor/${slotId}/delete`,{withCredentials: true});
  return res;
}

export const getAppointments = async (page, limit) => {
  const res = await axiosInstanceDoctor.get('/api/doctor/getappointments',{params: { page: page, 
    limit: limit  } , withCredentials: true })
  return res.data;
}

export const changeStatus = async (appointmentId, newStatus) => {
  const response = await axiosInstanceDoctor.put(`/api/doctor/${appointmentId}/status`, { status: newStatus }, {withCredentials: true});
  return response.data
}

export const getNotifications = async (doctorId) => {
  try{
    const result = await axiosInstanceDoctor.get(`/api/doctor/notifications/${doctorId}`,{withCredentials: true});
    return result.data
  }catch(error){
    console.error('Error in fetching notifications', error);
    throw error;
}
}

/*.....................................read or unread.........................................*/
export const changeToRead = async (notificationId) => {
  const res = await axiosInstanceDoctor.post('/api/doctor/mark-notification-read', { notificationId }, {withCredentials: true});
}

/*..............................search chat.....................................*/
export const fetchParentList = async (query) => {
  console.log(query)
  try {
    const response = await axiosInstanceDoctor.get(`/api/doctor/parents?search=${query}`,{withCredentials:true});
    return response.data
  } catch (error) {
    console.error("Error fetching doctor data:", error);
  }
}

/*................................fetch messages..............................*/
export const fetchMessages = async (pid) => {
  try {
    const response = await axiosInstanceDoctor.get(`/api/doctor/fetchmessages?id=${pid}`,{withCredentials: true})
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

/*...................................save message to backend..................................*/
export const saveMessage = async (message) => {
  try{
    await axiosInstanceDoctor.post(`/api/doctor/savemessage`,{message},{withCredentials: true})   
  }catch(err){
    console.error("Error saving messages:", err);
  }
}

/*..............................chat lists..................................*/
export const fetchDoctorChats = async () => {
  const res = await axiosInstanceDoctor.get(`/api/doctor/chatlists`,{withCredentials: true})   
  return res.data
}

/*..............................status update........................................*/
export const updateToComplete = async (id) => {
  await axiosInstanceDoctor.put(`/api/doctor/updateStatus/${id}`,{},{withCredentials:true})
}

/*.............................................prescription..................................................*/
export const setPrescription = async (data,id) => {
  await axiosInstanceDoctor.post('/api/doctor/prescription',{data,id},{withCredentials: true}) 
} 

/*........................................fetch prescription..........................................*/
export const fetchPrescription = async (id) => {
  const res = await axiosInstanceDoctor.get(`/api/doctor/prescription/${id}`,{withCredentials: true})
  return res.data;
}

/*...............................................patients..........................................*/
export const getPatients = async (page, limit) => {
  const res = await axiosInstanceDoctor.get('/api/doctor/patients',{params: { page: page, 
    limit: limit  } , withCredentials: true})
  return res.data
}

/*.................................................history...................................................*/
export const fetchHistory = async (id,name) => {
  const res = await axiosInstanceDoctor.get(`/api/doctor/appointment-history/${id}/${name}`,{withCredentials: true})
  return res.data;
}

/*..................................delete.............................................*/
export const deleteChat = async (id) => {
  const res = await axiosInstanceDoctor.delete(`/api/doctor/deletechats/${id}`,{withCredentials: true})
  return res.data;
}