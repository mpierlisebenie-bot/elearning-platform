import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Gestion from "./admin/Gestion";
import { useSettings } from "../contexts/SettingsContext";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const settings = useSettings();

    return (
        <div
            className={`flex min-h-screen font-['Sora'] transition-colors ${
                settings.darkMode ? "bg-[#070d1c] text-slate-100" : "bg-[#fafaf7] text-slate-900"
            }`}
        >
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Header onMenuToggle={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Routes>
                            <Route path="" element={<Navigate to="profil" replace />} />
                            <Route path="profil" element={<Dashboard currentPage="profil" />} />
                            <Route path="mes-cours" element={<Dashboard currentPage="mes-cours" />} />
                            <Route path="progression" element={<Dashboard currentPage="progression" />} />
                            <Route path="certificats" element={<Dashboard currentPage="certificats" />} />
                            <Route path="parametres" element={<Dashboard currentPage="parametres" />} />
                            <Route path="gestion" element={<Gestion />} />
                            <Route path="*" element={<Navigate to="profil" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Layout;
