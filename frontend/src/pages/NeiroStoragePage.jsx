import { Neirostorage } from "../components/Neirostorage/Neirostorage";
import { MainLayout } from "../Layouts/MainLayout";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { Services } from "../components/Neirostorage/Services";
import { useState, useEffect } from "react"

export function NeiroStoragePage(){
    const [userService, setUserService] = useState('');

    const fetchUserService = async (user) => {
        try {
          const userDocRef = doc(db, `Users/${user.uid}`);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const service = docSnap.data().service;
            setUserService(service);  // Set the user's service
          } else {
            console.log('No such user found!');
          }
        } catch (error) {
          console.error('Error fetching user service:', error);
        }
      };
    
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user) {
            fetchUserService(user);  // Fetch the service when user is authenticated
          }
        });
        return () => unsubscribe();
      }, []);

    return (
        <MainLayout>
            {userService === 'Product' ? (
                <Neirostorage />
            ) : (
                <Services /> 
            )}
        </MainLayout>
    )    
}