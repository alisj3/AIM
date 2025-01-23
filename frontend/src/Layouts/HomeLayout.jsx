import './HomeLayout.css'
import { Link }from "react-router-dom"
import { useTranslation } from 'react-i18next'

export function HomeLayout(){

    const {t, i18n} = useTranslation()

    return (
        <>
            <header>
                <img className="home-logo" src="/logo.png" alt="" />

                <nav>
                    <div className="nav-inner">
                        <Link className='nav-link' to="/">{t("Home")}</Link>
                        <Link className='nav-link' to="/">{t("AboutUs")}</Link>
                        <Link className='nav-link' to="/neirostorage">{t("NeuroStorage")}</Link>
                        <Link className='nav-link' to="/">{t("Conscious")}</Link>
                        <Link className='nav-link' to="/subscription">{t("Subscriptions")}</Link>

                        <div className="header-social">
                            <img src="/icons/phone.png" alt="" />
                            <img src="/icons/Telegram.png" alt="" />
                        </div>
                    </div>
                    
                    <Link to="/profile"><img className='account-link' src="/icons/account.png" alt="" /></Link>
                </nav>
            </header>
        </>
    )
}