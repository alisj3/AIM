import {Chart} from "../Charts/Chart"
import { useEffect, useState } from "react";
import './Analytics.css';
import { useTranslation } from 'react-i18next'

export function Analytics() {

    const {t, i18n} = useTranslation()
    const [data, setdata] = useState();

    useEffect(() => {
        const fetchDatas = async () => {
            const res = await fetch("https://api.coincap.io/v2/assets");
            const data = await res.json();
            setdata(data?.data);
        };
        fetchDatas();
    }, []);
    
    let total = 0;

    // Ensure `data` is an array before mapping
    if (Array.isArray(data)) {
      data.map((item) => {
        total += parseFloat(item.priceUsd);
      });
    }

    return (
        <>
            <div className="layout-center-content">
                <div className="income">
                    <p>{t("AnalyticsIncome")}</p>
                    <h3>${total.toFixed(2)}</h3>
                    <p>{t("AnalyticsThisMonth")}</p>
                    <Chart data={data}/>
                </div>
            </div>
        </>
    );
}
