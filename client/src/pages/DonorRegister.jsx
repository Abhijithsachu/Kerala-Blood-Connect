import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaDroplet, FaEye, FaEyeSlash, FaLocationDot, FaUserPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import api, { saveSession } from "../api/api";
import { validateDonorRegistration } from "../utils/validation";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  bloodGroup: "",
  age: "",
  location: "",
  lastDonationDate: "",
  availabilityStatus: true,
  role: "donor"
};

function DonorRegister() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [neverDonated, setNeverDonated] = useState(false);
  const navigate = useNavigate();

  const completedFields = ["name", "email", "password", "phone", "bloodGroup", "age", "location"].filter((field) => form[field]).length;

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const validationError = validateDonorRegistration(form, neverDonated);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const { data } = await api.post("/auth/register", {
        ...form,
        lastDonationDate: neverDonated ? "" : form.lastDonationDate
      });
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-shell register-shell">
        <aside className="auth-visual register-visual">
          <div className="auth-visual-content">
            <span className="eyebrow"><FaUserPlus /> {t("becomeDonor")}</span>
            <h1>{t("registerHeroTitle")}</h1>
            <p>{t("registerHeroDesc")}</p>
            <div className="donor-preview">
              <span className="blood-badge">{form.bloodGroup || "O+"}</span>
              <div>
                <strong>{form.name || t("yourDonorName")}</strong>
                <p><FaLocationDot /> {form.location || t("yourCity")}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="auth-card card">
          <div className="auth-heading">
            <span className="auth-kicker">{t("donorRegistration")}</span>
            <h2>{t("registerTitle")}</h2>
            <p>{completedFields}/7 {t("requiredDetailsCompleted")}</p>
            <div className="progress-track"><span style={{ width: `${(completedFields / 7) * 100}%` }} /></div>
          </div>

          <form className="form" onSubmit={submit}>
            {error && <p className="alert">{error}</p>}
            <div className="form-grid two-col">
              <label>{t("name")}<input name="name" placeholder="Anu Thomas" value={form.name} onChange={update} required /></label>
              <label>{t("email")}<input name="email" type="email" placeholder="anu@example.com" value={form.email} onChange={update} required /></label>
            </div>
            <label>
              {t("password")}
              <span className="password-field">
                <input name="password" type={showPassword ? "text" : "password"} placeholder={t("createPassword")} value={form.password} onChange={update} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>
            <div className="form-grid two-col">
              <label>{t("phoneNumber")}<input name="phone" placeholder="9876543210" value={form.phone} onChange={update} required /></label>
              <label>
                {t("bloodGroup")}
                <select name="bloodGroup" value={form.bloodGroup} onChange={update} required>
                  <option value="">{t("selectGroup")}</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
                </select>
              </label>
            </div>
            <div className="form-grid two-col">
              <label>{t("age")}<input name="age" type="number" min="18" max="65" placeholder="28" value={form.age} onChange={update} required /></label>
              <label>{t("locationCity")}<input name="location" placeholder="Kochi" value={form.location} onChange={update} required /></label>
            </div>
            <div className="donation-date-row">
              <label>{t("lastDonationDate")}<input name="lastDonationDate" type="date" value={form.lastDonationDate} onChange={update} disabled={neverDonated} /></label>
              <label className="never-donated-toggle">
                <input
                  type="checkbox"
                  checked={neverDonated}
                  onChange={(event) => {
                    setNeverDonated(event.target.checked);
                    if (event.target.checked) setForm({ ...form, lastDonationDate: "" });
                  }}
                />
                <span>{t("neverDonated")}</span>
              </label>
            </div>
            <label className="availability-toggle">
              <input name="availabilityStatus" type="checkbox" checked={form.availabilityStatus} onChange={update} />
              <span><FaCalendarCheck /> {t("availableDonateNow")}</span>
            </label>
            <div className="auth-benefits">
              <span><FaDroplet /> {t("publicDonorSearch")}</span>
              <span><FaLocationDot /> {t("cityDiscovery")}</span>
              <span><FaCalendarCheck /> {t("availabilityControl")}</span>
            </div>
            <button className="btn primary full" type="submit">{t("createDonorAccount")}</button>
            <p className="auth-switch">{t("alreadyRegistered")} <Link to="/login">{t("login")}</Link></p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default DonorRegister;
