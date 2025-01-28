import { useTranslation } from 'react-i18next'
import './Solution.css'  // Import the CSS file

export function Solutions() {
    const {t, i18n} = useTranslation()

    return (
        <>
            <div className='intro-2 solutions-intro'>
                <div className='doc-img-text'>
                    <img src="/Doc.png" alt="" />
                    <h4>{t("DocStation")}</h4>
                </div>
                <hr />
                <div className='doc-text'>
                    <h3>{t("DocStationTitle")}</h3>
                    <h4>{t("DocStationPros")}</h4>
                    <p>{t("DocStationText")}</p>
                </div>
            </div>
        </>
    )
}
