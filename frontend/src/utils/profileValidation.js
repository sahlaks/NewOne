export const validateName = (name) => {
    if (!name.trim()) {
        return 'Name is required';
    } else if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    return '';
};

export const validateEmail = (email) => {
    if (!email.trim()) {
        return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        return 'Email is invalid';
    }
    return '';
};

export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
        return 'Phone number must be 10 digits long';
    }
    return '';
};

export const validateNum = (num) => {
    if (!num) {
        return 'Number of kids is required';
    } else if (isNaN(num) || parseInt(num) <= 0) {
        return 'Please enter a valid number of kids';
    }
    return '';
};

export const validateStreet = (street) => {
    if (!street.trim()) {
        return 'Street address is required';
    }
    return '';
};

export const validateCity = (city) => {
    if (!city.trim()) {
        return 'City is required';
    }
    return '';
};

export const validateState = (state) => {
    if (!state.trim()) {
        return 'State is required';
    }
    return '';
};

export const validateCountry = (country) => {
    if (!country.trim()) {
        return 'Country is required';
    }
    return '';
};

export const validateAge = (age) => {
        if (!age) {
            return 'Age is required';
        } else if (isNaN(age) || parseInt(age) <= 0) {
            return 'Please enter a valid number of kids';
        }
        return '';
}

export const validateGender = (gender) => {
    if(!gender)
        return 'Please select a gender'
}

export const validateDegree = (degree) => {
    if(!degree) {
        return 'Degree is required'
    }
}

export const validateFees = (fees) => {
    if(!fees)
        return 'Fees is reguired'
    else if(isNaN(fees) || parseInt(fees) <= 0)
        return 'Please enter a valid number of kids';
    return '';
}

export const validatePassword = (Details) => {
    let newErrors = {};
  
    if(!Details.oldPassword){
        newErrors.oldPassword = 'Old Password is required';
    }

    if (!Details.password) {
      newErrors.password = 'Password is required';
    } else if (Details.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (Details.password.length > 10) {
      newErrors.password = 'Password cannot be longer than 10 characters';
    } else if (!/[A-Z]/.test(Details.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(Details.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(Details.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
  
    // Confirm password validation
    if (Details.password !== Details.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    } else if (!Details.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    }
  
    return newErrors;
  };
  