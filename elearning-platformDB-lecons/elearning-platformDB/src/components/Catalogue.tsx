import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, BarChart3, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { coursesApi, enrollmentsApi, type Course } from "../services/api";

/**
 * Catalogue — page reliée au backend.
 * GET /courses (public) pour lister les cours réels.
 * POST /enrollments (protégé) quand un étudiant connecté s'inscrit.
 */

const NIVEAU_LABEL: Record<string, string> = {
    debutant: "Débutant",
    intermediaire: "Intermédiaire",
    avance: "Avancé",
};

export default function Catalogue() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [params] = useSearchParams();
    const categoryFilter = params.get("cat"); // ex: "Développement Web"
    const searchQuery = (params.get("q") ?? "").trim().toLowerCase(); // recherche du header

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [enrolling, setEnrolling] = useState<number | null>(null);
    const [enrolled, setEnrolled] = useState<number[]>([]);
    const [toast, setToast] = useState("");

    useEffect(() => {
        coursesApi
            .getAll()
            .then((data) => setCourses(data))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const visible = courses
        .filter((c) => (categoryFilter ? c.category?.nom === categoryFilter : true))
        .filter((c) =>
            searchQuery
                ? [c.titre, c.description, c.instructeur]
                      .filter(Boolean)
                      .some((field) => field.toLowerCase().includes(searchQuery))
                : true,
        );

    const handleEnroll = async (course: Course) => {
        // Inscription = route protégée → il faut être connecté
        if (!auth.user) {
            navigate("/login");
            return;
        }
        setEnrolling(course.id);
        try {
            await enrollmentsApi.create(auth.user.id, course.id);
            setEnrolled((prev) => [...prev, course.id]);
            setToast(`Inscription au cours « ${course.titre} » réussie.`);
        } catch (err) {
            setToast((err as Error).message);
        } finally {
            setEnrolling(null);
            setTimeout(() => setToast(""), 3000);
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: "var(--paper)", color: "var(--ink)", fontFamily: "'Inter', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root{ --ink:#14110F; --paper:#FAF7F1; --gold:#B8862E; --forest:#1F4439; --stone:#6E665C; --line:#E4DFD5; }
        .serif{ font-family:'Fraunces', serif; }
        .mono{ font-family:'IBM Plex Mono', monospace; }
        .course-card{ transition: border-color .25s ease, transform .25s ease, background .25s ease; }
        .course-card:hover{ border-color:var(--gold); transform: translateY(-3px); background:#fff; }
      `}</style>

            {/* NAV */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b" style={{ borderColor: "var(--line)" }}>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft size={15} /> Accueil
                </button>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: "var(--ink)" }}>
                        <span className="serif text-sm text-white">S</span>
                    </div>
                    <span className="font-bold text-[15px] tracking-tight">STUDYLEARN</span>
                </div>
                <button
                    type="button"
                    onClick={() => navigate(auth.user ? "/dashboard" : "/login")}
                    className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                >
                    {auth.user ? "Mon espace" : "Connexion"}
                </button>
            </nav>

            <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-16">
                <p className="mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                    Catalogue {categoryFilter ? `— ${categoryFilter}` : ""}
                </p>
                <h1 className="serif text-3xl md:text-[2.75rem] tracking-tight mb-12">
                    Tous les cours disponibles
                </h1>

                {loading && (
                    <p className="text-[14px]" style={{ color: "var(--stone)" }}>Chargement des cours…</p>
                )}

                {error && !loading && (
                    <div className="p-5 border text-[14px]" style={{ borderColor: "#B3463B", background: "#FBEFEE", color: "#B3463B" }}>
                        {error}
                    </div>
                )}

                {!loading && !error && visible.length === 0 && (
                    <p className="text-[14px]" style={{ color: "var(--stone)" }}>
                        Aucun cours pour le moment. Ajoutez-en via le backend (POST /courses).
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visible.map((c) => {
                        const isEnrolled = enrolled.includes(c.id);
                        return (
                            <div key={c.id} className="course-card border p-7 flex flex-col" style={{ borderColor: "var(--line)" }}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="mono text-[11px]" style={{ color: "var(--gold)" }}>
                                        {c.category?.nom ?? "Cours"}
                                    </span>
                                    <span className="mono text-[11px]" style={{ color: "var(--stone)" }}>#{c.id}</span>
                                </div>
                                <h3 className="font-semibold text-[18px] mb-2">{c.titre}</h3>
                                <p className="text-[13px] mb-5 leading-relaxed flex-1" style={{ color: "var(--stone)" }}>
                                    {c.description}
                                </p>
                                <div className="flex items-center gap-4 mb-5 text-[12px]" style={{ color: "var(--stone)" }}>
                                    <span className="inline-flex items-center gap-1.5"><BarChart3 size={13} />{NIVEAU_LABEL[c.niveau] ?? c.niveau}</span>
                                    <span className="inline-flex items-center gap-1.5"><Clock size={13} />{c.dureeHeures}h</span>
                                </div>
                                <div className="text-[12px] mb-4 mono" style={{ color: "var(--stone)" }}>
                                    Par {c.instructeur} · {c.nbInscrits} inscrit(s)
                                </div>
                                <button
                                    type="button"
                                    disabled={enrolling === c.id || isEnrolled || !c.disponible}
                                    onClick={() => handleEnroll(c)}
                                    className="inline-flex items-center justify-center gap-2 py-3 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                                    style={{ background: isEnrolled ? "var(--forest)" : "var(--ink)" }}
                                >
                                    {isEnrolled ? (
                                        <><Check size={14} /> Inscrit</>
                                    ) : enrolling === c.id ? (
                                        "Inscription…"
                                    ) : !c.disponible ? (
                                        "Indisponible"
                                    ) : (
                                        <>S'inscrire <ArrowRight size={14} /></>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {toast && (
                <div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 text-[13px] font-semibold text-white shadow-lg"
                    style={{ background: "var(--forest)" }}
                >
                    {toast}
                </div>
            )}
        </div>
    );
}
