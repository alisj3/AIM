import './MainLayout.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import { useNotifications } from "../components/Notification/NotificationContext";

export function MainLayout({ children }) {
    const { t } = useTranslation();
    const { showNotification } = useNotifications();
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
    const [showNotificationWindow, setShowNotificationWindow] = useState(false)
    const [notifications, setNotifications] = useState([]);

    const currentPath = window.location.pathname;
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userDetails');
            localStorage.removeItem('categories');
            localStorage.setItem('loginNotificationShown', 'false');
            window.location.href = "/login";
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const handleCenterClick = () => {
        if (isLeftSidebarVisible) {
            setIsLeftSidebarVisible(false);
        }
        if (isRightSidebarVisible) {
            setIsRightSidebarVisible(false);
        }
    };

    const fetchUserName = async () => {
        if (!userName) { 
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    try {
                        const docRef = doc(db, 'Users', user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const fetchedName = docSnap.data().name;
                            setUserName(fetchedName);
                            localStorage.setItem('userName', fetchedName);
                        } else {
                            console.error('No user document found');
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }
            });
        }
    };

    const showNotificationWondow = () => {
        setShowNotificationWindow(prevState => !prevState)
    }

    const notify = (message, type) => {
        toast(message, { type });
        setNotifications(prev => [...prev, { message, type }]);
    };

    useEffect(() => {
        fetchUserName();
        if (localStorage.getItem('loginNotificationShown') !== 'true') {
            notify("You are logged in!", "success");
            localStorage.setItem('loginNotificationShown', 'true');
        }

        notify("hello", "success")
    }, []);
    

    return (
        <>
            <div className="layout-main">
                {/* Left Sidebar */}
                <div className={`layout-left ${isLeftSidebarVisible ? 'visible' : 'hidden'}`}>
                    <Link to="/"><img className="layout-logo" src="/logo.png" alt="" /></Link>
                    <div className="nav">
                        <Link to="/profile" className={`link ${currentPath === '/profile' ? 'active' : ''}`}>
                            <img src="/icons/wallet.png" alt="" />
                            {t("Profile")}
                        </Link>
                        <Link to="/conscious" className={`link ${currentPath === '/conscious' ? 'active' : ''}`}>
                            <img src="/icons/box.png" alt="" />
                            {t("MainConscuois")}
                        </Link>
                        <Link to="/analytics" className={`link ${currentPath === '/analytics' ? 'active' : ''}`}>
                            <img src="/icons/analytics.png" alt="" />
                            {t("MainAnalytics")}
                        </Link>
                        <Link to="/neirostorage" className={`link ${currentPath === '/neirostorage' ? 'active' : ''}`}>
                            <img src="/icons/calendar.png" alt="" />
                            {t("MainNeurostorage")}
                        </Link>
                        <Link to="/subscription" className={`link ${currentPath === '/subscription' ? 'active' : ''}`}>
                            <img src="/icons/money.png" alt="" />
                            {t("MainSubscrition")}
                        </Link>
                        <Link to="/integrations" className={`link ${currentPath === '/integrations' ? 'active' : ''}`}>
                            <img src="/icons/list.png" alt="" />
                             {t("MainIntegration")}
                        </Link>

                    </div>
                    <hr className="layout-line" />
                    <div className="nav">
                        <Link to="/support" className={`link ${currentPath === '/support' ? 'active' : ''}`}>
                            <img src="/icons/info.png" alt="" />
                            {t("MainHelp")}
                        </Link>
                        <Link to="/contacts" className={`link ${currentPath === '/contacts' ? 'active' : ''}`}>
                            <img src="/icons/chat.png" alt="" />
                            {t("MainContacts")}
                        </Link>
                        <Link to="/preferences" className={`link ${currentPath === '/preferences' ? 'active' : ''}`}>
                            <img src="/icons/preferences.png" alt="" />
                            {t("MainPreferences")}
                        </Link>
                        <a onClick={handleLogout} href="" className="link">
                            <img src="/icons/exit.png" alt="" />
                            {t("MainExit")}
                        </a>
                    
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="layout-center" onClick={handleCenterClick}>
                    <div className="layout-center-top">
                        <button 
                            className="sidebar-toggle left" 
                            onClick={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
                        >
                            &#9776;
                        </button>
                        <div className="search-bar">
                            <img src="/icons/search.png" className="search-icon" />
                            <input type="text" className="search-input" placeholder="Поиск" />
                        </div>
                        <button 
                            className="sidebar-toggle right" 
                            onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
                        >
                            <img src="/icons/account.png" alt="" />
                        </button>
                    </div>
                    <div className="layout-content">
                        {children}    
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className={`layout-right ${isRightSidebarVisible ? 'visible' : 'hidden'}`}>
                    <div className="layout-icons">
                        <div className="notification-block">
                            <img className='layout-notifications-icon' onClick={showNotificationWondow} src="/icons/notification-bing.png" alt="" />
                            <p className='notification-counter'>{notifications.length}</p>
                        </div>
                        <div className="layout-right-account">
                            <img src="/icons/account.png"alt="" />
                            <h3>{userName}</h3>
                        </div>
                    </div>
                    
                    <div className="layout-right-toast">
                        <div className="layout-right-toast">
                                
                        {showNotificationWindow && notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className="toast-notification">
                                    {showNotification(notification.message, notification.type)}
                                </div>
                            ))
                        ) : toast.dismiss()}
                        
                            <ToastContainer toastClassName="toast" />    
                        </div>
                    </div>

                    
                </div>
            </div>
        </>
    );
}
