import { Preferences } from '../components/Preferences/Preferences'
import {MainLayout} from '../Layouts/MainLayout'
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function PreferencesPage(){
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async (user) => {
        if (user) {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUserDetails(userData);
                localStorage.setItem('userDetails', JSON.stringify(userData));
            }
        }
    }

    useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    fetchUserData(user);
                } else {
                    setLoading(false);
                }
            });
    
            return () => unsubscribe();
        }, []);

    return(
        <MainLayout>
            <Preferences phone={userDetails.phone}  email={userDetails.email}/>
        </MainLayout>
    )
}