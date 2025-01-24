import { Profile } from "../components/Profile/Profile";
import { MainLayout } from "../Layouts/MainLayout";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function ProfilePage() {
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async (user) => {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserDetails(userData);
            localStorage.setItem('userDetails', JSON.stringify(userData));
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData(user);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <MainLayout>
            {userDetails && (
                <Profile
                    country={userDetails.country}
                    address={userDetails.address}
                    birth={userDetails.birth}
                    phone={userDetails.phone}
                />
            )}
        </MainLayout>
    );
}
