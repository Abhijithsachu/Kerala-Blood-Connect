import { FaLocationDot, FaPhone } from "react-icons/fa6";

function BloodBankCard({ bank }) {
  const mapQuery = encodeURIComponent(`${bank.name} ${bank.address} ${bank.city}`);

  return (
    <article className="card bank-card">
      <h3>{bank.name}</h3>
      <p>{bank.address}</p>
      <p><strong>City:</strong> {bank.city}</p>
      <p><strong>Hours:</strong> {bank.openingHours}</p>
      <div className="actions">
        <a className="btn outline small" href={`tel:${bank.phone}`}>
          <FaPhone /> Call
        </a>
        <a className="btn primary small" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">
          <FaLocationDot /> Directions
        </a>
      </div>
    </article>
  );
}

export default BloodBankCard;
