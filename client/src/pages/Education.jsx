import { useTranslation } from "react-i18next";

function Education() {
  const { t } = useTranslation();
  const faqs = [
    [t("faqWhoQ"), t("faqWhoA")],
    [t("faqOftenQ"), t("faqOftenA")],
    [t("faqSafeQ"), t("faqSafeA")],
    [t("faqBeforeQ"), t("faqBeforeA")]
  ];

  return (
    <section className="page section">
      <h1>{t("educationTitle")}</h1>
      <div className="grid two">
        <article className="card">
          <h2>{t("benefitsDonation")}</h2>
          <p>{t("benefitsDonationDesc")}</p>
        </article>
        <article className="card">
          <h2>{t("donationEligibility")}</h2>
          <p>{t("donationEligibilityDesc")}</p>
        </article>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer]) => (
          <details className="card" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default Education;
