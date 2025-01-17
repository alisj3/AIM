import './HomeLayout.css'
import { Link }from "react-router-dom"

export function HomeLayout(){

    return (
        <>
            <header>
                <img className="home-logo" src="/logo.png" alt="" />

                <nav>
                    <div className="nav-inner">
                        <a className='nav-link' href="">ГЛАВНАЯ</a>
                        <a className='nav-link' href="">О НАС</a>
                        <a className='nav-link' href="">НЕЙРОСКЛАД</a>
                        <a className='nav-link' href="">СОЗНАНИЕ</a>
                        <a className='nav-link' href="">ПОДПИСКИ</a>

                        <div className="social">
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