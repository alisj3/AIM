import "./LoginLayout.css"

export function LoginLayout({children}){
    return(
        <>
            <div className="main">
                <img className="logo" src="/login-logo.png" alt="" />

                <div className="form-box">
                    {children}
                </div>
            </div>
        </>
    )
}