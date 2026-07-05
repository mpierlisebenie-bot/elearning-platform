import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

interface FormErrors {
    email?: string;
    password?: string;
}

/**
 * Login — suit le système StudyLearn (voir HomePage.tsx)
 * Encre #14110F · Papier #FAF7F1 · Or #B8862E · Forêt #1F4439 · Pierre #6E665C
 * Fraunces (titres) · Inter (texte) · IBM Plex Mono (utilitaire)
 */

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();
    const auth = useAuth();

    const validateEmail = (value: string) => {
        if (!value.trim()) return "L'email est obligatoire.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Veuillez entrer un email valide.";
        return undefined;
    };

    const validatePassword = (value: string) => {
        if (!value) return "Le mot de passe est obligatoire.";
        if (value.length < 6) return "Minimum 6 caractères.";
        return undefined;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setLoading(true);
        setServerError("");
        auth.signIn(email, password)
            .then(() => {
                setLoading(false);
                setSuccessMessage("Ravi de vous revoir.");
                setTimeout(() => navigate("/dashboard"), 800);
            })
            .catch((err: Error) => {
                setLoading(false);
                setServerError(err.message || "Connexion impossible.");
            });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ background: "var(--paper)", color: "var(--ink)", fontFamily: "'Inter', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root{
          --ink:#14110F; --paper:#FAF7F1; --gold:#B8862E; --forest:#1F4439; --stone:#6E665C; --line:#E4DFD5;
        }

        @keyframes fadeUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform:none; } }
        .fade-up{ animation: fadeUp .6s cubic-bezier(.16,1,.3,1) forwards; }

        .serif{ font-family:'Fraunces', serif; }
        .mono{ font-family:'IBM Plex Mono', monospace; }

        .field-input{
          width:100%; padding:14px 16px; background:#fff; border:1px solid var(--line);
          font-size:14px; transition: border-color .2s ease, box-shadow .2s ease;
        }
        .field-input:focus{ outline:none; border-color: var(--forest); box-shadow: 0 0 0 3px rgba(31,68,57,0.08); }
        .field-input.has-error{ border-color:#B3463B; box-shadow: 0 0 0 3px rgba(179,70,59,0.07); }

        .ticket-stub{
          border-left: 1px dashed rgba(250,247,241,0.35);
        }

        @media (prefers-reduced-motion: reduce){ .fade-up{ animation:none; } }
      `}</style>

            <div
                className="flex w-full max-w-5xl border fade-up"
                style={{ borderColor: "var(--line)", background: "#fff" }}
            >
                {/* LEFT — admission ticket panel, echoes the catalog/transcript motif */}
                <div
                    className="hidden md:flex flex-col flex-1 p-12 relative justify-between"
                    style={{ background: "var(--forest)" }}
                >
                    <div>
                        <p className="mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "#C9D9CF" }}>
                            Carte d'accès — semestre 2026
                        </p>
                        <h2 className="serif text-3xl text-white leading-tight max-w-xs">
                            Bon retour <span style={{ fontStyle: "italic", color: "var(--gold)" }}>parmi nous.</span>
                        </h2>
                        <p className="mt-4 text-[14px] max-w-xs" style={{ color: "rgba(250,247,241,0.75)" }}>
                            Reprenez vos cours, vos progrès et vos certificats là où vous les avez laissés.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            "Accès illimité à plus de 600 cours",
                            "Suivi de progression en temps réel",
                            "Certificats reconnus par les recruteurs",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3 text-[13px]" style={{ color: "rgba(250,247,241,0.85)" }}>
                                <CheckCircle2 size={16} style={{ color: "var(--gold)" }} />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="ticket-stub pl-6 pt-6 flex items-center justify-between mono text-[11px]" style={{ color: "rgba(250,247,241,0.5)" }}>
                        <span>STUDYLEARN</span>
                        <span>ID-48329</span>
                    </div>
                </div>

                {/* RIGHT — form */}
                <div className="flex-1 p-8 md:p-16">
                    <div className="max-w-sm mx-auto">
                        <div className="mb-10">
                            <p className="mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                                Accès étudiant
                            </p>
                            <h1 className="serif text-4xl tracking-tight">Connexion</h1>
                            <p className="mt-2 text-[14px]" style={{ color: "var(--stone)" }}>
                                Veuillez entrer vos identifiants.
                            </p>
                        </div>

                        {successMessage && (
                            <div
                                className="mb-6 p-4 border text-[13px] flex items-center gap-2"
                                style={{ borderColor: "var(--forest)", background: "#F0F5F2", color: "var(--forest)" }}
                            >
                                <CheckCircle2 size={16} />
                                {successMessage}
                            </div>
                        )}

                        {serverError && (
                            <div
                                className="mb-6 p-4 border text-[13px]"
                                style={{ borderColor: "#B3463B", background: "#FBEFEE", color: "#B3463B" }}
                            >
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <label className="block mono text-[11px] uppercase tracking-widest mb-2.5" style={{ color: "var(--stone)" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`field-input ${errors.email ? "has-error" : ""}`}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-[12px] font-medium" style={{ color: "#B3463B" }}>{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-baseline mb-2.5">
                                    <label className="mono text-[11px] uppercase tracking-widest" style={{ color: "var(--stone)" }}>
                                        Mot de passe
                                    </label>
                                    <button
                                        type="button"
                                        className="text-[12px] font-semibold transition-opacity hover:opacity-70"
                                        style={{ color: "var(--forest)" }}
                                    >
                                        Oublié ?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`field-input pr-12 ${errors.password ? "has-error" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 transition-colors"
                                        style={{ color: "var(--stone)" }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-[12px] font-medium" style={{ color: "#B3463B" }}>{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 py-4 font-semibold text-[14px] text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                                style={{ background: "var(--forest)" }}
                            >
                                {loading ? (
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Se connecter
                                        <ArrowRight size={15} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t text-center text-[14px]" style={{ borderColor: "var(--line)", color: "var(--stone)" }}>
                            Nouveau ici ?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/inscription")}
                                className="font-semibold transition-opacity hover:opacity-70"
                                style={{ color: "var(--forest)" }}
                            >
                                Rejoignez-nous gratuitement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;