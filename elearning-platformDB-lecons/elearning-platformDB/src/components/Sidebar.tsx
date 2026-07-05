import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSettings, translationStrings } from "../contexts/SettingsContext";
import logo from "../assets/logo.png";
import iconProfil from "../assets/icons/profil.png";
import iconCours from "../assets/icons/mes-cours.png";
import iconProgression from "../assets/icons/progression.png";
import iconCertificats from "../assets/icons/certificats.png";
import iconParametres from "../assets/icons/parametres.png";
import iconDeconnexion from "../assets/icons/deconnexion.png";
import iconPanneau from "../assets/icons/panneau.png";

type NavItem = {
  label: string;
  icon: string;
  path?: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [showPro, setShowPro] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const settings = useSettings();
    const strings = translationStrings[settings.language];
    const dark = settings.darkMode;

    const mainNav: NavItem[] = [
      { label: strings.menu.profil, icon: iconProfil, path: "/dashboard/profil" },
      { label: strings.menu.mesCours, icon: iconCours, path: "/dashboard/mes-cours" },
      { label: strings.menu.progression, icon: iconProgression, path: "/dashboard/progression" },
    ];

    const secondaryNav: NavItem[] = [
      { label: strings.menu.certificats, icon: iconCertificats, path: "/dashboard/certificats" },
      { label: strings.menu.parametres, icon: iconParametres, path: "/dashboard/parametres" },
      { label: strings.menu.deconnexion, icon: iconDeconnexion },
    ];

    // Section Administration : visible uniquement pour admin / instructeur.
    const canManage = auth.user?.role === "admin" || auth.user?.role === "instructor";
    const adminNav: NavItem[] = [
      { label: strings.menu.gestion, icon: iconPanneau, path: "/dashboard/gestion" },
    ];

    const SectionLabel = ({ children }: { children: React.ReactNode }) => (
        <p className={`px-3 text-[10px] font-bold uppercase tracking-[0.22em] mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {children}
        </p>
    );

    const NavButton = ({ item }: { item: NavItem }) => {
        const isActive = item.path ? location.pathname === item.path : false;
        return (
            <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                    if (item.label === strings.menu.deconnexion) {
                        auth.signOut();
                        navigate("/login");
                        return;
                    }
                    if (item.path) {
                        navigate(item.path);
                    }
                    if (window.innerWidth < 768) onClose();
                }}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors duration-200 w-full group
          ${isActive
                    ? dark
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "bg-indigo-50/80 text-indigo-700"
                    : dark
                        ? "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                        : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900"}`}
            >
                {/* Barre d'onglet actif */}
                <span
                    className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full transition-opacity ${
                        isActive ? "opacity-100 bg-indigo-500" : "opacity-0"
                    }`}
                />
                <img
                    src={item.icon}
                    alt=""
                    aria-hidden
                    className={`w-[18px] h-[18px] object-contain transition-opacity ${
                        isActive ? "opacity-100" : "opacity-55 group-hover:opacity-90"
                    } ${dark ? "invert brightness-150" : ""}`}
                />
                <span className="truncate">{item.label}</span>
            </button>
        );
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

            <aside
                className={`fixed top-0 left-0 h-full z-50 flex flex-col px-4 py-6 border-r w-[264px] transition-transform duration-300 ease-in-out
          ${dark ? "bg-[#0b1120] border-slate-800" : "bg-white border-slate-200/70"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:h-screen`}
            >
                {/* Marque */}
                <div className="flex items-center gap-3 px-2 mb-9">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                        <img src={logo} alt="StudyLearn" className="w-5 h-5 brightness-200" />
                    </div>
                    <div className="leading-none">
                        <span className={`font-display text-[17px] font-semibold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                            StudyLearn
                        </span>
                        <p className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                            e-learning
                        </p>
                    </div>
                </div>

                <div className="space-y-7 overflow-y-auto custom-scrollbar pr-1">
                    <div>
                        <SectionLabel>Menu principal</SectionLabel>
                        <nav className="space-y-0.5">
                            {mainNav.map((item) => <NavButton key={item.label} item={item} />)}
                        </nav>
                    </div>

                    {canManage && (
                        <div>
                            <SectionLabel>{strings.menu.administration}</SectionLabel>
                            <nav className="space-y-0.5">
                                {adminNav.map((item) => <NavButton key={item.label} item={item} />)}
                            </nav>
                        </div>
                    )}

                    <div>
                        <SectionLabel>Préférences</SectionLabel>
                        <nav className="space-y-0.5">
                            {secondaryNav.map((item) => <NavButton key={item.label} item={item} />)}
                        </nav>
                    </div>
                </div>

                {/* Carte Pro — sobre, indigo profond + filet or */}
                <div className="mt-auto relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#4338ca] text-white">
                    <span className="absolute inset-x-5 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-[#c9a24b] to-transparent" />
                    <p className="font-display text-[15px] font-semibold leading-snug">Passer en Pro</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-indigo-200/80">
                        Certificats illimités et parcours avancés.
                    </p>
                    <button
                        onClick={() => setShowPro(true)}
                        className="mt-4 w-full py-2 rounded-lg bg-white/95 text-indigo-800 text-[11px] font-bold tracking-wide hover:bg-white transition-colors"
                    >
                        Découvrir l'offre
                    </button>
                </div>
            </aside>

            {/* Fenêtre Offre Pro */}
            {showPro && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm"
                    onClick={() => setShowPro(false)}
                >
                    <div
                        className={`w-full max-w-md rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
                        onClick={(ev) => ev.stopPropagation()}
                    >
                        <div className="relative px-7 pt-6 pb-5 bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#4f46e5] text-white">
                            <span className="absolute inset-x-7 bottom-0 h-[2px] rounded-t-full bg-gradient-to-r from-[#c9a24b]/90 to-transparent" />
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-indigo-200/80 mb-1.5">StudyLearn Pro</p>
                                    <h3 className="font-display text-[22px] font-semibold leading-tight">Allez plus loin</h3>
                                </div>
                                <button onClick={() => setShowPro(false)} aria-label="Fermer" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80">✕</button>
                            </div>
                        </div>
                        <div className="px-7 py-6">
                            <ul className="space-y-3">
                                {[
                                    "Certificats illimités et vérifiables",
                                    "Parcours avancés avec projets guidés",
                                    "Accès prioritaire aux nouveaux cours",
                                    "Support des instructeurs sous 24 h",
                                ].map((f) => (
                                    <li key={f} className={`flex items-center gap-3 text-[13px] font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <p className={`mt-5 text-[11px] leading-relaxed ${dark ? "text-slate-500" : "text-slate-400"}`}>
                                L'offre Pro sera disponible prochainement. StudyLearn est actuellement en version académique gratuite.
                            </p>
                            <button
                                onClick={() => setShowPro(false)}
                                className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Compris
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
