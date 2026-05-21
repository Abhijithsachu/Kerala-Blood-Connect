import { FaPhone } from "react-icons/fa6";
import { formatDateTime } from "../utils/dateFormat";

function RequestCard({ request }) {
  const emergency = request.urgencyLevel === "Emergency";

  return (
    <article className={emergency ? "card request-card emergency" : "card request-card"}>
      <div className="card-top">
        <div>
          <h3>{request.hospitalName}</h3>
          <p>{request.location}</p>
        </div>
        <span className="blood-badge">{request.bloodGroupNeeded}</span>
      </div>
      <p>{request.unitsRequired} unit(s) needed for {request.patientName}</p>
      <p><strong>Urgency:</strong> {request.urgencyLevel}</p>
      <p><strong>Posted:</strong> {formatDateTime(request.createdAt)}</p>
      <a className="btn danger small" href={`tel:${request.contactNumber}`}>
        <FaPhone /> Contact
      </a>
    </article>
  );
}

export default RequestCard;
