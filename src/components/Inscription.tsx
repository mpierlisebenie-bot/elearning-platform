import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

const Inscription = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Validations
    const validateEmail = (value: string) => {
        if (!value.trim()) return "L'email est obligatoire.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email invalide.";
        return undefined;
    };

    const validatePassword = (value: string) => {
        if (!value) return "Obligatoire.";
        if (value.length < 6) return "Minimum 6 caractères.";
        return undefined;
    };

    const validateRequired = (value: string) => (!value.trim() ? "Obligatoire." : undefined);

    // Handlers
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        setErrors(prev => ({ ...prev, firstName: validateRequired(e.target.value) }));
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
        setErrors(prev => ({ ...prev, lastName: validateRequired(e.target.value) }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eError = validateEmail(email);
        const pError = validatePassword(password);
        const lnError = validateRequired(lastName);
        const fnError = validateRequired(firstName);

        if (eError || pError || lnError || fnError) {
            setErrors({ email: eError, password: pError, lastName: lnError, firstName: fnError });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage("Compte créé avec succès ! 🎉");
            setTimeout(() => navigate("/dashboard"), 1500);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-6">
            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">

                {/* Section Gauche : Illustration */}
                <div className="hidden md:flex flex-1 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10 text-center">
                        <img src="/src/assets/img.png" alt="Illustration" className="w-full max-w-sm drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                        <h2 className="mt-8 text-3xl font-bold text-white">Rejoignez l'aventure</h2>
                        <p className="mt-2 text-indigo-100/80">Créez votre profil en moins de 2 minutes.</p>
                    </div>
                </div>


                <div className="flex-1 p-8 lg:p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Créer un compte</h1>
                            <p className="text-gray-500 mt-2 text-sm">C'est gratuit et ça le restera toujours.</p>
                        </div>

                        {successMessage && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm animate-bounce">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            {/* Ligne Prénom & Nom */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Prénom</label>
                                    <input
                                        type="text"
                                        placeholder="Jean"
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-4 transition-all ${errors.firstName ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"}`}
                                    />
                                    {errors.firstName && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.firstName}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Nom</label>
                                    <input
                                        type="text"
                                        placeholder="Dupont"
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-4 transition-all ${errors.lastName ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"}`}
                                    />
                                    {errors.lastName && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.lastName}</span>}
                                </div>
                            </div>


                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="jean@exemple.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-4 transition-all ${errors.email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"}`}
                                />
                                {errors.email && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</span>}
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-4 transition-all ${errors.password ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-500"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Créer mon compte"
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Déjà inscrit ?{" "}
                            <a onClick={() => navigate("/login")} className="text-indigo-600 font-bold hover:underline">
                                Connectez-vous ici
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inscription;