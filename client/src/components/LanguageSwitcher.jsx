import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      className="language-select"
      value={i18n.language}
      onChange={(event) => i18n.changeLanguage(event.target.value)}
      aria-label="Language"
    >
      <option value="en">EN</option>
      <option value="ml">ML</option>
    </select>
  );
}

export default LanguageSwitcher;
