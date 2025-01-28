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

            <div className='intro-3' id='offer' style={{ whiteSpace: "pre-wrap" }}>
                <h3>{t("TimelineTitle")}</h3>
                <div className="timeline-container">
                <div className="timeline">
                    <a href="#ecosystem" className="timeline-item">
                        <div className="dot"></div>
                        <p>{t("TimelineEcosystem")}</p>
                    </a>
                    <a href='#neurostorage' className="timeline-item">
                        <div className="dot"></div>
                        <p>{t("TimelineNeurostorage")}</p>
                    </a>
                    <a href='#conscious' className="timeline-item">
                        <div className="dot"></div>
                        <p>{t("TimelineConscious")}</p>
                    </a>
                    <a href='#jarvis' className="timeline-item">
                        <div className="dot"></div>
                        <p>{t("TimelineStation")}</p>
                    </a>
                    <a href='#jarvissolution' className="timeline-item">
                        <div className="dot"></div>
                        <p>TODO-JARVIS</p>
                    </a>
                </div>
                </div>
            </div>
        </>
        
    )
}