import "./FormBlock.css"
import { useTranslation } from 'react-i18next'

export function FormBlock(){
    
    const {t, i18n} = useTranslation()

    return (
        <>
            <div className='intro-2'>
                <div className="intro-2-inner">
                    <h4 className="form-h3">Оставьте заявку</h4>
                        <form className="form-form">
                            <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder={t("FormEmail")}
                            required
                            />
                            <input
                            className="form-input"
                            type="text"
                            name="name"
                            placeholder={t("FormName")}
                            required/>
                            <textarea
                            className="form-area"
                            name="message"
                            placeholder={t("FormMessage")}
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