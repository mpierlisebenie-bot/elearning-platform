import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSettings, translationStrings } from "../contexts/SettingsContext";
import {
    enrollmentsApi,
    certificatesApi,
    type Enrollment,
    type Certificate,
} from "../services/api";
import iconPanneau from "../assets/icons/panneau.png";
import iconCloche from "../assets/icons/cloche.png";
import iconRecherche from "../assets/icons/recherche.png";

type HeaderProps = {
  onMenuToggle: () => void;
};

type Notif = { id: string; icone: string; texte: string; date: string };

export default function Header({ onMenuToggle }: HeaderProps) {
    const settings = useSettings();
    const auth = useAuth();
    const navigate = useNavigate();
    const strings = translationStrings[settings.language];
    const dark = settings.darkMode;

    const [query, setQuery] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notif[] | null>(null); // null = pas encore chargé
    const notifRef = useRef<HTMLDivElement>(null);

    const firstName = auth.user?.firstName ?? "";
    const lastName = auth.user?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim() || strings.header.brand;
    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "SL";

    const roleLabel: Record<string, string> = {
        user: strings.header.student,
        instructor: "Instructeur",
        admin: "Administrateur",
    };

    /* Recherche → catalogue filtré */
    const submitSearch = () => {
        const q = query.trim();
        navigate(q ? `/catalogue?q=${encodeURIComponent(q)}` : "/catalogue");
    };

    /* Notifications réelles : inscriptions + certificats de l'utilisateur */
    const loadNotifs = async () => {
        if (!auth.user) {
            setNotifs([]);
            return;
        }
        try {
            const [enrollments, certificates] = await Promise.all([
                enrollmentsApi.getByUser(auth.user.id).catch(() => [] as Enrollment[]),
                certificatesApi.getByUser(auth.user.id).catch(() => [] as Certificate[]),
            ]);
            const items: (Notif & { ts: number })[] = [
                ...enrollments.map((e) => ({
                    id: `e-${e.id}`,
                    icone: e.statut === "termine" ? "🎉" : "📘",
                    texte:
                        e.statut === "termine"
                            ? `Cours « ${e.course?.titre} » terminé — bravo !`
                            : `Inscription au cours « ${e.course?.titre} »`,
                    date: new Date(e.dateInscription).toLocaleDateString("fr-FR"),
                    ts: new Date(e.dateInscription).getTime(),
                })),
                ...certificates.map((c) => ({
                    id: `c-${c.id}`,
                    icone: "🎓",
                    texte: `Certificat obtenu : « ${c.course?.titre} » (${c.codeUnique})`,
                    date: new Date(c.dateObtention).toLocaleDateString("fr-FR"),
                    ts: new Date(c.dateObtention).getTime(),
                })),
            ];
            items.sort((a, b) => b.ts - a.ts);
            setNotifs(items.slice(0, 8));
        } catch {
            setNotifs([]);
        }
    };

    const toggleNotifs = () => {
        const next = !notifOpen;
        setNotifOpen(next);
        if (next && notifs === null) loadNotifs();
    };

    /* Fermer le panneau au clic extérieur */
    useEffect(() => {
        if (!notifOpen) return;
        const onClick = (ev: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(ev.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [notifOpen]);

    return (
        <header
            className={`h-16 w-full border-b px-5 md:px-7 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${
                dark ? "bg-[#0b1120]/85 border-slate-800" : "bg-white/85 border-slate-200/70"
            }`}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    aria-label="Ouvrir le menu"
                    className={`p-2 rounded-lg transition-colors md:hidden ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                >
                    <img src={iconPanneau} alt="" className={`w-5 h-5 opacity-70 ${dark ? "invert" : ""}`} />
                </button>

                <div
                    className={`hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all w-72 focus-within:w-80 ${
                        dark
                            ? "bg-slate-900/60 border-slate-800 focus-within:border-indigo-500/50"
                            : "bg-slate-50 border-slate-200/70 focus-within:bg-white focus-within:border-indigo-300"
                    }`}
                >
                    <img src={iconRecherche} alt="" className={`w-3.5 h-3.5 opacity-40 ${dark ? "invert" : ""}`} />
                    <input
                        type="text"
                        value={query}
                        onChange={(ev) => setQuery(ev.target.value)}
                        onKeyDown={(ev) => ev.key === "Enter" && submitSearch()}
                        placeholder={strings.header.search}
                        className={`bg-transparent border-none outline-none text-[13px] w-full font-medium ${
                            dark ? "text-slate-200 placeholder:text-slate-500" : "text-slate-700 placeholder:text-slate-400"
                        }`}
                    />
                    <kbd
                        className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded border ${
                            dark ? "text-slate-500 border-slate-700 bg-slate-900" : "text-slate-400 border-slate-200 bg-white"
                        }`}
                    >
                        ⏎
                    </kbd>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        aria-label="Notifications"
                        onClick={toggleNotifs}
                        className={`relative p-2.5 rounded-full border transition-colors ${
                            dark ? "border-slate-800 hover:bg-slate-800/70" : "border-slate-200/70 hover:bg-slate-50"
                        } ${notifOpen ? (dark ? "bg-slate-800/70" : "bg-slate-50") : ""}`}
                    >
                        <img src={iconCloche} alt="" className={`w-[18px] h-[18px] opacity-60 ${dark ? "invert" : ""}`} />
                        {(notifs?.length ?? 0) > 0 && (
                            <span className={`absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 ${dark ? "border-[#0b1120]" : "border-white"}`} />
                        )}
                    </button>

                    {notifOpen && (
                        <div
                            className={`absolute right-0 top-12 w-80 rounded-2xl border overflow-hidden z-40 ${
                                dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-lg shadow-slate-900/5"
                            }`}
                        >
                            <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                                <p className={`text-[13px] font-bold ${dark ? "text-white" : "text-slate-900"}`}>Notifications</p>
                            </div>
                            <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                {notifs === null && (
                                    <p className={`px-4 py-5 text-[13px] ${dark ? "text-slate-400" : "text-slate-500"}`}>Chargement…</p>
                                )}
                                {notifs !== null && notifs.length === 0 && (
                                    <p className={`px-4 py-5 text-[13px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                                        Aucune notification pour le moment. Inscrivez-vous à un cours pour commencer !
                                    </p>
                                )}
                                {notifs?.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 ${
                                            dark ? "border-slate-800/70" : "border-slate-50"
                                        }`}
                                    >
                                        <span className="text-lg leading-none mt-0.5">{n.icone}</span>
                                        <div className="min-w-0">
                                            <p className={`text-[12.5px] font-medium leading-snug ${dark ? "text-slate-200" : "text-slate-700"}`}>
                                                {n.texte}
                                            </p>
                                            <p className={`mt-0.5 text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{n.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={`h-8 w-px mx-1.5 hidden sm:block ${dark ? "bg-slate-800" : "bg-slate-200/80"}`} />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block leading-tight">
                        <p className={`text-[13px] font-bold ${dark ? "text-white" : "text-slate-900"}`}>{fullName}</p>
                        <p className={`text-[10px] font-semibold tracking-wide ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
                            {roleLabel[auth.user?.role ?? "user"]}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-[12px] font-bold cursor-pointer ring-2 ring-transparent hover:ring-indigo-300/60 transition-all">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}
