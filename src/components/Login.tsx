import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormErrors {
    email?: string;
    password?: string;
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // ... (Logique de validation inchangée pour la clarté)
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
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage("Ravi de vous revoir ! 👋");
            setTimeout(() => navigate("/dashboard"), 1000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500">

                {/* Section Gauche : Illustration avec dégradé */}
                <div className="hidden md:flex flex-1 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/30 via-transparent to-transparent"></div>
                    <div className="relative z-10 text-center">
                        <img
                            src="/src/assets/img.png"
                            alt="Student"
                            className="w-full max-w-sm drop-shadow-2xl transition-transform hover:scale-105 duration-700"
                        />
                        <h2 className="mt-8 text-3xl font-bold text-white">Prêt à apprendre ?</h2>
                        <p className="mt-2 text-indigo-100/80">Accédez à vos cours en un clic.</p>
                    </div>
                </div>

                {/* Section Droite : Formulaire */}
                <div className="flex-1 p-8 md:p-16">
                    <div className="max-w-sm mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Connexion
                            </h1>
                            <p className="text-gray-500 mt-2">Veuillez entrer vos identifiants</p>
                        </div>

                        {successMessage && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2 animate-bounce">
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            {/* Input Email */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="nom@exemple.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full pl-4 pr-4 py-3.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:ring-4
                                            ${errors.email
                                            ? "border-red-300 focus:ring-red-100"
                                            : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                                        }`}
                                    />
                                </div>
                                {errors.email && <p className="mt-2 text-xs text-red-500 font-medium">{errors.email}</p>}
                            </div>

                            {/* Input Password */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Oublié ?</a>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`w-full pl-4 pr-12 py-3.5 bg-gray-50 border rounded-xl text-sm transition-all focus:bg-white focus:ring-4
                                            ${errors.password
                                            ? "border-red-300 focus:ring-red-100"
                                            : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-2 text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Se connecter"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
                            Nouveau ici ?{" "}
                            <a href="/inscription" className="text-indigo-600 font-bold hover:underline transition-all">
                                Rejoignez-nous gratuitement
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;