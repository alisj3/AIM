import { useState } from "react";
import { Link } from "react-router-dom"
import "./Login.css";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useTranslation } from 'react-i18next'

export function Login() {
    const {t, i18n} = useTranslation()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState({
        name: "",
        surname: "",
        phone: "",
        birth: "",
        address: "",
        country: ""
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/profile";
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const userRef = doc(db, "Users", user.uid);
    
                getDoc(userRef).then((docSnap) => {
                    if (!docSnap.exists()) {
                        setModalOpen(true);
                    } else {
                        window.location.href = "/profile";
                    }
                });
            })
            .catch((error) => {
                console.error("Error during Google login:", error);
            });
    }
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfo({
            ...additionalInfo,
            [name]: value
        });
    };

    const handleSubmitAdditionalInfo = (e) => {
        e.preventDefault();

        if (!additionalInfo.country) {
            alert("Please select a country.");
            return;
        }

        console.log("Selected country:", additionalInfo.country);

        const user = auth.currentUser;
        const userRef = doc(db, "Users", user.uid);

        setDoc(userRef, {
            email: user.email,
            name: additionalInfo.name,
            surname: additionalInfo.surname,
            phone: additionalInfo.phone,
            birth: additionalInfo.birth,
            address: additionalInfo.address,
            country: additionalInfo.country,
        })
            .then(() => {
                setModalOpen(false);
                window.location.href = "/profile";
            })
            .catch((error) => {
                console.error("Error saving user data:", error);
            });
    };

    return (
        <div className="login">
            <h2 className="login-h2">{t("LoginWelcome")}</h2>
            <p className="login-p">{t("LoginSubtitle")}</p>

            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input-field"
                    placeholder={t("LoginPassword")}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="input-field"
                    placeholder={t("LoginCheckPassword")}
                />
                <button className="login-button">{t("LoginEnter")}</button>
                <Link to="/register" className="forgot-password">{t("LoginNoAccount")}?</Link>
                <p className="login-p-2">{t("LoginOr")}</p>

                <div className="social">
                    <img src="/Facebook Logo.png" alt="" />
                    <img onClick={googleLogin} src="/Google Logo.png" alt="" />
                    <img src="/Apple Logo.png" alt="" />
                </div>
            </form>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Пожалуйста, введите свои данные</h3>
                        <form onSubmit={handleSubmitAdditionalInfo}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Имя"
                                value={additionalInfo.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Фамилия"
                                value={additionalInfo.surname}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Номер телефона"
                                value={additionalInfo.phone}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="date"
                                name="birth"
                                placeholder="Дата рождения"
                                value={additionalInfo.birth}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Адрес"
                                value={additionalInfo.address}
                                onChange={handleChange}
                                required
                            />
                            <select
                                className="input-field"
                                name="country"
                                value={additionalInfo.country}
                                onChange={handleChange}
                                placeholder="Страна Проживания"
                                required
                            >
                                <option value="">Select a country</option>
                                {countries.map((countryName, index) => (
                                    <option key={index} value={countryName}>
                                        {countryName}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="modal-button">Подтвердить</button>
                            <button
                                type="button"
                                className="modal-button-close"
                                onClick={() => setModalOpen(false)}
                            >
                                Закрыть
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
