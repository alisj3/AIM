import { useState } from "react"
import "./Login.css"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase/firebase"

export function Login(){
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            await signInWithEmailAndPassword(auth, email, password)
            console.log("Logged")
        }catch(error){
            
        }
    }

    return(
        <div className="login">
            <h2 className="login-h2">Здравствуйте</h2>
            <p className="login-p">Войдите чтобы начать</p>

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
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button">Войти</button>
                <a href="#" className="forgot-password">Забыли пароль?</a>
                <p className="login-p-2">или</p>

                <div className="social">
                    <img src="/Facebook Logo.png" alt="" />
                    <img src="/Google Logo.png" alt="" />
                    <img src="/Apple Logo.png" alt="" />
                </div>
            </form>
        </div>
    )
}