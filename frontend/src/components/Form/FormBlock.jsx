import "./FormBlock.css"
import { useTranslation } from 'react-i18next'
import emailjs from "emailjs-com";
import { useState } from "react"

export function FormBlock(){
    
    const {t, i18n} = useTranslation()

    
      const [message, setMessage] = useState("");
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");

    
  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    const formData = {
      form: email,
      to_name: "aimcompany2025@gmail.com",
      message: message,
      from_name: name,
    };
    try { 
      const response = await emailjs.send(
        "service_w0ctr2u",
        "template_bu5bhta",
        formData,
        "F3IuCP908l8ln97wV"
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

    return (
        <>
            <div className='intro-2 intro-form'>
                <div className="intro-2-inner">
                    <h4 className="form-h3">Оставьте заявку</h4>
                        <form onSubmit={handleSubmitSupport} className="form-form">
                            <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("FormEmail")}
                            required
                            />
                            <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("FormName")}
                            required/>
                            <textarea
                            className="form-area"
                            name="message"
                            placeholder={t("FormMessage")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            />
                        <button
                        className="form-button"
                        type="submit"
                        >
                        {t("FormSend")}
                        </button>
                    </form>
                </div>
                <hr />

                <div className="formblock-content">
                    <img src="/logo.png" alt="" />
                    <h4>{t("FormAddress")}</h4>
                </div>
            </div>
        </>
    )
}