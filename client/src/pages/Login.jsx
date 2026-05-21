import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHeartPulse, FaShieldHeart, FaUserDoctor } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import api, { saveSession } from "../api/api";

function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async (credentials = form) => {
    setError("");
    try {
      const { data } = await api.post("/auth/login", credentials);
      saveSession(data);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <section className="auth-page">
      <div className="auth-shell login-shell">
        <aside className="auth-visual login-visual">
          <div className="auth-visual-content">
            <span className="eyebrow"><FaShieldHeart /> {t("trustedDonorNetwork")}</span>
            <h1>{t("loginTitle")}</h1>
            <p>{t("loginHeroDesc")}</p>
            <div className="auth-highlights">
              <span><FaHeartPulse /> {t("emergencyReady")}</span>
              <span><FaUserDoctor /> {t("adminModerated")}</span>
              <span><FaShieldHeart /> {t("privacyAware")}</span>
            </div>
          </div>
        </aside>

        <div className="auth-card card">
          <div className="auth-heading">
            <span className="auth-kicker">{t("secureLogin")}</span>
            <h2>{t("signInContinue")}</h2>
            <p>{t("loginFormDesc")}</p>
          </div>
          <form className="form" onSubmit={submit}>
            {error && <p className="alert">{error}</p>}
            <label>{t("emailAddress")}<input type="email" placeholder="anu@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label>
              {t("password")}
              <span className="password-field">
                <input type={showPassword ? "text" : "password"} placeholder={t("enterPassword")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>
            <button className="btn primary full" type="submit">{t("login")}</button>
          </form>

          <p className="auth-switch">{t("newDonor")} <Link to="/register">{t("registerHere")}</Link></p>
        </div>
      </div>
    </section>
  );
}

export default Login;
