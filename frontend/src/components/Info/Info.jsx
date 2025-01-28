import "./Info.css"
import CanvasNeuron from "../canvas/CanvasNeuron"

export function Info({title, subtitle, infoId, text, image, imageText, infoTextStyles, text_allign, backGroundColor, textColor, specialTextColour, anyStyle}){

    return(
        <>
            <div id={infoId} style={{backgroundColor: `${backGroundColor}`, color: `${textColor}`}} className="info">
                <hr />
                <div className="info-text"  style={{...infoTextStyles}}>
                    <div className="info-text-content">
                        <h1 style={{textAlign: `${text_allign}`}}>{title}</h1>
                        <h2 style={{textAlign: `${text_allign}`, color: `${specialTextColour}`}}>{subtitle}</h2>
                        <p style={{paddingTop: "60px", fontWeight: "700", whiteSpace: "pre-wrap"}}>{text}</p>
                    </div>

                    <div className="info-text-content">
                        <img className="info-image" style={{...anyStyle}} src={`/${image}.png`} alt="" />
                        <p className="image-text">{imageText}</p>
                    </div>
                    
                </div>
            </div>
        </>
    )
}