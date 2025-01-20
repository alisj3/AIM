import { useState } from "react";
import "./Login.css";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                        // Open the modal to get additional information
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

    // Handle changes in the modal inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdditionalInfo({
            ...additionalInfo,
            [name]: value
        });
    };

    // Save the additional data to Firestore
    const handleSubmitAdditionalInfo = (e) => {
        e.preventDefault();

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
                            <input
                                type="text"
                                name="country"
                                placeholder="Страна"
                                value={additionalInfo.country}
                                onChange={handleChange}
                                required
                            />
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
