// src/components/CoreSettings.jsx

import { useTranslation } from "react-i18next";
import { InstructionModal } from "./InstructionModal";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/firebase';

export default function CoreSettings() {
  const { t, i18n } = useTranslation();
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState("");
  const [country, setCountry] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSaving, setIsSaving] = useState(false);

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
    console.log(darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    document.body.style.transition = "filter 0.3s ease, background-color 0.3s ease";
  }, []);

  useEffect(() => {
    const fetchUserSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrency(data.currency || "");
          setCountry(data.country || "");
        }
      } catch (error) {
        console.error("Ошибка при загрузке настроек пользователя:", error);
      }
    };
    fetchUserSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const user = auth.currentUser;
    if (!user) {
      setIsSaving(false);
      return;
    }
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, {
        currency: currency,
        country: country
      });
      alert("Настройки успешно сохранены!");
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      alert("Произошла ошибка при сохранении настроек. Попробуйте снова.");
    } finally {
      setIsSaving(false);
    }
  };

  const currencies = ['USD', 'KZT', 'RUB', 'UAH', 'CNY', 'BYN', 'EUR', 'GBP'];
  const countries = ['Россия', 'Казахстан', 'США', 'Китай', 'Великобритания', 'Европейский Союз', 'Беларусь', 'Украина', 'Аргентина'];

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
        <div className="core-item">
          <label>Валюта</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="" disabled>Выберите валюту</option>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
        <div className="core-item">
          <label>Страна</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="" disabled>Выберите страну</option>
            {countries.map((cty) => (
              <option key={cty} value={cty}>
                {cty}
              </option>
            ))}
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

      <button
        className="save-button"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}
