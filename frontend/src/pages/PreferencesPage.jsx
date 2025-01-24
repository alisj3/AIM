import { Preferences } from '../components/Preferences/Preferences';
import { MainLayout } from '../Layouts/MainLayout';
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export function PreferencesPage() {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Check if userDetails exist in localStorage
        const storedUserDetails = localStorage.getItem("userDetails");

        if (storedUserDetails) {
            // Use the data from localStorage if available
            setUserDetails(JSON.parse(storedUserDetails));
        } else {
            // Fetch user data from auth and handle the case where localStorage is empty
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    // No need to fetch from Firestore here, we assume no data is cached
                    console.log("No localStorage data found, but user is logged in.");
                }
            });

            return () => unsubscribe();
        }
    }, []);

    return (
        <MainLayout>
            {userDetails ? (
                <Preferences phone={userDetails.phone} email={userDetails.email} />
            ) : (
                <div>Loading...</div>
            )}
        </MainLayout>
    );
}
