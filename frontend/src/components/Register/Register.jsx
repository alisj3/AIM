import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase"
import React, {useState} from "react"
import "./Register.css";
import { setDoc, doc } from "firebase/firestore"
import { Link } from "react-router-dom";

export function Register() {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [phone, setPhone] = useState("")
    const [birth, setBirth] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")

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
  

    const handleRegister = async (e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    address: address,
                    country: country,
                    name: name,
                    surname: surname,
                    phone: phone,
                    birth: birth,
                })
            }
            
            window.location.href = "/login"
            
        }catch(error){
            console.log(error)
        }
    }

  return (
    <div className="register">
      <h2 className="register-h2">Добро пожаловать</h2>
      <p className="register-p">Создайте учетную запись</p>

      <form className="register-form" onSubmit={handleRegister}>
        <div className="" style={{display: "flex", }}>
            <input
            type="text"
            className="input-field"
            placeholder="Имя"
            onChange={(e) => setName(e.target.value)}
            />

            <input
            type="text"
            className="input-field"
            placeholder="Фамилия"
            onChange={(e) => setSurname(e.target.value)}
            />
        </div>

        <div className=""  style={{display: "flex", }}>
            <input
            type="tel"
            className="input-field"
            placeholder="Номер телефона"
            onChange={(e) => setPhone(e.target.value)}
            />
            <input
            type="date"
            className="input-field custom-date-input"
            placeholder="Дата Рождения"
            onChange={(e) => setBirth(e.target.value)}
            />
        </div>

        <input
          type="email"
          className="input-field"
          placeholder="Почта"
            onChange={(e) => setEmail(e.target.value)}
        />
        <div className=""  style={{display: "flex", }}>
            <input
            type="address"
            className="input-field"
            placeholder="Адресс"
            onChange={(e) => setAddress(e.target.value)}
            />

            <select
                className="input-field"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
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
       
        <input
          type="password"
          className="input-field"
          placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Подтверждение Пароля"
        />
        <button className="register-button">Регистрация</button>
        <Link to="/login" className="forgot-password">Есть аккаунт?</Link>
        <p className="register-p">или</p>

        <div className="social">
            <img src="/Facebook Logo.png" alt="" />
            <img src="/Google Logo.png" alt="" />
            <img src="/Apple Logo.png" alt="" />
        </div>
      </form>
    </div>
  );
}
