import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CoreSettings from "./CoreSettings";
import CardInfo from "./CardInfo";
import SecuritySettings from "./SecuritySettings";
import PasswordPopup from "./PasswordPopup";
import "./Preferences.css";

export function Preferences({ phone, email }) {
  const { t } = useTranslation();
  const [activePref, setActivePref] = useState("core");
  const [isPasswordPopupVisible, setPasswordPopupVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleProfWindow = (windowName) => setActivePref(windowName);

  return (
    <div className="preferences">
      <div className="preferences-navigation">
        <button
          className={activePref === "core" ? "active-button" : ""}
          onClick={() => handleProfWindow("core")}
        >
          {t("generalSettingsTitle")}
        </button>
        <button
          className={activePref === "card" ? "active-button" : ""}
          onClick={() => handleProfWindow("card")}
        >
          {t("cardInfoTitle")}
        </button>
        <button
          className={activePref === "security" ? "active-button" : ""}
          onClick={() => handleProfWindow("security")}
        >
          {t("securitySettingsTitle")}
        </button>
      </div>

      <div className="preferences-main">
        {activePref === "core" && <CoreSettings />}
        {activePref === "card" && <CardInfo />}
        {activePref === "security" && (
          <SecuritySettings
            email={email}
            phone={phone}
            onShowPasswordPopup={() => setPasswordPopupVisible(true)}
          />
        )}
        
        {isPasswordPopupVisible && (
          <PasswordPopup
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onClose={() => setPasswordPopupVisible(false)}
            setPasswordPopupVisible={setPasswordPopupVisible}
          />
        )}
      </div>
    </div>
  );
}
