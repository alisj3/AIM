import { Profile } from "../components/Profile/Profile";
import { MainLayout } from "../Layouts/MainLayout";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function ProfilePage() {
    const [userDetails, setUserDetails] = useState(() => {
        const storedUserDetails = localStorage.getItem('userDetails');
        return storedUserDetails ? JSON.parse(storedUserDetails) : null;
    });
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const fetchUserData = async (user) => {
        if (user) {
            const isGoogle = user.providerData.some(
                (provider) => provider.providerId === "google.com"
            );

            setIsGoogleUser(isGoogle);

            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUserDetails(userData);
                localStorage.setItem('userDetails', JSON.stringify(userData));
            }
        }
    };

    useEffect(() => {
        if (!userDetails) {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    setUserDetails(user);
                    fetchUserData(user);
                }
            });
        }
    }, [userDetails]);

    return (
        <MainLayout>
            <Profile
                country={userDetails.country}
                address={userDetails.address}
                birth={isGoogleUser ? userDetails.birth : userDetails.birth}
                phone={isGoogleUser ? userDetails.phone : userDetails.phone}
            />
        </MainLayout>
    );
}
