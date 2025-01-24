import { useEffect } from "react";
import "./Contacts.css"

export function Contacts(){
    
    useEffect(() => {
        let map;

        DG.then(function () {
        map = DG.map('map', {
            center: [43.254459, 76.931429],
            zoom: 20
        });

        DG.marker([43.254265, 76.931571]).addTo(map).bindPopup('Вы кликнули по мне!');
        });
    })

    return(
        <div className="contacts-page">
            <h1>Свяжитесь с нами</h1>
            <p>Мы ценим каждого нашего клиента и с радостью готовы на контакт если вы хотите связаться с нами напишите нам!</p>
            
            <div className="contacts-main">
                <img src="/icons/fa-phone.png" alt="" className="contacts-icons" />
                <a href="">+7 708 545 4649</a>    
            </div>
            <div className="contacts-main">
                <img src="/icons/fa-envelope.png" alt="" className="contacts-icons" />
                <a href="">aimcompany2025@mail.ru</a>    
            </div>
            <hr />
            <h2>Мы в социальных сетях</h2>
            <div className="contacts-social-container">
                <div className="contacts-social">
                    <a href="#">
                        <img src="/icons/fa-envelope-1.png" alt="" />
                        <span>Facebook</span>
                    </a>
                    <a href="#">
                        <img src="/icons/fa-envelope-2.png" alt="" />
                        <span>Twitter</span>
                    </a>
                    <a href="#">
                        <img src="/icons/Instagram.png" alt="" />
                        <span>Facebook</span>
                    </a>    
                </div>

                <div className="contacts-social">
                    <a href="#">
                        <img src="/icons/Icon-1.png" alt="" />
                        <span>Telegram</span>
                    </a>
                    <a href="#">
                        <img src="/icons/Icon-1.png" alt="" />
                        <span>Telegram</span>
                    </a>
                    <a href="#">
                        <img src="/icons/Icon-1.png" alt="" />
                        <span>Telegram</span>
                    </a>    
                </div>
                
            </div>
            <hr />
            <h2>Найдите нас на карте</h2>
            <span style={{color: "#151439"}}>БЦ Ambassador, 6 этаж AIM-Company, Almaty</span>
            <div id="map" style={{marginTop: "40px", width:"100%", height:"230px"}}></div>
        </div>
    )
}