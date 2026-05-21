import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartPulse, FaHospital, FaMagnifyingGlass, FaUserPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import RequestCard from "../components/RequestCard";
import BloodBankCard from "../components/BloodBankCard";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const homeBloodBankLimit = import.meta.env.VITE_HOME_BLOOD_BANK_LIMIT || "2";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ bloodGroup: "", location: "" });
  const [requests, setRequests] = useState([]);
  const [requestStatus, setRequestStatus] = useState("loading");
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    api
      .get("/requests/public")
      .then((res) => {
        const emergency = res.data.filter((item) => item.urgencyLevel === "Emergency");
        setRequests((emergency.length ? emergency : res.data).slice(0, 2));
        setRequestStatus("ready");
      })
      .catch(() => setRequestStatus("error"));
    api.get(`/blood-banks?limit=${homeBloodBankLimit}`).then((res) => setBanks(res.data)).catch(() => {});
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(search).toString();
    navigate(`/find-donors?${params}`);
  };

  return (
    <>
      <section className="hero">
        <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="visible">
          <motion.span className="eyebrow" variants={fadeUp}><FaHeartPulse /> {t("heroEyebrow")}</motion.span>
          <motion.h1 variants={fadeUp}>{t("headline")}</motion.h1>
          <motion.p variants={fadeUp}>{t("subtext")}</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <Link className="btn primary" to="/find-donors">{t("findDonors")}</Link>
            <Link className="btn danger" to="/request-blood">{t("requestBlood")}</Link>
          </motion.div>
          <motion.form className="search-panel hero-search" onSubmit={submit} variants={fadeUp}>
            <select value={search.bloodGroup} onChange={(e) => setSearch({ ...search, bloodGroup: e.target.value })}>
              <option value="">{t("bloodGroup")}</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
            </select>
            <input placeholder={t("cityOrLocation")} value={search.location} onChange={(e) => setSearch({ ...search, location: e.target.value })} />
            <button className="btn primary" type="submit"><FaMagnifyingGlass /> {t("search")}</button>
          </motion.form>
          <motion.div className="hero-stats" variants={fadeUp}>
            <span><strong>181</strong> {t("keralaBloodCenters")}</span>
            <span><strong>8</strong> {t("bloodGroups")}</span>
            <span><strong>24/7</strong> {t("emergencyVisibility")}</span>
          </motion.div>
        </motion.div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>{t("emergencyRequests")}</h2>
          <Link to="/requests">{t("viewAll")}</Link>
        </div>
        <div className="grid two emergency-preview-grid">
          {requestStatus === "loading" && <div className="card state-card">{t("loadingEmergencyRequests")}</div>}
          {requestStatus === "error" && (
            <div className="card state-card alert-card">
              {t("emergencyLoadError")}
            </div>
          )}
          {requestStatus === "ready" && requests.length === 0 && (
            <div className="card state-card">{t("noEmergencyRequests")}</div>
          )}
          {requestStatus === "ready" && requests.map((item) => (
            <div key={item._id}>
              <RequestCard request={item} />
            </div>
          ))}
        </div>
      </section>

      <motion.section className="section tinted" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.h2 variants={fadeUp}>{t("howWorks")}</motion.h2>
        <motion.div className="grid three" variants={stagger}>
          <motion.div className="info-block interactive-block" variants={fadeUp}><FaMagnifyingGlass /><h3>{t("find")}</h3><p>{t("findDesc")}</p></motion.div>
          <motion.div className="info-block interactive-block" variants={fadeUp}><FaUserPlus /><h3>{t("register")}</h3><p>{t("registerDesc")}</p></motion.div>
          <motion.div className="info-block interactive-block" variants={fadeUp}><FaHospital /><h3>{t("respond")}</h3><p>{t("respondDesc")}</p></motion.div>
        </motion.div>
      </motion.section>

      <motion.section className="section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={stagger}>
        <div className="section-heading">
          <motion.h2 variants={fadeUp}>{t("nearbyBloodBanks")}</motion.h2>
          <Link to="/blood-banks">{t("explore")}</Link>
        </div>
        <motion.div className="grid two" variants={stagger}>
          {banks.length ? banks.map((bank) => (
            <motion.div key={bank._id} variants={fadeUp}>
              <BloodBankCard bank={bank} />
            </motion.div>
          )) : <p>{t("bloodBanksEmpty")}</p>}
        </motion.div>
      </motion.section>

      <motion.section className="section faq-preview home-cta" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45 }}>
        <h2>{t("learnBeforeDonate")}</h2>
        <p>{t("learnBeforeDonateDesc")}</p>
        <Link className="btn outline" to="/education">{t("openEducation")}</Link>
      </motion.section>
    </>
  );
}

export default Home;
