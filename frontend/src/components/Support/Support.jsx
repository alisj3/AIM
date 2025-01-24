import { useState } from "react";
import emailjs from "emailjs-com";
import "./Support.css";

export function Support() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");

    const handleFileUploadClick = () => {
        document.getElementById("file-upload-input").click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            user_email: email,
            message: message,
            user_name: name,
            // You can also include the file here if needed
        };

        emailjs
            .send("service_hgnc20n", "template_c714yia", formData, "your_user_id")
            .then(
                (response) => {
                    console.log("Email sent successfully:", response);
                    // Optionally clear the form after submission
                },
                (error) => {
                    console.error("Failed to send email:", error);
                }
            );
    };

    return (
        <div className="support">
            <h1>Тех. Поддержка</h1>
            <p>Напишите о вашей проблеме, и мы в скором времени поможем вам</p>

            <form className="support-form" onSubmit={handleSubmit}>
                <h3>E-MAIL</h3>
                <input
                    type="email"
                    placeholder="Ваша почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <h3>СООБЩЕНИЕ</h3>
                <div className="support-textarea">
                    <textarea
                        placeholder="Опишите свою проблему"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <button
                        type="button"
                        className="file-upload-button"
                        onClick={handleFileUploadClick}
                    >
                        <span>Прикрепить файлы</span> <img src="/icons/attach.png" alt="" />
                    </button>
                </div>

                <div className="file-upload">
                    <input
                        type="file"
                        id="file-upload-input"
                        accept=".pdf,.doc,.docx,.txt"
                        style={{ display: "none" }}
                    />
                </div>

                <h3>ИМЯ</h3>
                <div className="support-name-input">
                    <input
                        className="name-input-text"
                        type="text"
                        placeholder="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        className="name-input-submit"
                        type="submit"
                        value="Отправить"
                    />
                </div>
            </form>
        </div>
    );
}
