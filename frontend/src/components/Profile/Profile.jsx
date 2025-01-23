import './Profile.css'
import { useTranslation } from 'react-i18next'

export function Profile({birth, phone, address, country}) {
    const {t, i18n} = useTranslation()

    return (
        <div className="layout-center-content">
            <img className='profile-picture' src="/Picture.png" alt="" />
            <p className='aboutme'>{t("ProfileAbout")}:</p>
            <div className="user-info">
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector.png" alt="" />
                        <p>{t("ProfileBirth")}:</p>
                    </div>
                    <p className='data'>{birth}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-1.png" alt="" />
                        <p>{t("ProfileNumber")}:</p>
                    </div>
                    <p className='data'>{phone}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-2.png" alt="" />
                        <p>{t("ProfileAddress")}:</p>
                    </div>
                    <p className='data'>{address}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-3.png" alt="" />
                        <p>{t("ProfileCountry")}:</p>
                    </div>
                    <p className='data'>{country}</p>
                </div>
            </div>
        </div>
    )
}
