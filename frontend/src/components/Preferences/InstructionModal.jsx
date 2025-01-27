import { useState } from "react"

export function InstructionModal({ instrucionTitle, instructionDescription}){
    
    const [infoModal, setInfoModal] = useState(false)

    const InfoModalEnter = () =>{
    setInfoModal(true)
    }

    const InfoModalOver = () =>{
    setInfoModal(false)
    }

    return(
        <div className="preferences-instruction">
            <h3>{instrucionTitle}</h3>
            <img onMouseEnter={InfoModalEnter} onMouseOut={InfoModalOver} src="/icons/question.png" alt="" />

            {infoModal ? 
                (<>
                    <p className="infoModalStyles">{instructionDescription}</p>
                </>) 
                : 
                (<></>)
            }
        </div>
    )
}