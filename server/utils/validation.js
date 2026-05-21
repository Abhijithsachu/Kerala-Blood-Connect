const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
const namePattern = /^[A-Za-z .'-]{2,80}$/;
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const isFutureDate = (value) => value && new Date(value) > new Date();

const fail = (message) => ({ valid: false, message });
const pass = () => ({ valid: true });

const validateLoginInput = ({ email, password }) => {
  if (!emailPattern.test(String(email || "").trim())) return fail("Enter a valid email address");
  if (!password) return fail("Password is required");
  return pass();
};

const validateRegisterInput = (body) => {
  if (!namePattern.test(String(body.name || "").trim())) return fail("Name must be 2-80 letters");
  if (!emailPattern.test(String(body.email || "").trim())) return fail("Enter a valid email address");
  if (!body.password || body.password.length < 6 || !/[A-Za-z]/.test(body.password) || !/\d/.test(body.password)) {
    return fail("Password must be at least 6 characters and include a letter and number");
  }
  if (!phonePattern.test(String(body.phone || "").trim())) return fail("Enter a valid 10-digit Indian phone number");
  if (body.role && !["donor", "admin", "hospital"].includes(body.role)) return fail("Invalid role");
  if ((body.role || "donor") === "donor") {
    if (!bloodGroups.includes(body.bloodGroup)) return fail("Select a valid blood group");
    const age = Number(body.age);
    if (!Number.isInteger(age) || age < 18 || age > 65) return fail("Donor age must be between 18 and 65");
    if (String(body.location || "").trim().length < 2) return fail("Enter a valid city or location");
    if (isFutureDate(body.lastDonationDate)) return fail("Last donation date cannot be in the future");
  }
  return pass();
};

const validateProfileInput = (body) => {
  if (body.name && !namePattern.test(String(body.name).trim())) return fail("Name must be 2-80 letters");
  if (body.phone && !phonePattern.test(String(body.phone).trim())) return fail("Enter a valid phone number");
  if (body.location && String(body.location).trim().length < 2) return fail("Enter a valid location");
  if (body.age) {
    const age = Number(body.age);
    if (!Number.isInteger(age) || age < 18 || age > 65) return fail("Age must be between 18 and 65");
  }
  if (isFutureDate(body.lastDonationDate)) return fail("Last donation date cannot be in the future");
  if (body.lastDonationPlace && String(body.lastDonationPlace).trim().length < 2) {
    return fail("Last donated hospital or blood bank must be at least 2 characters");
  }
  return pass();
};

const validateBloodRequestInput = (body) => {
  if (String(body.patientName || "").trim().length < 2) return fail("Patient name is required");
  if (!bloodGroups.includes(body.bloodGroupNeeded)) return fail("Select a valid blood group");
  const units = Number(body.unitsRequired);
  if (!Number.isInteger(units) || units < 1 || units > 20) return fail("Units required must be between 1 and 20");
  if (String(body.hospitalName || "").trim().length < 2) return fail("Hospital name is required");
  if (String(body.location || "").trim().length < 2) return fail("Location is required");
  if (!phonePattern.test(String(body.contactNumber || "").trim())) return fail("Enter a valid contact number");
  if (!["Low", "Medium", "High", "Emergency"].includes(body.urgencyLevel)) return fail("Invalid urgency level");
  return pass();
};

const validateContactInput = (body) => {
  if (!namePattern.test(String(body.name || "").trim())) return fail("Name must be 2-80 letters");
  if (!emailPattern.test(String(body.email || "").trim())) return fail("Enter a valid email address");
  if (body.phone && !phonePattern.test(String(body.phone).trim())) return fail("Enter a valid phone number");
  if (String(body.message || "").trim().length < 10) return fail("Message must be at least 10 characters");
  return pass();
};

const validateBloodBankInput = (body) => {
  if (String(body.name || "").trim().length < 2) return fail("Blood bank name is required");
  if (String(body.address || "").trim().length < 5) return fail("Address must be at least 5 characters");
  if (String(body.city || "").trim().length < 2) return fail("City is required");
  if (body.phone !== "Contact hospital directly" && !phonePattern.test(String(body.phone || "").trim())) {
    return fail("Enter a valid phone number or use Contact hospital directly");
  }
  if (String(body.openingHours || "").trim().length < 2) return fail("Opening hours are required");
  if (body.latitude !== undefined && body.latitude !== "" && (Number(body.latitude) < -90 || Number(body.latitude) > 90)) {
    return fail("Latitude must be between -90 and 90");
  }
  if (body.longitude !== undefined && body.longitude !== "" && (Number(body.longitude) < -180 || Number(body.longitude) > 180)) {
    return fail("Longitude must be between -180 and 180");
  }
  return pass();
};

module.exports = {
  validateLoginInput,
  validateRegisterInput,
  validateProfileInput,
  validateBloodRequestInput,
  validateContactInput,
  validateBloodBankInput
};
