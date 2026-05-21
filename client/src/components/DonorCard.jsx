import { FaPhone, FaWhatsapp, FaFlag } from "react-icons/fa6";
import api from "../api/api";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "Not provided");

function DonorCard({ donor }) {
  const phone = donor.phone || "";
  const report = async () => {
    const reason = window.prompt("Reason for reporting this donor");
    if (reason) await api.post("/reports", { reportedType: "donor", reportedId: donor._id, reason });
    alert("Report submitted");
  };

  return (
    <article className="card donor-card">
      <div className="card-top">
        <div>
          <h3>{donor.name}</h3>
          <p>{donor.location}</p>
        </div>
        <span className="blood-badge">{donor.bloodGroup}</span>
      </div>
      <p className={donor.availabilityStatus ? "status available" : "status unavailable"}>
        {donor.availabilityStatus ? "Available" : "Unavailable"}
      </p>
      <p>Last donation: {formatDate(donor.lastDonationDate)}</p>
      <div className="actions">
        <a className="btn whatsapp small" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
          <FaWhatsapp /> WhatsApp
        </a>
        <a className="btn outline small" href={`tel:${phone}`}>
          <FaPhone /> Call
        </a>
        <button className="icon-btn report" onClick={report} aria-label="Report donor">
          <FaFlag />
        </button>
      </div>
    </article>
  );
}

export default DonorCard;

