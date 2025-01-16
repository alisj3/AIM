import { Profile } from "../components/Profile/Profile";
import { MainLayout } from "../Layouts/MainLayout";
import {useEffect, useState} from "react"
import {auth, db} from "../firebase/firebase"
import { doc, getDoc} from "firebase/firestore"

export function ProfilePage(){
    const [userDetails, setUserDetails] = useState("")
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            setUserDetails(user)

            console.log(user)
            const isGoogle = user.providerData.some(
                (provider) => provider.providerId === "google.com"
            );

            setIsGoogleUser(isGoogle);

            const docRef = doc(db, "Users", user.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setUserDetails(docSnap.data())
            }
        })
    }
    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <>
            <MainLayout name={userDetails.name}>
                <Profile country = {userDetails.country} address = {userDetails.address} birth={isGoogleUser ? userDetails.email : userDetails.birth} phone={isGoogleUser ? "unknown" : userDetails.phone}/>
            </MainLayout>
        </>
    )
}