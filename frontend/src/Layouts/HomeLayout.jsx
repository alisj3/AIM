import './HomeLayout.css'
import { Link }from "react-router-dom"
import { useTranslation } from 'react-i18next'

export function HomeLayout(){

    const {t, i18n} = useTranslation()
    
    const changeLanguage = (language) => {
        i18n.changeLanguage(language)
    }

    return (
        <>
            <header>
                <img className="home-logo" src="/logo.png" alt="" />

                <nav>
                    <div className="nav-inner">
                        <Link className='nav-link' to="/">ГЛАВНАЯ</Link>
                        <Link className='nav-link' to="/">О НАС</Link>
                        <Link className='nav-link' to="/neirostorage">НЕЙРОСКЛАД</Link>
                        <Link className='nav-link' to="/">СОЗНАНИЕ</Link>
                        <Link className='nav-link' to="/subscription">ПОДПИСКИ</Link>

                        <div className="header-social">
                            <img src="/icons/phone.png" alt="" />
                            <img src="/icons/Telegram.png" alt="" />
                            <button onClick={() => changeLanguage("en")}>EN</button>
                            <button onClick={() => changeLanguage("ru")}>RU</button>
                        </div>
                    </div>
                    
                    <Link to="/profile"><img className='account-link' src="/icons/account.png" alt="" /></Link>
                </nav>
            </header>
        </>
    )
}