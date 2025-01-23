import { MainLayout } from "../Layouts/MainLayout";
import { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Plan } from "../components/Plan/Plan";
import './PagesStyles/SubscriptionPage.css'
import { useTranslation } from 'react-i18next'

export function SubscriptionPage() {

    const {t, i18n} = useTranslation()

    const plans = [
        { SubscriptionTitle: t("PlanOne"), SubscriptionPrice: 20, SubscriptionPercs: [t("PlanOnePercsOne"), t("PlanTwoPercsOne"), t("PlanThreePercsOne")], className: "plan-basic" },
        { SubscriptionTitle: t("PlanTwo"), SubscriptionPrice: 50, SubscriptionPercs: [t("PlanTwoPercsOne"), t("PlanTwoPercsTwo"), t("PlanTwoPercsThree"), t("PlanTwoPercsFour"), t("PlanTwoPercsFive"), t("PlanTwoPercsSix")], className: "plan-pro" },
        { SubscriptionTitle: t("PlanThree"), SubscriptionPrice: 120, SubscriptionPercs: [t("PlanThreePercsOne"), t("PlanThreePercsTwo"), t("PlanThreePercsThree"), t("PlanThreePercsFour"), t("PlanThreePercsFive"), t("PlanThreePercsSix")], className: "plan-individual" },
    ];

    return (
        <MainLayout>
            <div className="subscription-plans">
                {plans.map((plan, idx) => (
                    <Plan
                        key={idx}
                        SubscriptionTitle={plan.SubscriptionTitle}
                        SubscriptionPrice={plan.SubscriptionPrice}
                        SubscriptionPercs={plan.SubscriptionPercs}
                        anyStyle={{ className: plan.className }}
                    />
                ))}
            </div>
        </MainLayout>
    );
}
