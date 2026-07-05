import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout.tsx";
import Inscription from "./components/Inscription.tsx";
import './App.css'
import HomePage from "./components/HomePage.tsx";
import Catalogue from "./components/Catalogue.tsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";

function RequireAuth({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

function App() {
    return (
        <SettingsProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalogue" element={<Catalogue />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <RequireAuth>
                                <Layout />
                            </RequireAuth>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
            </AuthProvider>
        </SettingsProvider>
    );
}

export default App;



