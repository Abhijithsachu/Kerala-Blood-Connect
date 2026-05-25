import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaPhone } from "react-icons/fa6";
import api from "../api/api";

const defaultSettings = {
  emergencyPhone: "108",
  emergencyNote: "Call 108 or your nearest hospital immediately."
};

function Footer() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings));
  }, []);

  const emergencyPhone = settings.emergencyPhone || defaultSettings.emergencyPhone;
  const emergencyNote = settings.emergencyNote || defaultSettings.emergencyNote;

  return (
    <footer className="footer">
      <div>
        <h3 className="footer-brand">
          <img src="/kerala-blood-connect-logo.png" alt="Kerala Blood Connect logo" />
          Kerala Blood Connect
        </h3>
        <p>Connecting donors, patients, hospitals, and blood banks during the moments that matter.</p>
        <p className="footer-credit">
          Developed by <strong>ABHIJITH</strong>
          <a href="https://www.linkedin.com/in/abhijith-tp-" target="_blank" rel="noreferrer" aria-label="Abhijith LinkedIn profile">
            <FaLinkedin /> LinkedIn
          </a>
        </p>
      </div>
      <div className="footer-links">
        <Link to="/find-donors">Find Donors</Link>
        <Link to="/request-blood">Request Blood</Link>
        <Link to="/blood-banks">Blood Banks</Link>
        <Link to="/education">Education</Link>
      </div>
      <div className="emergency-card">
        <div className="emergency-title">
          <FaPhone />
          <strong>Emergency Help</strong>
        </div>
        <a href={`tel:${emergencyPhone}`}>{emergencyPhone}</a>
        <span>{emergencyNote}</span>
      </div>
    </footer>
  );
}

export default Footer;
