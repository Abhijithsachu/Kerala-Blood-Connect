import { FaDroplet, FaHandHoldingHeart, FaUsers } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <section className="page section">
      <h1>{t("aboutTitle")}</h1>
      <p className="lead">{t("aboutLead")}</p>
      <div className="grid three stats">
        <div className="card"><FaDroplet /><strong>8</strong><span>{t("bloodGroupsSupported")}</span></div>
        <div className="card"><FaUsers /><strong>{t("public")}</strong><span>{t("openDonorDiscovery")}</span></div>
        <div className="card"><FaHandHoldingHeart /><strong>24/7</strong><span>{t("emergencyRequestVisibility")}</span></div>
      </div>
      <div className="content-block">
        <h2>{t("mission")}</h2>
        <p>{t("missionDesc")}</p>
        <h2>{t("whyDonationMatters")}</h2>
        <p>{t("whyDonationMattersDesc")}</p>
      </div>
    </section>
  );
}

export default About;
