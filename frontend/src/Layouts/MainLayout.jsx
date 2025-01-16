import './MainLayout.css'
import { Link } from 'react-router-dom';

export function MainLayout({name, children}){
    const currentPath = window.location.pathname;

    return (
        <>
            <div className="layout-main">
                <div className="layout-left">
                    <img className='layout-logo' src="/logo.png" alt="" />

                    <div className="nav">
                        <Link to="/profile" className={`link ${currentPath === '/profile' ? 'active' : ''}`}><img src="/icons/wallet.png" alt="" />Профиль</Link>
                        <a href="" className="link"><img src="/icons/box.png" alt="" />Сознание</a>
                        <Link to="/analytics" className={`link ${currentPath === '/analytics' ? 'active' : ''}`}><img src="/icons/analytics.png" alt="" />Аналитика</Link>
                        <a href="" className="link"><img src="/icons/calendar.png" alt="" />Нейросклад</a>
                        <a href="" className="link"><img src="/icons/money.png" alt="" />Подписки</a>
                        <a href="" className="link"><img src="/icons/list.png" alt="" />Интергации</a>
                    </div>
                    <hr className='layout-line' />
                    <div className="nav">
                        <a href="" className="link"><img src="/icons/info.png" alt="" />Поддержка</a>
                        <a href="" className="link"><img src="/icons/chat.png" alt="" />Контакты</a>
                        <a href="" className="link"><img src="/icons/preferences.png" alt="" />Настройки</a>
                        <a href="" className="link"><img src="/icons/exit.png" alt="" />Выйти</a>
                    </div>
                </div>

                <div className="layout-center">
                    <div className="layout-center-top">
                        <h1>Здравствуйте, {name}</h1>
                        <div className="search-bar">
                            <img src="/icons/search.png" className="search-icon" />
                            <input type="text" className="search-input" placeholder="Поиск" />
                        </div>
                    </div>
                        
                    {children}
                </div>

                <div className="layout-right">
                    <div className="layout-icons">
                        <a href="" className='layout-icon'><img src="/icons/message.png" alt="" /></a>
                        <a href="" className='layout-icon'><img src="/icons/notifications.png" alt="" /></a>
                        <a href="" className='layout-icon'><img src="/icons/account.png" alt="" /></a>    
                    </div>
                    
                </div>
            </div>
        </>
    )
}