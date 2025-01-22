import './Intro.css'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Intro(){
    
    const {t, i18n} = useTranslation()

    return(
        <>
            <div className='intro' style={{ whiteSpace: "pre-wrap" }}>
                <h3>AIM - COMPANY</h3>
                <h1>{t("inovativeSolutions")}</h1>
                <div className="intro-buttons">
                    <a href='#offer' className='intro-button'>{t("introWho")}</a>
                    <Link to="/register" className='intro-button'>{t("introTouch")}</Link>
                </div>
            </div>

            <div className='intro-2'>
                <h3>Artificial Intelligence <br /> Manufactoring</h3>
                <hr />
                <img src="/logo.png" alt="" />
            </div>

            <div className='intro-3' id='offer'>
                <h3>ЧТО МЫ МОЖЕМ <br /> ПРЕДЛОЖИТЬ?</h3>
                <div className="timeline-container">
                <div className="timeline">
                    <Link to="/profile" className="timeline-item">
                        <div className="dot"></div>
                        <p>Цифровая Экосистема</p>
                    </Link>
                    <Link className="timeline-item">
                        <div className="dot"></div>
                        <p>Нейросклад</p>
                    </Link>
                    <Link className="timeline-item">
                        <div className="dot"></div>
                        <p>Сознание</p>
                    </Link>
                    <Link className="timeline-item">
                        <div className="dot"></div>
                        <p>Док-Станция</p>
                    </Link>
                    <Link className="timeline-item">
                        <div className="dot"></div>
                        <p>TODO-JARVIS</p>
                    </Link>
                </div>
                </div>
            </div>
        </>
        
    )
}