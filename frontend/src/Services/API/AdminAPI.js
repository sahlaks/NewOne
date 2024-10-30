import { axiosInstanceAdmin} from "../AxiosConfig"

export const fetchParents = async (page, limit) => {
    const res = await axiosInstanceAdmin.get('/api/admin/fetch-parents',{params: { page: page, 
      limit: limit  }, withCredentials: true})
    return res
    
}

export const blockParent = async (parentId) => {
    try {
      const res = await axiosInstanceAdmin.put(`/api/admin/block-parent/${parentId}`, {}, { withCredentials: true });
      return res;
    } catch (err) {
      console.error('Error blocking/unblocking parent:', err);
      throw err; 
    }
  };


export const deleteParent = async (parentId) => {
    try{
        const res = axiosInstanceAdmin.delete(`/api/admin/delete-parent/${parentId}`,{},{withCredentials: true});
        return res;
    }catch(err){
        console.error('Error blocking/unblocking parent:', err);
      throw err;
    }
}

export const fetchDoctors = async (query, page, limit, isVerified) => {
    const res = await axiosInstanceAdmin.get('/api/admin/fetch-doctors', {params: { search: query,  page: page, 
      limit: limit, isVerified: isVerified  }, withCredentials: true})
    return res
}

export const blockDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.put(`/api/admin/doctor/${id}/block`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error blocking doctor:', error);
        throw error;
      }
}

export const verifyDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.post(`/api/admin/doctor/${id}/verify`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error verifying doctor:', error);
        throw error;
      }
}

export const deleteDoctor = async (id) => {
    try {
        const response = await axiosInstanceAdmin.delete(`/api/admin/doctor/${id}/delete`,{},{withCredentials: true});
        return response.data;
      } catch (error) {
        console.error('Error deleting doctor:', error);
        throw error;
      }
}

export const rejectDoctor = async (id, reason) => {
  try {
   const response = await axiosInstanceAdmin.post(`/api/admin/doctor/${id}/reject`,{reason},{withCredentials: true});
  return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}

export const fetchAppointmentsPerMonth = async () => {
  try {
    const response = await axiosInstanceAdmin.get(`/api/admin/appointments-per-month`,{withCredentials: true}); 
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments per month:", error);
    throw error;
  }
};

export const fetchPatientGenderDistribution = async () => {
  try {
    const response = await axiosInstanceAdmin.get(`/api/admin/gender-distribution`,{withCredentials: true}); 
    return response.data;
  } catch (error) {
    console.error("Error fetching gender status:", error);
    throw error;
  }
};

export const fetchAppointmentStatusDistribution = async () => {
  try {
    const response = await axiosInstanceAdmin.get(`/api/admin/appointment-status`,{withCredentials: true}); 
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment status:", error);
    throw error;
  }
};

export const fetchUserGrowth = async () => {
  try {
    const response = await axiosInstanceAdmin.get(`/api/admin/user-growth`,{withCredentials: true}); 
    return response.data;
  } catch (error) {
    console.error("Error fetching user growth per month:", error);
    throw error;
  }
};

export const fetchSlotUsageStatistics = async () => {
  try {
    const response = await axiosInstanceAdmin.get(`/api/admin/slot-usage`,{withCredentials: true}); 
    return response.data;
  } catch (error) {
    console.error("Error fetching user growth per month:", error);
    throw error;
  }
}
