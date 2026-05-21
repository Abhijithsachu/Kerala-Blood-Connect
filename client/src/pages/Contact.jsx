import { useState } from "react";
import { FaPhoneVolume } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import api from "../api/api";

function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/contact", form);
    setStatus(t("messageSent"));
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="page section split">
      <div>
        <h1>{t("contactTitle")}</h1>
        <form className="form card" onSubmit={submit}>
          {status && <p className="success">{status}</p>}
          <input name="name" placeholder={t("name")} value={form.name} onChange={update} required />
          <input name="email" type="email" placeholder={t("email")} value={form.email} onChange={update} required />
          <input name="phone" placeholder={t("phone")} value={form.phone} onChange={update} />
          <textarea name="message" placeholder={t("message")} value={form.message} onChange={update} required />
          <button className="btn primary" type="submit">{t("sendMessage")}</button>
        </form>
      </div>
      <aside className="card emergency-contact">
        <FaPhoneVolume />
        <h2>{t("emergencyContact")}</h2>
        <p>{t("emergencyContactDesc")}</p>
        <a className="btn danger" href="tel:108">{t("call108")}</a>
      </aside>
    </section>
  );
}

export default Contact;
