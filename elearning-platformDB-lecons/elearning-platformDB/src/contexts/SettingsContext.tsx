import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Language = "fr" | "en" | "es";

type SettingsState = {
    notifications: boolean;
    darkMode: boolean;
    language: Language;
};

type SettingsContextValue = SettingsState & {
    setDarkMode: (value: boolean) => void;
    setLanguage: (value: Language) => void;
    setNotifications: (value: boolean) => void;
};

const STORAGE_KEY = "studylearn-settings";

const defaultSettings: SettingsState = {
    notifications: true,
    darkMode: false,
    language: "fr",
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const translationStrings = {
    fr: {
        menu: {
            profil: "Profil",
            mesCours: "Mes cours",
            progression: "Progression",
            certificats: "Certificats",
            parametres: "Paramètres",
            deconnexion: "Déconnexion",
            gestion: "Gestion",
            administration: "Administration",
        },
        header: {
            search: "Rechercher un cours...",
            student: "Étudiant Premium",
            brand: "Studylearning",
        },
        dashboard: {
            profileTitle: "Mon profil",
            profileDescription: "Gestion de votre compte et préférences.",
            certificatesTitle: "Mes certificats",
            certificatesDescription: "Tous vos certificats d'apprentissage.",
            settingsTitle: "Paramètres",
            settingsDescription: "Ajustez votre expérience d'apprentissage et enregistrez vos préférences.",
            progressionTitle: "Progression des étudiants",
            progressionTabs: ["Cours terminés par mois", "Temps d'apprentissage"],
            subjectChartTitle: "Temps d'apprentissage par matière",
            categoryChartTitle: "Catégories de cours",
            myCoursesTitle: "Mes cours",
            learningRateTitle: "Taux d'apprentissage",
            notifications: "Notifications",
            darkMode: "Mode sombre",
            language: "Langue",
            notificationsDescription: "Recevez des mises à jour par email et des recommandations.",
            darkModeDescription: "Basculer entre clair et sombre pour le tableau de bord.",
            languageDescription: "Sélectionnez la langue de l'interface.",
            saveButton: "Enregistrer",
            savedMessage: "Paramètres enregistrés.",
            refresh: "Rafraîchir",
        },
    },
    en: {
        menu: {
            profil: "Profile",
            mesCours: "My Courses",
            progression: "Progress",
            certificats: "Certificates",
            parametres: "Settings",
            deconnexion: "Logout",
            gestion: "Management",
            administration: "Administration",
        },
        header: {
            search: "Search for a course...",
            student: "Premium Student",
            brand: "Studylearning",
        },
        dashboard: {
            profileTitle: "My profile",
            profileDescription: "Manage your account and preferences.",
            certificatesTitle: "My certificates",
            certificatesDescription: "All your learning certificates.",
            settingsTitle: "Settings",
            settingsDescription: "Adjust your learning experience and save preferences.",
            progressionTitle: "Student progress",
            progressionTabs: ["Courses completed per month", "Learning time"],
            subjectChartTitle: "Learning time by subject",
            categoryChartTitle: "Course categories",
            myCoursesTitle: "My courses",
            learningRateTitle: "Learning rate",
            notifications: "Notifications",
            darkMode: "Dark mode",
            language: "Language",
            notificationsDescription: "Receive updates by email and recommendations.",
            darkModeDescription: "Switch between light and dark dashboard mode.",
            languageDescription: "Select the interface language.",
            saveButton: "Save",
            savedMessage: "Settings saved.",
            refresh: "Refresh",
        },
    },
    es: {
        menu: {
            profil: "Perfil",
            mesCours: "Mis cursos",
            progression: "Progreso",
            certificats: "Certificados",
            parametres: "Ajustes",
            deconnexion: "Cerrar sesión",
            gestion: "Gestión",
            administration: "Administración",
        },
        header: {
            search: "Buscar un curso...",
            student: "Estudiante Premium",
            brand: "Studylearning",
        },
        dashboard: {
            profileTitle: "Mi perfil",
            profileDescription: "Administra tu cuenta y preferencias.",
            certificatesTitle: "Mis certificados",
            certificatesDescription: "Todos tus certificados de aprendizaje.",
            settingsTitle: "Ajustes",
            settingsDescription: "Ajusta tu experiencia de aprendizaje y guarda preferencias.",
            progressionTitle: "Progreso de estudiantes",
            progressionTabs: ["Cursos completados por mes", "Tiempo de aprendizaje"],
            subjectChartTitle: "Tiempo de aprendizaje por materia",
            categoryChartTitle: "Categorías de cursos",
            myCoursesTitle: "Mis cursos",
            learningRateTitle: "Tasa de aprendizaje",
            notifications: "Notificaciones",
            darkMode: "Modo oscuro",
            language: "Idioma",
            notificationsDescription: "Recibe actualizaciones por correo y recomendaciones.",
            darkModeDescription: "Cambia entre modo claro y oscuro para el panel.",
            languageDescription: "Selecciona el idioma de la interfaz.",
            saveButton: "Guardar",
            savedMessage: "Ajustes guardados.",
            refresh: "Actualizar",
        },
    },
} as const;

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    useEffect(() => {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as SettingsState;
                setSettings({ ...defaultSettings, ...parsed });
            } catch {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        document.documentElement.classList.toggle("dark-mode", settings.darkMode);
    }, [settings]);

    const setDarkMode = (value: boolean) => setSettings((prev) => ({ ...prev, darkMode: value }));
    const setLanguage = (value: Language) => setSettings((prev) => ({ ...prev, language: value }));
    const setNotifications = (value: boolean) => setSettings((prev) => ({ ...prev, notifications: value }));

    return (
        <SettingsContext.Provider value={{ ...settings, setDarkMode, setLanguage, setNotifications }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return context;
}
