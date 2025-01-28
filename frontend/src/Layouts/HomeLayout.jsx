import './HomeLayout.css';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function HomeLayout() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header>
        <img className="home-logo" src="/logo.png" alt="" />

        <nav>
          <div className="burger-menu" onClick={toggleMenu}>
            <span className={menuOpen ? "burger-line open" : "burger-line"}></span>
            <span className={menuOpen ? "burger-line open" : "burger-line"}></span>
            <span className={menuOpen ? "burger-line open" : "burger-line"}></span>
          </div>

          <div className={`nav-inner ${menuOpen ? "menu-open" : ""}`}>
            <Link className='nav-link' to="/">{t("Home")}</Link>
            <Link className='nav-link' to="/">{t("AboutUs")}</Link>
            <Link className='nav-link' to="/neirostorage">{t("NeuroStorage")}</Link>
            <Link className='nav-link' to="/conscious">{t("Conscious")}</Link>
            <Link className='nav-link' to="/subscription">{t("Subscriptions")}</Link>

            <div className="header-social">
              <img src="/icons/phone.png" alt="" />
              <img src="/icons/Telegram.png" alt="" />
            </div>
          </div>

          <Link to="/profile">
            <img className='account-link' src="/icons/account.png" alt="" />
          </Link>
        </nav>
      </header>
    </>
  );
}
