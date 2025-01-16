import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase"
import React, {useState} from "react"
import "./Register.css";
import { setDoc, doc } from "firebase/firestore"

export function Register() {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [phone, setPhone] = useState("")
    const [birth, setBirth] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")

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
            className="input-field"
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

            <input
            type="Country"
            className="input-field"
            placeholder="Страна Проживания"
            onChange={(e) => setCountry(e.target.value)}
            />
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
        <a href="#" className="forgot-password">Уже есть аккаунт?</a>
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
