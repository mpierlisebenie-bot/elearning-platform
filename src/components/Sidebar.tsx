import { useState } from "react";
import logo from "../assets/logo.png";
import iconProfil from "../assets/icons/profil.png";
import iconCours from "../assets/icons/mes-cours.png";
import iconProgression from "../assets/icons/progression.png";
import iconCertificats from "../assets/icons/certificats.png";
import iconParametres from "../assets/icons/parametres.png";
import iconDeconnexion from "../assets/icons/deconnexion.png";


type NavItem = {
  label: string;
  icon: string;
};

const mainNav: NavItem[] = [
  { label: "Profil", icon: iconProfil },
  { label: "Mes cours", icon: iconCours },
  { label: "Progression", icon: iconProgression },
];

const secondaryNav: NavItem[] = [
  { label: "Certificats", icon: iconCertificats },
  { label: "Paramètres", icon: iconParametres },
  { label: "Déconnexion", icon: iconDeconnexion },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [activeItem, setActiveItem] = useState("Profil");

    const NavButton = ({ item }: { item: NavItem }) => {
        const isActive = activeItem === item.label;
        return (
            <button
                onClick={() => {
                    setActiveItem(item.label);
                    if (window.innerWidth < 768) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full group
          ${isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
                <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-5 h-5 object-contain transition-transform group-hover:scale-110 ${isActive ? "brightness-100" : "opacity-70 grayscale group-hover:grayscale-0"}`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
            </button>
        );
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

            <aside className={`fixed top-0 left-0 h-full z-50 bg-white flex flex-col p-5 border-r border-slate-200 w-64 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:h-screen`}>

                {/* Logo Section */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <img src={logo} alt="L" className="w-5 h-5 brightness-200" />
                    </div>
                    <span className="font-black text-lg tracking-tight text-slate-900 uppercase">StudyLearn</span>
                </div>

                <div className="space-y-8">
                    <div>
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Menu Principal</p>
                        <nav className="space-y-1">
                            {mainNav.map((item) => <NavButton key={item.label} item={item} />)}
                        </nav>
                    </div>

                    <div>
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Préférences</p>
                        <nav className="space-y-1">
                            {secondaryNav.map((item) => <NavButton key={item.label} item={item} />)}
                        </nav>
                    </div>
                </div>

                {/* Upgrade Card (Petit plus pour le look) */}
                <div className="mt-auto p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl text-white">
                    <p className="text-xs font-bold opacity-80 mb-1">Passer en Pro</p>
                    <p className="text-[10px] opacity-60 mb-3">Accédez à tous les certificats.</p>
                    <button className="w-full py-2 bg-white text-indigo-600 text-[10px] font-black rounded-lg hover:bg-indigo-50 transition-colors">UPGRADE</button>
                </div>
            </aside>
        </>
    );
}