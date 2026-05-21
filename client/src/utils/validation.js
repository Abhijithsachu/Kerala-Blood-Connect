const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
const namePattern = /^[A-Za-z .'-]{2,80}$/;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const isFutureDate = (value) => value && new Date(value) > new Date();

export const validateLogin = ({ email, password }) => {
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  if (!password) return "Password is required.";
  return "";
};

export const validateDonorRegistration = (form, neverDonated = false) => {
  if (!namePattern.test(form.name.trim())) return "Name must be 2-80 letters.";
  if (!emailPattern.test(form.email.trim())) return "Enter a valid email address.";
  if (form.password.length < 6 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    return "Password must be at least 6 characters and include a letter and number.";
  }
  if (!phonePattern.test(form.phone.trim())) return "Enter a valid 10-digit Indian phone number.";
  if (!bloodGroups.includes(form.bloodGroup)) return "Select a valid blood group.";
  const age = Number(form.age);
  if (!Number.isInteger(age) || age < 18 || age > 65) return "Donor age must be between 18 and 65.";
  if (form.location.trim().length < 2) return "Enter a valid city or location.";
  if (!neverDonated && isFutureDate(form.lastDonationDate)) return "Last donation date cannot be in the future.";
  return "";
};

export const validateBloodRequest = (form) => {
  if (form.patientName.trim().length < 2) return "Patient name is required.";
  if (!bloodGroups.includes(form.bloodGroupNeeded)) return "Select a valid blood group.";
  const units = Number(form.unitsRequired);
  if (!Number.isInteger(units) || units < 1 || units > 20) return "Units required must be between 1 and 20.";
  if (form.hospitalName.trim().length < 2) return "Hospital name is required.";
  if (form.location.trim().length < 2) return "Location is required.";
  if (!phonePattern.test(form.contactNumber.trim())) return "Enter a valid contact number.";
  return "";
};

export const validateContact = (form) => {
  if (!namePattern.test(form.name.trim())) return "Name must be 2-80 letters.";
  if (!emailPattern.test(form.email.trim())) return "Enter a valid email address.";
  if (form.phone && !phonePattern.test(form.phone.trim())) return "Enter a valid phone number.";
  if (form.message.trim().length < 10) return "Message must be at least 10 characters.";
  return "";
};

export const validateProfile = (form) => {
  if (form.name && !namePattern.test(form.name.trim())) return "Name must be 2-80 letters.";
  if (form.phone && !phonePattern.test(form.phone.trim())) return "Enter a valid phone number.";
  if (form.location && form.location.trim().length < 2) return "Enter a valid location.";
  if (form.age) {
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 18 || age > 65) return "Age must be between 18 and 65.";
  }
  if (isFutureDate(form.lastDonationDate)) return "Last donation date cannot be in the future.";
  if (form.lastDonationPlace && form.lastDonationPlace.trim().length < 2) {
    return "Last donated hospital or blood bank must be at least 2 characters.";
  }
  return "";
};

export const validateBloodBank = (form) => {
  if (form.name.trim().length < 2) return "Blood bank name is required.";
  if (form.address.trim().length < 5) return "Address must be at least 5 characters.";
  if (form.city.trim().length < 2) return "City is required.";
  if (form.phone !== "Contact hospital directly" && !phonePattern.test(form.phone.trim())) {
    return "Enter a valid phone number or use Contact hospital directly.";
  }
  if (form.openingHours.trim().length < 2) return "Opening hours are required.";
  if (form.latitude && (Number(form.latitude) < -90 || Number(form.latitude) > 90)) return "Latitude must be between -90 and 90.";
  if (form.longitude && (Number(form.longitude) < -180 || Number(form.longitude) > 180)) return "Longitude must be between -180 and 180.";
  return "";
};
