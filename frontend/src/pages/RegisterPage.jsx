import { Register } from "../components/Register/Register"
import { LoginLayout } from "../Layouts/LoginLayout"

export function RegisterPage(){
    return(
        <LoginLayout>
            <Register />
        </LoginLayout>
    )
}