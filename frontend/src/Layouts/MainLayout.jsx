import './MainLayout.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";

export function MainLayout({ children }) {
    const { t, i18n } = useTranslation();
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userDetails');
            localStorage.removeItem('categories')
            window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };


    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const currentPath = window.location.pathname;

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

    useEffect(() => {
        fetchUserName();
    }, []);

    return (
        <>
            <div className="layout-main">
                <div className="layout-left">
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
                        <a href="" className="link">
                            <img src="/icons/list.png" alt="" />
                            {t("MainIntegration")}
                        </a>
                    </div>
                    <hr className="layout-line" />
                    <div className="nav">
                        <a href="" className="link">
                            <img src="/icons/info.png" alt="" />
                            {t("MainHelp")}
                        </a>
                        <a href="" className="link">
                            <img src="/icons/chat.png" alt="" />
                            {t("MainContacts")}
                        </a>
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

                <div className="layout-center">
                    <div className="layout-center-top">
                        <h1>{t("text")}, {userName || 'Гость'}</h1>
                        <div className="search-bar">
                            <img src="/icons/search.png" className="search-icon" />
                            <input type="text" className="search-input" placeholder="Поиск" />
                        </div>
                    </div>
                    {children}
                </div>

                <div className="layout-right">
                    <div className="layout-icons">
                        <a href="" className="layout-icon">
                            <img src="/icons/message.png" alt="" />
                        </a>
                        <a href="" className="layout-icon">
                            <img src="/icons/notifications.png" alt="" />
                        </a>
                        <a href="" className="layout-icon">
                            <img src="/icons/account.png" alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
