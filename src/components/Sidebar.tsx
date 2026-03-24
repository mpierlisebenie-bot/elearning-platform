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
          // Ferme le sidebar sur mobile après sélection
          if (window.innerWidth < 768) onClose();
        }}
        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left
          ${isActive ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
      >
        <span className="text-gray-400 text-xs">›</span>
        <img src={item.icon} alt={item.label} style={{ width: 24, height: 24 }} className="object-contain flex-shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          fontFamily: "'Inter', sans-serif",
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease",
          width: 212,
        }}
        className={`
          fixed top-0 left-0 h-full z-30 bg-white flex flex-col p-4
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-screen md:flex md:flex-col
        `}
      >
        {/* Logo + StudyLearn */}
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <img src={logo} alt="StudyLearn" style={{ width: 30, height: 31, objectFit: "contain" }} />
          <span
            style={{
              width: 76,
              height: 20,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "20px",
              borderRadius: 12,
              color: "#000000",
              whiteSpace: "nowrap",
            }}
          >
            StudyLearn
          </span>
        </div>

        {/* Section principale */}
        <div style={{ marginBottom: 8, marginTop: 24 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: 0,
              color: "rgba(0,0,0,0.4)",
              marginBottom: 8,
            }}
          >
            Tableau de bord
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mainNav.map((item) => (
              <NavButton key={item.label} item={item} />
            ))}
          </nav>
        </div>

        {/* Séparateur */}
        <div style={{ height: "0.5px", backgroundColor: "rgba(0,0,0,0.1)", margin: "24px 0" }} />

        {/* Section secondaire */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {secondaryNav.map((item) => (
            <NavButton key={item.label} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
}