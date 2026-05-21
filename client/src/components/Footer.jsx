import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3 className="footer-brand">
          <img src="/kerala-blood-connect-logo.png" alt="Kerala Blood Connect logo" />
          Kerala Blood Connect
        </h3>
        <p>Connecting donors, patients, hospitals, and blood banks during the moments that matter.</p>
      </div>
      <div className="footer-links">
        <Link to="/find-donors">Find Donors</Link>
        <Link to="/request-blood">Request Blood</Link>
        <Link to="/blood-banks">Blood Banks</Link>
        <Link to="/education">Education</Link>
      </div>
      <div className="emergency-card">
        <FaPhone />
        <strong>Emergency Help</strong>
        <span>Call 108 or your nearest hospital immediately.</span>
      </div>
    </footer>
  );
}

export default Footer;
