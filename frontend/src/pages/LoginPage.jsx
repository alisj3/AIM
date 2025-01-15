import { Login } from "../components/Login/Login"
import { LoginLayout } from "../Layouts/LoginLayout"

export function LoginPage(){
    return(
        <LoginLayout>
            <Login />
        </LoginLayout>
    )
}