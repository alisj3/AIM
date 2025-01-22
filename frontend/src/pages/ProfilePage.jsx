import { Profile } from "../components/Profile/Profile";
import { MainLayout } from "../Layouts/MainLayout";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export function ProfilePage() {
    const [userDetails, setUserDetails] = useState(null);  // Initial state is null
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [loading, setLoading] = useState(true);  // New loading state

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
        // Check if the user is logged in and fetch details
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                fetchUserData(user);
            } else {
                setLoading(false);  // If no user is logged in, stop loading
            }
        });

        return () => unsubscribe();  // Cleanup subscription on unmount
    }, []);

    return (
        <MainLayout>
            {userDetails && (
                <Profile
                    country={userDetails.country}
                    address={userDetails.address}
                    birth={isGoogleUser ? userDetails.birth : userDetails.birth}
                    phone={isGoogleUser ? userDetails.phone : userDetails.phone}
                />
            )}
        </MainLayout>
    );
}
