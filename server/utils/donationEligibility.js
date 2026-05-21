const DONATION_COOLDOWN_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const getDonationEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      isCoolingDown: false,
      isEligible: true,
      eligibleFrom: null,
      daysRemaining: 0
    };
  }

  const lastDate = new Date(lastDonationDate);
  const eligibleFrom = new Date(lastDate.getTime() + DONATION_COOLDOWN_DAYS * DAY_MS);
  const now = new Date();
  const isCoolingDown = now < eligibleFrom;

  return {
    isCoolingDown,
    isEligible: !isCoolingDown,
    eligibleFrom,
    daysRemaining: isCoolingDown ? Math.ceil((eligibleFrom - now) / DAY_MS) : 0
  };
};

const buildAvailabilityNotification = (donor) => {
  if (!donor?.lastDonationDate || donor.availabilityStatus) return null;

  const eligibility = getDonationEligibility(donor.lastDonationDate);
  if (eligibility.isEligible) {
    return "It has been 3 months since your last donation. You can change your availability to Available now.";
  }

  return `You are marked unavailable for ${eligibility.daysRemaining} more day(s) after your last donation.`;
};

module.exports = { DONATION_COOLDOWN_DAYS, getDonationEligibility, buildAvailabilityNotification };

