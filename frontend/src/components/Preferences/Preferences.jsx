import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Preferences.css";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export function Preferences({ phone, email }) {
  const { t, i18n } = useTranslation();
  const [activePref, setActivePref] = useState("core");
  const [cardNumber, setCardNumber] = useState('');
  const [cardOwner, setCardOwner] = useState('');
  const [lastLoginTime, setLastLoginTime] = useState(null);

  const addCardInfo = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const userInfoCollection = collection(db, `Users/${user.uid}/Card`);
      const docRef = await addDoc(userInfoCollection, {
        cardNumber: cardNumber,
        cardOwner: cardOwner,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchLastLoginTime = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.lastLogin) {
          setLastLoginTime(data.lastLogin.toDate().toLocaleString());
        }
      }
    }
  };

  const handleProfWindow = (windowName) => {
    setActivePref(windowName);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    fetchLastLoginTime();  // Fetch last login time when the component mounts
  }, [i18n]);

  return (
    <>
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
          {activePref === "core" && (
            <div className="preferences-window preferences-core">
              <div className="core-instruction">
                <h3>{t("generalSettingsTitle")}</h3>
                <img src="/icons/question.png" alt="" title="als" />
                <p>{t("notificationAndThemeSettingsDescription")}</p>
              </div>
              <h3 className="core-h2">{t("basicSettingsHeader")}</h3>
              <div className="preferences-group">
                <div className="core-item">
                  <label>{t("darkThemeSettingLabel")}</label>
                  <input type="checkbox" className="checkbox" id="toggle" />
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
          )}

          {activePref === "card" && (
            <div className="preferences-window preferences-card">
              <div className="preferences-settings preferences-core">
                <div className="preferences-instruction">
                  <h3>{t("cardInfoTitle")}</h3>
                  <img src="/icons/question.png" alt="" />
                  <p>{t("cardInfoDescription")}</p>
                </div>

                <div className="card-info">
                  <div className="auto-payment">
                    <div>
                      <input type="checkbox" className="checkbox" id="toggle" />
                      <label htmlFor="toggle" className="switch"></label>
                    </div>
                    <div>
                      <h4>{t("autoPaymentLabel")}</h4>
                      <p>{t("autoPaymentDescription")}</p>
                    </div>
                  </div>
                  <div className="auto-payment">
                    <div>
                      <input type="checkbox" className="checkbox" id="toggle-2" />
                      <label htmlFor="toggle-2" className="switch"></label>
                    </div>
                    <div>
                      <h4>{t("notifyOnNewPurchaseLabel")}</h4>
                      <p>{t("notifyOnNewPurchaseDescription")}</p>
                    </div>
                  </div>

                  <div className="card-rest">
                    <div className="card-number">
                      <h4>{t("cardNumberLabel")}</h4>
                      <input type="text" onChange={(e) => setCardNumber(e.target.value)} placeholder="Введите номер карты" />
                    </div>
                    <div className="card-owner">
                      <h4>{t("cardOwnerLabel")}</h4>
                      <input type="text" onChange={(e) => setCardOwner(e.target.value)} placeholder="Полное имя" />
                    </div>
                    <div className="card-owner">
                      <h4>{t("countryLabel")}</h4>
                      <input type="text" />
                    </div>
                  </div>
                </div>
                <div className="card-save">
                  <button className="card-button card-cancel">
                    <span>{t("cancelButtonLabel")}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                  <button onClick={addCardInfo} className="card-button card-infosave">
                    <span>{t("saveButtonLabel")}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePref === "security" && (
            <div className="preferences-window preferences-security">
              <div className="security-settings security-core">
                <div className="security-instruction">
                  <h3>{t("securitySettingsTitle")}</h3>
                  <img src="/icons/question.png" alt="" />
                  <p>{t("securitySettingsDescription")}</p>
                </div>
                <div className="security-group">
                  <div className="security-item">
                    <p>{t("emailLabel")}</p>
                    <p>{email}</p>
                  </div>
                  <div className="security-item">
                    <p>{t("passwordLabel")}</p>
                    <a href="#" className="change-password-btn">{t("changePasswordLinkText")}</a>
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
                    <p>Last Login Details</p>
                    {lastLoginTime ? (
                      <span>Last Login: {lastLoginTime}</span>
                    ) : (
                      <span>Loading Last Login...</span>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
