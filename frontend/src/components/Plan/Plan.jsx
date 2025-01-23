import './Plan.css'
import { useTranslation } from 'react-i18next'

export function Plan({ SubscriptionTitle, SubscriptionPrice, SubscriptionPercs = [], anyStyle }) {
    
    const {t, i18n} = useTranslation()

    return (
        <div className={`plan ${anyStyle?.className || ""}`}>
            <div className="plan-info">
                {/* Title */}
                <h3>{SubscriptionTitle}</h3>

                {/* Price Section */}
                <span style={{ display: "flex", alignItems: "end" }}>
                    <span style={{ display: "flex" }}>
                        <span className="sup">$</span>
                        <span className="plan-price">{SubscriptionPrice}</span>
                    </span>
                    <span style={{ color: "#d8d8d8", paddingBottom: "10px" }}>/{t("PlanMonth")}</span>
                </span>

                {/* Divider */}
                <hr style={{ border: "1px solid #8a8a8a", marginTop: "10px", marginBottom: "10px" }} />

                {/* Description */}
                <p className="plan-instruction">
                    {t("PlanInstruction")}
                </p>

                {/* Features Section */}
                <h3 className="plan-spec">{t("PlanFeature")}</h3>
                <ul className="spec-list">
                    {SubscriptionPercs.length > 0 ? (
                        SubscriptionPercs.map((perc, index) => (
                            <li key={index}>{perc}</li>
                        ))
                    ) : (
                        <li>Нет доступных особенностей</li>
                    )}
                </ul>
            </div>

            {/* Button */}
            <button className="subscription-button">{t("PlanStart")}</button>
        </div>
    );
}
