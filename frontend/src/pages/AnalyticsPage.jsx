import { Analytics } from "../components/Analytics/Analytics"
import { MainLayout } from "../Layouts/MainLayout"
import {useEffect, useState} from "react"
import {auth, db} from "../firebase/firebase"
import { doc, getDoc} from "firebase/firestore"

export function AnalyticsPage(){
    const [userDetails, setUserDetails] = useState("")

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
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


    return(
        <MainLayout name={userDetails.name}>
            <Analytics />
        </MainLayout>
    )
}