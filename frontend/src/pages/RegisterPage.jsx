import { Register } from "../components/Register/register"
import { LoginLayout } from "../Layouts/LoginLayout"

export function RegisterPage(){
    return(
        <LoginLayout>
            <Register />
        </LoginLayout>
    )
}