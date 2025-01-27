import { useTranslation } from "react-i18next";
import { InstructionModal } from "./InstructionModal";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

export default function CoreSettings() {
  const { t, i18n } = useTranslation();

  const [darkTheme, setDarkTheme] = useState(localStorage.getItem("theme") || "light");

  const location = useLocation();
  const currentPath = location.pathname;

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const handleThemeChange = () => {
    const newTheme = darkTheme === "light" ? "dark" : "light";
    setDarkTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (darkTheme === "dark") {
      document.body.style.filter = "invert(100%) hue-rotate(180deg)";
      document.body.style.backgroundColor = "#000";
    } else if (darkTheme === "light") {
      document.body.style.filter = "none";
      document.body.style.backgroundColor = "white"; 
    }
    console.log(darkTheme)
  }, [darkTheme]);


  useEffect(() => {
    document.body.style.transition = "filter 0.3s ease, background-color 0.3s ease";
  }, []);

  return (
    <div className="preferences-window preferences-core">
      <InstructionModal
        instrucionTitle={t("generalSettingsTitle")}
        instructionDescription={t("notificationAndThemeSettingsDescription")}
      />

      <h3 className="core-h2">{t("basicSettingsHeader")}</h3>
      <div className="preferences-group">
        <div className="core-item">
          <label>{t("darkThemeSettingLabel")}</label>
          <input
            type="checkbox"
            className="checkbox"
            id="toggle"
            checked={darkTheme === "dark"}
            onChange={handleThemeChange}
          />
          <label htmlFor="toggle" className="switch"></label>
        </div>
        <div className="core-item">
          <label>{t("languageSettingLabel")}</label>
          <select onChange={handleLanguageChange} value={i18n.language}>
            <option value="ru">{t("languageRussian")}</option>
            <option value="en">{t("languageEnglish")}</option>
            <option value="kz">{t("languageKazakh")}</option>
          </select>
        </div>
      </div>

      <h3>{t("notificationsHeader")}</h3>
      <div className="preferences-group">
        <div className="notification-item">
          <input type="checkbox" />
          <div>
            <label>{t("emailNotificationSettingLabel")}</label>
            <p>{t("emailNotificationDescription")}</p>
          </div>
        </div>
        <div className="notification-item">
          <input type="checkbox" />
          <div>
            <label>{t("purchaseReceiptNotificationLabel")}</label>
            <p>{t("purchaseReceiptNotificationDescription")}</p>
          </div>
        </div>
        <div className="notification-item">
          <input type="checkbox" />
          <div>
            <label>{t("subscriptionNotificationLabel")}</label>
            <p>{t("subscriptionNotificationDescription")}</p>
          </div>
        </div>
        <div className="notification-item">
          <input type="checkbox" />
          <div>
            <label>{t("subscriptionRenewalNotificationLabel")}</label>
            <p>{t("subscriptionRenewalNotificationDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
