import "./FormBlock.css"

export function FormBlock(){
    return (
        <>
            <div className='intro-2'>
                <div className="intro-2-inner">
                    <h4 className="form-h3">Оставьте заявку</h4>
                        <form className="form-form">
                            <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="Введите ваш email"
                            required
                            />
                            <input
                            className="form-input"
                            type="text"
                            name="name"
                            placeholder="Введите ваше имя"
                            required/>
                            <textarea
                            className="form-area"
                            name="message"
                            placeholder="Введите сообщение"
                            required
                            />
                        <button
                        className="form-button"
                        type="submit"
                        >
                        Отправить
                        </button>
                    </form>
                </div>
                <hr />

                <div className="formblock-content">
                    <img src="/logo.png" alt="" />
                    <h4>Адреса и прочее</h4>
                </div>
            </div>
        </>
    )
}