import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout.tsx";
import Inscription from "./components/Inscription.tsx";

import HomePage from "./components/HomePage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/dashboard" element={<Layout />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>


    );
}

export default App;



