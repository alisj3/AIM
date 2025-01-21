import "./Info.css"

export function Info({title, subtitle, text, image, imageText, infoTextStyles, text_allign, backGroundColor, textColor, specialTextColour, anyStyle}){
    return(
        <>
            <div style={{backgroundColor: `${backGroundColor}`, color: `${textColor}`}} className="info">
                <hr />
                <div className="info-text"  style={{...infoTextStyles}}>
                    <div style={{width: "50%"}}>
                        <h1 style={{textAlign: `${text_allign}`}}>{title}</h1>
                        <h2 style={{textAlign: `${text_allign}`, color: `${specialTextColour}`}}>{subtitle}</h2>
                        <p style={{paddingTop: "60px", fontWeight: "700"}}>{text}</p>
                    </div>

                    <div style={{width: "40%"}}>
                        <img className="info-image" style={{...anyStyle}} src={`/${image}.png`} alt="" />
                        <p className="image-text">{imageText}</p>
                    </div>
                    
                </div>
            </div>
        </>
    )
}