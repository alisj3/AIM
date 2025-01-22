import { useTranslation } from 'react-i18next'

export function Solutions(){
    const {t, i18n} = useTranslation()

    return (

        <>
            <div className='intro-2'>
                <div style={{width: "50%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <img style={{width: "40%"}} src="/Doc.png" alt="" />
                    <h4 style={{paddingTop: "40px", paddingBottom: "40px", fontSize: "2.2em"}}>{t("DocStation")}</h4>
                </div>
                <hr />
                <div style={{width: "50%",  textAlign: "left", paddingLeft: "40px"}}>
                    <h3 style={{width: "100%",  textAlign: "left", fontSize: "2em"}}>{t("DocStationTitle")}</h3>
                    <h4 style={{paddingTop: "40px", paddingBottom: "40px", fontSize: "1.5em"}}>{t("DocStationPros")}</h4>
                    <p style={{fontSize: "1em", fontWeight: "600", width: "70%"}}>{t("DocStationText")}</p>
                </div>
            </div>
        </>
    )
}