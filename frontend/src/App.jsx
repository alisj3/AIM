import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage";
import "./styles/global.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
