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

import "./18n"
import { Suspense } from "react";
import { PreferencesPage } from "./pages/PreferencesPage";
import { ConsciousPage } from "./pages/ConsciousPage";
import { SupportPage } from "./pages/SupportPage";
import { ContactsPage } from "./pages/ContactsPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";


function App() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={/*user ? <Navigate to="/profile" /> : */<HomePage />} />
          <Route path="/login" element={/*user ? <Navigate to="/profile" /> : */<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/neirostorage" element={<NeiroStoragePage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/conscious" element={<ConsciousPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>      
    </>
  )
}

export default App
