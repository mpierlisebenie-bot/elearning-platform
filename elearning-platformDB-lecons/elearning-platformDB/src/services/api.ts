/**
 * api.ts — Couche d'accès au backend NestJS (StudyLearn)
 * ============================================================================
 * Toutes les requêtes vers le backend passent par ce fichier.
 *
 * - URL de base : lue depuis VITE_API_URL (.env), sinon http://localhost:3001
 * - Le token JWT est stocké dans localStorage et ajouté automatiquement
 *   à l'en-tête Authorization des routes protégées (option `auth: true`).
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  ROUTES SUPPOSÉES (à vérifier face à vos contrôleurs NestJS)
 * ─────────────────────────────────────────────────────────────────────────
 *  Auth          POST   /auth/login
 *  Users         POST   /users/register · GET /users · GET /users/:id
 *                PUT    /users/:id · DELETE /users/:id
 *  Categories    GET    /categories · GET /categories/:id · POST /categories
 *                PUT    /categories/:id · DELETE /categories/:id
 *  Courses       GET    /courses · GET /courses/:id · POST /courses
 *                PUT    /courses/:id · DELETE /courses/:id
 *  Enrollments   POST   /enrollments · GET /enrollments · GET /enrollments/user/:id
 *                PUT    /enrollments/:id · DELETE /enrollments/:id
 *  Certificates  GET    /certificates · GET /certificates/user/:id
 *                POST   /certificates · DELETE /certificates/:id
 *
 *  ⚠️ Si vos contrôleurs utilisent @Patch au lieu de @Put, remplacez "PUT"
 *     par "PATCH" dans les méthodes `update` concernées ci-dessous.
 *     Si un chemin diffère (ex: /users vs /user), corrigez-le ici uniquement.
 * ============================================================================
 */

export const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
    "http://localhost:3001";

const TOKEN_KEY = "elearning-token";

/* ─────────────── Gestion du token ─────────────── */
export const tokenStore = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

/* ─────────────── Types alignés sur le backend ─────────────── */
export type Role = "user" | "admin" | "instructor";
export type Niveau = "debutant" | "intermediaire" | "avance";
export type EnrollmentStatus = "en_cours" | "termine" | "abandonne";

export interface ApiUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

export interface Category {
    idCategory: number;
    nom: string;
    description?: string;
}

export interface Course {
    id: number;
    titre: string;
    description: string;
    instructeur: string;
    niveau: Niveau;
    dureeHeures: number;
    disponible: boolean;
    nbInscrits: number;
    category?: Category | null;
}

export interface Enrollment {
    id: number;
    progression: number; // 0–100
    statut: EnrollmentStatus;
    dateInscription: string;
    course: Course;
    user?: ApiUser;
}

export interface Certificate {
    id: number;
    codeUnique: string;
    dateObtention: string;
    course: Course;
    user?: ApiUser;
}

export interface LoginResponse {
    access_token: string;
    user: ApiUser;
}

/* ─────────────── Charges utiles (DTO d'écriture) ─────────────── */
export interface CategoryInput {
    nom: string;
    description?: string;
}

export interface CourseInput {
    titre: string;
    description: string;
    instructeur: string;
    niveau: Niveau;
    dureeHeures: number;
    disponible?: boolean;
    categoryId: number;
}

export interface CertificateInput {
    userId: number;
    courseId: number;
    codeUnique: string;
}

export interface UserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
}

/* ─────────────── Cœur : un fetch centralisé ─────────────── */
interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean; // ajoute le Bearer token
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, auth = false } = options;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) {
        const token = tokenStore.get();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        // fetch échoue = serveur injoignable / CORS / réseau
        throw new Error(
            "Impossible de joindre le serveur. Vérifiez que le backend tourne sur " + API_URL,
        );
    }

    // 204 No Content (ex: DELETE)
    if (response.status === 204) return undefined as T;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // NestJS renvoie souvent { message: string | string[] }
        const msg = Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message || `Erreur ${response.status}`;
        throw new Error(msg);
    }

    return data as T;
}

/* ═══════════════════════════════════════════════════════════════
   API PAR DOMAINE
═══════════════════════════════════════════════════════════════ */

export const authApi = {
    login: (email: string, password: string) =>
        request<LoginResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
        }),

    register: (firstName: string, lastName: string, email: string, password: string) =>
        request<ApiUser>("/users/register", {
            method: "POST",
            body: { firstName, lastName, email, password },
        }),
};

/* ─────────────── Utilisateurs (admin) ─────────────── */
export const usersApi = {
    getAll: () => request<ApiUser[]>("/users", { auth: true }),
    getOne: (id: number) => request<ApiUser>(`/users/${id}`, { auth: true }),
    create: (data: UserInput) =>
        request<ApiUser>("/users/register", { method: "POST", body: data }),
    update: (id: number, data: Partial<UserInput>) =>
        request<ApiUser>(`/users/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/users/${id}`, { method: "DELETE", auth: true }),
};

/* ─────────────── Catégories ─────────────── */
export const categoriesApi = {
    getAll: () => request<Category[]>("/categories"),
    getOne: (id: number) => request<Category>(`/categories/${id}`),
    create: (data: CategoryInput) =>
        request<Category>("/categories", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<CategoryInput>) =>
        request<Category>(`/categories/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/categories/${id}`, { method: "DELETE", auth: true }),
};

/* ─────────────── Cours ─────────────── */
export const coursesApi = {
    getAll: () => request<Course[]>("/courses"),
    getOne: (id: number) => request<Course>(`/courses/${id}`),
    create: (data: CourseInput) =>
        request<Course>("/courses", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<CourseInput>) =>
        request<Course>(`/courses/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/courses/${id}`, { method: "DELETE", auth: true }),
};

/* ─────────────── Inscriptions (enrollments) ─────────────── */
export const enrollmentsApi = {
    getAll: () => request<Enrollment[]>("/enrollments", { auth: true }),
    create: (userId: number, courseId: number) =>
        request<Enrollment>("/enrollments", {
            method: "POST",
            body: { userId, courseId },
            auth: true,
        }),
    getByUser: (userId: number) =>
        request<Enrollment[]>(`/enrollments/user/${userId}`, { auth: true }),
    update: (id: number, data: { progression?: number; statut?: EnrollmentStatus }) =>
        request<Enrollment>(`/enrollments/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/enrollments/${id}`, { method: "DELETE", auth: true }),
};

/* ─────────────── Certificats ─────────────── */
export const certificatesApi = {
    getAll: () => request<Certificate[]>("/certificates", { auth: true }),
    getByUser: (userId: number) =>
        request<Certificate[]>(`/certificates/user/${userId}`, { auth: true }),
    create: (data: CertificateInput) =>
        request<Certificate>("/certificates", { method: "POST", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/certificates/${id}`, { method: "DELETE", auth: true }),
};

/* ─────────────── Météo (API externe Open-Meteo via le backend) ─────────────── */
export interface Weather {
    ville: string;
    latitude: number;
    longitude: number;
    temperature: number;
    humidite: number;
    vitesseVent: number;
    description: string;
    icone: string;
    source: string;
}

export const weatherApi = {
    // Sans paramètres → Dakar par défaut (côté backend)
    get: (lat?: number, lon?: number, ville?: string) => {
        const params = new URLSearchParams();
        if (lat !== undefined) params.set("lat", String(lat));
        if (lon !== undefined) params.set("lon", String(lon));
        if (ville) params.set("ville", ville);
        const qs = params.toString();
        return request<Weather>(`/weather${qs ? `?${qs}` : ""}`);
    },
};

/* ─────────────── Leçons (contenu des cours) ─────────────── */
export interface Lesson {
    id: number;
    titre: string;
    contenu?: string | null;
    videoUrl?: string | null;
    ordre: number;
    dureeMinutes: number;
    course?: Course;
}

export interface LessonInput {
    titre: string;
    contenu?: string;
    videoUrl?: string;
    ordre?: number;
    dureeMinutes?: number;
    courseId: number;
}

export const lessonsApi = {
    getByCourse: (courseId: number) =>
        request<Lesson[]>(`/lessons/course/${courseId}`, { auth: true }),
    getOne: (id: number) => request<Lesson>(`/lessons/${id}`, { auth: true }),
    create: (data: LessonInput) =>
        request<Lesson>("/lessons", { method: "POST", body: data, auth: true }),
    update: (id: number, data: Partial<Omit<LessonInput, "courseId">>) =>
        request<Lesson>(`/lessons/${id}`, { method: "PUT", body: data, auth: true }),
    remove: (id: number) =>
        request<void>(`/lessons/${id}`, { method: "DELETE", auth: true }),
};

/** Convertit une URL YouTube (watch, youtu.be, shorts) en URL d'intégration. */
export function toYouTubeEmbed(url?: string | null): string | null {
    if (!url) return null;
    const patterns = [
        /youtube\.com\/watch\?v=([\w-]{6,})/,
        /youtu\.be\/([\w-]{6,})/,
        /youtube\.com\/shorts\/([\w-]{6,})/,
        /youtube\.com\/embed\/([\w-]{6,})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return `https://www.youtube.com/embed/${m[1]}`;
    }
    return null;
}
