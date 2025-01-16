import './Profile.css'


export function Profile({birth, phone, address, country}){
    return(
        <div className="layout-center-content">
            <img className='profile-picture' src="/Picture.png" alt="" />
            <p className='aboutme'>Обо мне:</p>
            <div className="user-info">
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector.png" alt="" />
                        <p>День рождения:</p>
                    </div>
                    <p className='data'>{birth}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-1.png" alt="" />
                        <p>Номер Телефона:</p>
                    </div>
                    <p className='data'>{phone}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-2.png" alt="" />
                        <p>Адрес:</p>
                    </div>
                    <p className='data'>{address}</p>
                </div>
                <div className="info-block">
                    <div className='info-title'>
                        <img src="/icons/Vector-3.png" alt="" />
                        <p>Страна:</p>
                    </div>
                    <p className='data'>{country}</p>
                </div>
            </div>
        </div>
    )
}