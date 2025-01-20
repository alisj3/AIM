import { LoginPage } from "./pages/LoginPage"
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import "./styles/global.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useEffect, useState } from "react"
import { auth } from "./firebase/firebase"
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { HomePage } from "./pages/HomePage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { NeiroStoragePage } from "./pages/NeiroStoragePage";

function App() {
  // const [user, setUser] = useState()
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     setUser(user)
  //   })
  // })
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={/*user ? <Navigate to="/profile" /> : */<HomePage />} />
          <Route path="/login" element={/*user ? <Navigate to="/profile" /> : */<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/neirostorage" element={<NeiroStoragePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
