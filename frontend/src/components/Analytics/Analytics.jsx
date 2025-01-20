import {Chart} from "../Charts/Chart"
import { useEffect, useState } from "react";
import './Analytics.css';

export function Analytics() {

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
                    <p>Количество дохода</p>
                    <h3>${total.toFixed(2)}</h3>
                    <p>На этом месяце</p>
                    <Chart data={data}/>
                </div>
            </div>
        </>
    );
}
