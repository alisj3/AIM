export function FormBlock(){
    return (
        <>
            <div className='intro-2'>
                <div>
                    <h4 style={{paddingTop: "40px", paddingBottom: "40px", fontSize: "2.2em"}}>Оставьте заявку</h4>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                type="email"
                name="email"
                placeholder="Введите ваш email"
                required
                style={{
                    padding: '10px',
                    fontSize: '1em',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
                />
                <input
                type="text"
                name="name"
                placeholder="Введите ваше имя"
                required
                style={{
                    padding: '10px',
                    fontSize: '1em',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                }}
                />
                <textarea
                name="message"
                placeholder="Введите сообщение"
                required
                style={{
                    padding: '10px',
                    fontSize: '1em',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    minHeight: '100px',
                    resize: 'none',
                }}
                />
                <button
                type="submit"
                style={{
                    padding: '10px 20px',
                    fontSize: '1em',
                    backgroundColor: '#010101',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                >
                Отправить
                </button>
            </form>
                </div>
                <hr />
                <div style={{width: "30%",  textAlign: "left"}}>
                    <img style={{width: "50%"}} src="/logo.png" alt="" />
                    <h4 style={{paddingTop: "40px", paddingBottom: "40px", fontSize: "2.2em"}}>Адреса и прочее</h4>
                </div>
            </div>
        </>
    )
}