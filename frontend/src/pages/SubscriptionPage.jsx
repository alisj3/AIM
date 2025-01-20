import { MainLayout } from "../Layouts/MainLayout";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Plan } from "../components/Plan/Plan";
import './PagesStyles/SubscriptionPage.css'

const plans = [
    { SubscriptionTitle: "Базовый", SubscriptionPrice: 20, SubscriptionPercs: ["Доступ к 500 диалогам", "Создание ботов 5 шт", "Базовый доступ к сознанию"], className: "plan-basic" },
    { SubscriptionTitle: "Про", SubscriptionPrice: 50, SubscriptionPercs: ["Доступ к 1000 диалогам", "Создание ботов 10 шт", "Нет ограничения промпта для создания", "Аналитика", "Платная тех.поддержка", "Автоматические процессы"], className: "plan-pro" },
    { SubscriptionTitle: "Индивидуальный", SubscriptionPrice: 120, SubscriptionPercs: ["Неограниченные диалоги", "Неограниченные боты", "Нет ограничения промпта для создания", "Платная тех.поддержка", "Автоматические процессы", "Аналитика"], className: "plan-individual" },
];

export function SubscriptionPage() {

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
