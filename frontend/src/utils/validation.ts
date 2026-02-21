export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePassword = (password: string, isSignUp: boolean = false): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (isSignUp) {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
  }
  return null;
};

export const validateName = (name: string, fieldName: string = "Name"): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
};

export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  if (!dateOfBirth) {
    return "Date of birth is required";
  }
  
  const date = new Date(dateOfBirth);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Please enter a valid date";
  }
  
  // Check if date is in the future
  if (date > today) {
    return "Date of birth cannot be in the future";
  }
  
  // Calculate age correctly
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  // Check age constraints
  if (age < 13) {
    return "You must be at least 13 years old";
  }
  if (age > 120) {
    return "Please enter a valid date of birth";
  }
  
  return null;
};

