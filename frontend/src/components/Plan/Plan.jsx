import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc  } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import {getAuth} from "firebase/auth"
import './Plan.css';
import { useTranslation } from 'react-i18next';

export function Plan({ SubscriptionTitle, SubscriptionPrice, SubscriptionPercs = [], anyStyle }) {
    const { t } = useTranslation();
    const [cardPopup, setCardPopup] = useState(false);
    const [cardExists, setCardExists] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [planIsUsed, setPlanIsUsed] = useState(false)
    const [subscriptionType, setSubscriptionType] = useState("")

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserId(user.uid);
        }
    }, []);

    useEffect(() => {
        if (cardPopup && userId) {
            checkCardExists();
        }
    }, [cardPopup, userId]);

    const checkCardExists = async () => {
        if (!userId) return;

        try {
            const cardCollectionRef = collection(db, `Users/${userId}/Card`);
            const cardSnap = await getDocs(cardCollectionRef);
            
            if (!cardSnap.empty) {
                const cardData = cardSnap.docs[0].data();
                console.log("Card Info:", cardData);
                setCardExists(true);
                setCardNumber(cardData.cardNumber);
            } else {
                console.log("No card found");
                setCardExists(false);
            }
        } catch (error) {
            console.error("Error fetching card info:", error);
        }
    };

    const addPlanType = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
      
        const currentDate = new Date();
        const oneMonthLater = new Date(currentDate);
        oneMonthLater.setMonth(currentDate.getMonth() + 1);

      
        try {
          // Check if the user already has an active subscription
          const userSubscriptionCollection = collection(db, `Users/${user.uid}/Subscription`);
          const subscriptionSnap = await getDocs(userSubscriptionCollection);
          const activeSubscription = subscriptionSnap.docs.find(doc => doc.data().isActive);
      
          if (activeSubscription) {
            setPlanIsUsed(true) // Show an error message if there is already an active subscription
            return;
          }
      
          // Add the new subscription
          await addDoc(userSubscriptionCollection, {
            createdAt: currentDate,
            expirationDate: oneMonthLater,
            type: subscriptionType,
            isActive: true,  // Set the new subscription as active
          });
        } catch (e) {
          console.error("Error adding card info: ", e);
        }
    };

    const handlePlanChoose = () => {
        setCardPopup(true);
        if (["Про", "Pro", "Про"].includes(SubscriptionTitle)) {
            setSubscriptionType("Pro");
        } 
        
        if (["Basic", "Базовый", "Негізгі"].includes(SubscriptionTitle)) {
            setSubscriptionType("Base");
        } 

        if (["Individual", "Индивидуальный", "Жеке"].includes(SubscriptionTitle)) {
            setSubscriptionType("Individual");
        } 
    };

    return (
        <>
            <div className={`plan ${anyStyle?.className || ""}`}>
                <div className="plan-info">
                    <h3>{SubscriptionTitle}</h3>
                    <span style={{ display: "flex", alignItems: "end" }}>
                        <span style={{ display: "flex" }}>
                            <span className="sup">$</span>
                            <span className="plan-price">{SubscriptionPrice}</span>
                        </span>
                        <span style={{ color: "#d8d8d8", paddingBottom: "10px" }}>/ {t("PlanMonth")}</span>
                    </span>
                    <hr style={{ border: "1px solid #8a8a8a", marginTop: "10px", marginBottom: "10px" }} />
                    <p className="plan-instruction">{t("PlanInstruction")}</p>
                    <h3 className="plan-spec">{t("PlanFeature")}</h3>
                    <ul className="spec-list">
                        {SubscriptionPercs.length > 0 ? (
                            SubscriptionPercs.map((perc, index) => <li key={index}>{perc}</li>)
                        ) : (
                            <li>No available features</li>
                        )}
                    </ul>
                </div>
                <button onClick={() => handlePlanChoose()} className="subscription-button">{t("PlanStart")}</button>
            </div>

            {cardPopup && (
                <div className="cardinfo">
                    {cardExists === false ? (
                        <p>Loading...</p>
                    ) : cardExists ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" onClick={() => setCardPopup(false)}>
                                <path d="M18 6L6 18M6 6l12 12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {
                                planIsUsed ? (<p className='plan-in-used'>You already have an active plan</p>) : null
                            }
                            <h3>{t("YourCard")}</h3>
                            <input
                                type="text"
                                value={cardNumber}
                                readOnly
                                className="card-input"
                            />
                            <button onClick={() => {addPlanType()}} className="continue-button">Continue</button>
                        </>
                    ) : (
                        useEffect(() => navigate("/preferences"), [])
                    )}
                </div>
            )}
        </>
    );
}