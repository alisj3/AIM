import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { doc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { InstructionModal } from "./InstructionModal"

export default function SecuritySettings({ email, phone, onShowPasswordPopup }) {
  const { t } = useTranslation();
  const [lastLoginTime, setLastLoginTime] = useState(null);

  const fetchLastLoginTime = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.lastLogin) {
          setLastLoginTime(data.lastLogin.toDate().toUTCString());
          console.log(data)
        }
      }
    }
  };

  useEffect(() => {
    fetchLastLoginTime(); 
  }, [])

  return (
    <div className="preferences-window preferences-security">
        <div className="security-settings security-core">
        <InstructionModal instrucionTitle={t("securitySettingsTitle")} instructionDescription={t("securitySettingsDescription")} />

        <div className="security-group">
            <div className="security-item">
                <p>{t("emailLabel")}</p>
                <p>{email}</p>
            </div>
            <div className="security-item">
            <p>{t("passwordLabel")}</p>
            <a
                href="#"
                className="change-password-btn"
                onClick={() => onShowPasswordPopup(true)}
            >
                {t("changePasswordLinkText")}
            </a>
            </div>


            <hr />

            <div className="security-item">
            <p>{t("twoFactorAuthenticationLabel")}</p>
            <input type="checkbox" className="checkbox" id="toggle" />
            <label htmlFor="toggle" className="switch"></label>
            </div>
            <div className="security-item">
                <p>{t("phoneNumberLabel")}</p>
                <a href="#" className="number-btn">+{phone}</a>
            </div>

            <hr />

            <div className="security-last-enter">
                {lastLoginTime ? (
                    <>
                        <h3>Последний вход</h3>
                        <p className="last-enter-info">{lastLoginTime}</p>    
                    </>
                    
                ) : (
                    <span>Loading Last Login...</span>
                )}
            </div>

        </div>
        </div>
    </div>
  );
}
