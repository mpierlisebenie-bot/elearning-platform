import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";


const COURSES = [
    { icon: "⚡", label: "Développement Web", count: "142 cours" },
    { icon: "🎨", label: "Design & UX", count: "89 cours" },
    { icon: "📊", label: "Data & IA", count: "201 cours" },
    { icon: "🔐", label: "Cybersécurité", count: "67 cours" },
    { icon: "📱", label: "Mobile", count: "95 cours" },
    { icon: "☁️", label: "Cloud & DevOps", count: "113 cours" },
];

const STATS = [
    { value: "48K+", label: "Apprenants actifs" },
    { value: "600+", label: "Cours disponibles" },
    { value: "98%", label: "Taux de satisfaction" },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 50);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <div
            className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden"
            style={{ fontFamily: "'Sora', sans-serif" }}
        >

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s;  opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }

        .shimmer-text {
          background: linear-gradient(90deg, #4f46e5, #818cf8, #4f46e5);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          background: white;
          border-color: #e0e7ff !important;
          box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04);
        }
      `}</style>


            <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-200" />
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">STUDYLEARN</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-semibold">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Catalogue</a>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        onClick={() => navigate("/login")}
                        className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        Connexion
                    </a>
                        <a
                            onClick={() => navigate("/Inscription")}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all cursor-pointer"
                        >
                            S'inscrire
                        </a>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden bg-gradient-to-b from-white to-slate-50"
            >

                <div
                    className="pointer-events-none absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] transition-all duration-700"
                    style={{
                        background: "radial-gradient(circle, #4f46e5, transparent 70%)",
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                />


                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {visible && (
                    <>
                        <div className="fade-up delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-600 mb-8 font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            +2 400 nouveaux inscrits ce mois-ci
                        </div>

                        <h1 className="fade-up delay-2 text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 max-w-4xl mb-6">
                            Apprenez ce qui <br />
                            <span className="shimmer-text">compte vraiment.</span>
                        </h1>

                        <p className="fade-up delay-3 text-slate-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
                            Des formations conçues par des experts pour propulser votre carrière.
                            Rejoignez la plus grande communauté d'apprenants francophones.
                        </p>

                        <div className="fade-up delay-4 flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="/inscription"
                                className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-extrabold text-base shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                Commencer gratuitement →
                            </a>
                            <a
                                href="#"
                                className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-base hover:bg-slate-50 transition-all"> Voir les catalogues
                        </a>
                        </div>
                    </>
                )}
            </section>



            <section className="flex flex-wrap justify-center gap-px bg-white border-y border-slate-200">
                {STATS.map((s) => (
                    <div
                        key={s.label}
                        className="flex-1 min-w-[180px] flex flex-col items-center py-12 px-6 border-x border-slate-50"
                    >
                        <span className="text-4xl font-extrabold text-indigo-600">{s.value}</span>
                        <span className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">{s.label}</span>
                    </div>
                ))}
            </section>

            <section className="px-8 py-24 max-w-6xl mx-auto">
                <div className="text-center md:text-left mb-16">
                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                        Domaines d'expertise
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900">
                        Explorez par thématique
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {COURSES.map((c) => (
                        <div
                            key={c.label}
                            className="card-hover p-8 rounded-3xl border border-slate-200 bg-slate-50 cursor-pointer group"
                        >
                            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{c.icon}</div>
                            <div className="font-extrabold text-slate-900 text-lg mb-1">{c.label}</div>
                            <div className="text-slate-400 text-sm font-medium">{c.count}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-8 pb-32">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-indigo-600 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-20 -mt-20"></div>

                    <div className="relative z-10">
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Prêt à passer au <br />
                            <span className="text-indigo-200 text-opacity-80 italic" style={{ fontFamily: "'Playfair Display', serif" }}>niveau supérieur ?</span>
                        </h3>
                        <p className="text-indigo-100/80 max-w-md font-medium text-lg">
                            Rejoignez 48,000+ apprenants et accédez à des centaines de formations dès aujourd'hui.
                        </p>
                    </div>
                    <a
                        onClick={() => navigate("/Inscription")}
                        className="relative z-10 px-10 py-6 rounded-2xl bg-white text-indigo-600 font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Créer un compte →
                    </a>
                </div>
            </section>


            <footer className="bg-white border-t border-slate-200 px-8 py-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                        <div className="w-6 h-6 rounded bg-indigo-600" />
                        STUDYLEARN
                    </div>
                    <span>© 2026 StudyLearn. Tous droits réservés.</span>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-indigo-600 transition-colors">CGU</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}