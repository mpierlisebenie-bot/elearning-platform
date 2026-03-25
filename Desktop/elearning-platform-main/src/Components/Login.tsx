import { useState } from "react";

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

    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return "L'email est obligatoire.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Veuillez entrer un email valide.";
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value) return "Le mot de passe est obligatoire.";
        if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
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
        setSuccessMessage("");

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage("Connexion réussie ! Bienvenue 🎉");
            console.log("Login success:", { email, password });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex w-full max-w-5xl mx-auto px-8 items-center justify-between gap-12">


                <div className="hidden md:flex flex-1 items-center justify-center">
                    <img
                        src="/src/assets/login-illustration.png"
                        alt="Student illustration"
                        className="w-full max-w-md object-contain"
                    />
                </div>


                <div className="flex-1 max-w-md w-full">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Connectez-vous
                    </h1>


                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                                <input
                                    type="email"
                                    placeholder="nom@gmail.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition
                    ${errors.email
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-transparent"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••••••••"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition
                    ${errors.password
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-transparent"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}


                            <div className="text-right mt-1">
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition">
                                    Mot de passe oublié ?
                                </a>
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition duration-200 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                "Connexion"
                            )}
                        </button>
                    </form>


                    <p className="text-center text-sm text-gray-500 mt-6">
                        Vous n'avez pas de compte?{" "}
                        <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
                            Créer un compte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
