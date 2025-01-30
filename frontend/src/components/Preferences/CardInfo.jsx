import { useState } from "react";
import { useTranslation } from "react-i18next";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { InstructionModal } from "./InstructionModal";

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", 
    "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", 
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", 
    "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", 
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", 
    "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
    "Iran", "Iraq", "Ireland", "Israel", "Italy", 
    "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", 
    "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", 
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", 
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
    "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", 
    "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
    "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", 
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
    ];

export default function CardInfo() {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [carCountry, setCardCountry] = useState("")

  const addCardInfo = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const userInfoCollection = collection(db, `Users/${user.uid}/Card`);
      await addDoc(userInfoCollection, { cardNumber, cardOwner, carCountry });
      alert(t("cardAddedSuccess"));
    } catch (e) {
      console.error("Error adding card info: ", e);
    }
  };

  return (
    <div className="preferences-window preferences-card">
        <div className="preferences-settings preferences-core">
        <InstructionModal instrucionTitle={t("cardInfoTitle")} instructionDescription={t("cardInfoDescription")} />

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
                    <input type="text" onChange={(e) => setCardNumber(e.target.value)} placeholder={t("cardNumberPlaceholder")} />
                </div>
                <div className="card-owner">
                    <h4>{t("cardOwnerLabel")}</h4>
                    <input type="text" onChange={(e) => setCardOwner(e.target.value)} placeholder={t("cardNamePlaceholder")} />
                </div>
                <div className="card-owner">
                    <h4>{t("countryLabel")}</h4>
                    <select
                        className="input-field"
                        onChange={(e) => setCardCountry(e.target.value)}
                        placeholder="Страна Проживания"
                    >
                        <option value="">Select a country</option>
                        {countries.map((countryName, index) => (
                            <option key={index} value={countryName}>
                                {countryName}
                            </option>
                        ))}
                    </select>
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
  );
}
