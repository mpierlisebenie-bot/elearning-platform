/**
 * Gestion.tsx — Espace d'administration StudyLearn.
 * Permet de gérer (créer / modifier / supprimer) toutes les ressources
 * exposées par le backend NestJS :
 *   Catégories · Cours · Certificats · Inscriptions · Utilisateurs
 *
 * Chaque onglet appelle directement la couche services/api.ts.
 */
import { useEffect, useState, type ReactNode } from "react";
import {
    LayoutGrid,
    BookOpen,
    Award,
    GraduationCap,
    Users,
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    Video,
} from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import {
    categoriesApi,
    coursesApi,
    certificatesApi,
    enrollmentsApi,
    usersApi,
    lessonsApi,
    type Category,
    type Course,
    type Lesson,
    type Certificate,
    type Enrollment,
    type ApiUser,
    type Niveau,
    type EnrollmentStatus,
    type Role,
} from "../../services/api";
import {
    Panel,
    Btn,
    Field,
    TextArea,
    Select,
    Toggle,
    Modal,
    ConfirmDialog,
    StateRow,
    ErrorBanner,
    Badge,
    ToastProvider,
    useToast,
    useAsyncList,
} from "./adminUi";

/* ════════════ Styles de tableau partagés ════════════ */
function useTable() {
    const { darkMode } = useSettings();
    return {
        head: `text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`,
        cell: `text-sm ${darkMode ? "text-slate-200" : "text-slate-700"}`,
        cellStrong: `text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`,
        cellMuted: `text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`,
        rowBorder: darkMode ? "border-slate-800/70" : "border-slate-50",
    };
}

/* Boutons d'action d'une ligne (modifier / supprimer) */
function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    const { darkMode } = useSettings();
    const base = "grid h-8 w-8 place-items-center rounded-lg transition-colors";
    return (
        <div className="flex items-center justify-end gap-1.5">
            <button
                type="button"
                onClick={onEdit}
                aria-label="Modifier"
                className={`${base} ${darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-indigo-400" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
            >
                <Pencil size={15} />
            </button>
            <button
                type="button"
                onClick={onDelete}
                aria-label="Supprimer"
                className={`${base} ${darkMode ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400" : "text-slate-400 hover:bg-red-50 hover:text-red-600"}`}
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}

/* En-tête commun à chaque onglet : titre + bouton rafraîchir + bouton créer */
function SectionHead({
    title,
    subtitle,
    onRefresh,
    loading,
    onCreate,
    createLabel,
}: {
    title: string;
    subtitle: string;
    onRefresh: () => void;
    loading: boolean;
    onCreate: () => void;
    createLabel: string;
}) {
    const { darkMode } = useSettings();
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h2 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>{title}</h2>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
                <Btn variant="soft" onClick={onRefresh} disabled={loading}>
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    {loading ? "Chargement…" : "Rafraîchir"}
                </Btn>
                <Btn variant="primary" onClick={onCreate}>
                    <Plus size={16} /> {createLabel}
                </Btn>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   1) CATÉGORIES
════════════════════════════════════════════════════════════ */
const emptyCategory = { nom: "", description: "" };

function CategoriesManager() {
    const t = useTable();
    const toast = useToast();
    const { items, loading, error, refresh } = useAsyncList<Category>(categoriesApi.getAll);

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyCategory);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyCategory);
        setOpen(true);
    };
    const openEdit = (c: Category) => {
        setEditId(c.idCategory);
        setForm({ nom: c.nom, description: c.description ?? "" });
        setOpen(true);
    };

    const save = async () => {
        if (!form.nom.trim()) return toast.push("Le nom de la catégorie est requis.", "error");
        setSaving(true);
        try {
            if (editId == null) {
                await categoriesApi.create({ nom: form.nom.trim(), description: form.description.trim() || undefined });
                toast.push("Catégorie créée.");
            } else {
                await categoriesApi.update(editId, { nom: form.nom.trim(), description: form.description.trim() || undefined });
                toast.push("Catégorie mise à jour.");
            }
            setOpen(false);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await categoriesApi.remove(toDelete.idCategory);
            toast.push("Catégorie supprimée.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Panel className="p-6">
            <SectionHead
                title="Catégories"
                subtitle="Les filières qui regroupent vos cours."
                onRefresh={refresh}
                loading={loading}
                onCreate={openCreate}
                createLabel="Nouvelle catégorie"
            />
            {error && <ErrorBanner message={error} />}

            <div className={`grid grid-cols-[40px_1fr_1.4fr_80px] gap-3 border-b pb-2 ${t.rowBorder}`}>
                {["#", "Nom", "Description", ""].map((h, i) => (
                    <span key={i} className={t.head}>{h}</span>
                ))}
            </div>

            {loading && <div className="pt-4"><StateRow>Chargement des catégories…</StateRow></div>}
            {!loading && items.length === 0 && !error && (
                <div className="pt-4"><StateRow>Aucune catégorie. Créez-en une pour commencer.</StateRow></div>
            )}

            {!loading &&
                items.map((c) => (
                    <div key={c.idCategory} className={`grid grid-cols-[40px_1fr_1.4fr_80px] items-center gap-3 border-b py-3 last:border-b-0 ${t.rowBorder}`}>
                        <span className={t.cellMuted}>#{c.idCategory}</span>
                        <span className={t.cellStrong}>{c.nom}</span>
                        <span className={`${t.cell} truncate`}>{c.description || "—"}</span>
                        <RowActions onEdit={() => openEdit(c)} onDelete={() => setToDelete(c)} />
                    </div>
                ))}

            <Modal
                open={open}
                title={editId == null ? "Nouvelle catégorie" : "Modifier la catégorie"}
                onClose={() => setOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Nom" value={form.nom} placeholder="Développement Web" onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                    <TextArea label="Description" value={form.description} placeholder="Cours de programmation web…" onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer la catégorie « ${toDelete?.nom} » ? Les cours liés pourraient être affectés.`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </Panel>
    );
}

/* ════════════════════════════════════════════════════════════
   2) COURS
════════════════════════════════════════════════════════════ */
const NIVEAUX: { value: Niveau; label: string }[] = [
    { value: "debutant", label: "Débutant" },
    { value: "intermediaire", label: "Intermédiaire" },
    { value: "avance", label: "Avancé" },
];

type CourseForm = {
    titre: string;
    description: string;
    instructeur: string;
    niveau: Niveau;
    dureeHeures: string;
    disponible: boolean;
    categoryId: string;
};
const emptyCourse: CourseForm = {
    titre: "",
    description: "",
    instructeur: "",
    niveau: "debutant",
    dureeHeures: "",
    disponible: true,
    categoryId: "",
};

/* ── Gestion des leçons d'un cours (contenu pédagogique) ── */
type LessonForm = { titre: string; videoUrl: string; dureeMinutes: string; contenu: string };
const emptyLesson: LessonForm = { titre: "", videoUrl: "", dureeMinutes: "10", contenu: "" };

function LessonsManager({ course, onClose }: { course: Course; onClose: () => void }) {
    const t = useTable();
    const { darkMode } = useSettings();
    const toast = useToast();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<LessonForm>(emptyLesson);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<Lesson | null>(null);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        setLoading(true);
        setError("");
        lessonsApi
            .getByCourse(course.id)
            .then(setLessons)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    };
    useEffect(load, [course.id]);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyLesson);
        setFormOpen(true);
    };
    const openEdit = (l: Lesson) => {
        setEditId(l.id);
        setForm({
            titre: l.titre,
            videoUrl: l.videoUrl ?? "",
            dureeMinutes: String(l.dureeMinutes ?? 10),
            contenu: l.contenu ?? "",
        });
        setFormOpen(true);
    };

    const save = async () => {
        if (!form.titre.trim()) return toast.push("Le titre de la leçon est requis.", "error");
        const payload = {
            titre: form.titre.trim(),
            videoUrl: form.videoUrl.trim() || undefined,
            contenu: form.contenu.trim() || undefined,
            dureeMinutes: Number(form.dureeMinutes) || 10,
        };
        setSaving(true);
        try {
            if (editId == null) {
                await lessonsApi.create({ ...payload, courseId: course.id });
                toast.push("Leçon ajoutée.");
            } else {
                await lessonsApi.update(editId, payload);
                toast.push("Leçon mise à jour.");
            }
            setFormOpen(false);
            load();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await lessonsApi.remove(toDelete.id);
            toast.push("Leçon supprimée.");
            setToDelete(null);
            load();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Modal
                open
                title={`Leçons — ${course.titre}`}
                onClose={onClose}
                footer={
                    <>
                        <Btn variant="ghost" onClick={onClose}>Fermer</Btn>
                        <Btn onClick={openCreate}><Plus size={15} /> Nouvelle leçon</Btn>
                    </>
                }
            >
                {error && <ErrorBanner message={error} />}
                {loading && <StateRow>Chargement des leçons…</StateRow>}
                {!loading && lessons.length === 0 && !error && (
                    <StateRow>
                        Aucune leçon pour ce cours. Ajoutez la première : un titre, un lien
                        YouTube et/ou un contenu écrit.
                    </StateRow>
                )}
                {!loading && lessons.length > 0 && (
                    <div className="space-y-0">
                        {lessons.map((l, idx) => (
                            <div key={l.id} className={`flex items-center gap-3 border-b py-2.5 last:border-b-0 ${t.rowBorder}`}>
                                <span className={`w-7 h-7 rounded-lg grid place-items-center text-[11px] font-bold flex-shrink-0 ${darkMode ? "bg-slate-800 text-slate-300" : "bg-indigo-50 text-indigo-600"}`}>
                                    {idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className={`${t.cellStrong} truncate`}>{l.titre}</p>
                                    <p className={`${t.cellMuted} truncate`}>
                                        {l.dureeMinutes} min{l.videoUrl ? " · 🎬 vidéo" : ""}{l.contenu ? " · 📝 texte" : ""}
                                    </p>
                                </div>
                                <RowActions onEdit={() => openEdit(l)} onDelete={() => setToDelete(l)} />
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            <Modal
                open={formOpen}
                title={editId == null ? "Nouvelle leçon" : "Modifier la leçon"}
                onClose={() => setFormOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setFormOpen(false)}>Annuler</Btn>
                        <Btn onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field
                        label="Titre de la leçon"
                        value={form.titre}
                        onChange={(ev) => setForm({ ...form, titre: ev.target.value })}
                        placeholder="Introduction aux composants"
                    />
                    <div className="grid sm:grid-cols-[1fr_120px] gap-4">
                        <Field
                            label="Lien vidéo YouTube (optionnel)"
                            value={form.videoUrl}
                            onChange={(ev) => setForm({ ...form, videoUrl: ev.target.value })}
                            placeholder="https://www.youtube.com/watch?v=…"
                        />
                        <Field
                            label="Durée (min)"
                            type="number"
                            min={1}
                            value={form.dureeMinutes}
                            onChange={(ev) => setForm({ ...form, dureeMinutes: ev.target.value })}
                        />
                    </div>
                    <TextArea
                        label="Contenu écrit (optionnel)"
                        value={form.contenu}
                        onChange={(ev) => setForm({ ...form, contenu: ev.target.value })}
                        placeholder="Le cours écrit de cette leçon…"
                        rows={5}
                    />
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer la leçon « ${toDelete?.titre} » ?`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </>
    );
}

function CoursesManager() {
    const t = useTable();
    const { darkMode } = useSettings();
    const catBorder = darkMode ? "border-slate-700" : "border-slate-200";
    const toast = useToast();
    const { items, loading, error, refresh } = useAsyncList<Course>(coursesApi.getAll);
    const { items: categories } = useAsyncList<Category>(categoriesApi.getAll);

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<CourseForm>(emptyCourse);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<Course | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [lessonsFor, setLessonsFor] = useState<Course | null>(null);

    const openCreate = () => {
        setEditId(null);
        setForm({ ...emptyCourse, categoryId: categories[0] ? String(categories[0].idCategory) : "" });
        setOpen(true);
    };
    const openEdit = (c: Course) => {
        setEditId(c.id);
        setForm({
            titre: c.titre,
            description: c.description,
            instructeur: c.instructeur,
            niveau: c.niveau,
            dureeHeures: String(c.dureeHeures),
            disponible: c.disponible,
            categoryId: c.category ? String(c.category.idCategory) : "",
        });
        setOpen(true);
    };

    const save = async () => {
        if (!form.titre.trim()) return toast.push("Le titre est requis.", "error");
        if (!form.categoryId) return toast.push("Choisissez une catégorie.", "error");
        const payload = {
            titre: form.titre.trim(),
            description: form.description.trim(),
            instructeur: form.instructeur.trim(),
            niveau: form.niveau,
            dureeHeures: Number(form.dureeHeures) || 0,
            disponible: form.disponible,
            categoryId: Number(form.categoryId),
        };
        setSaving(true);
        try {
            if (editId == null) {
                await coursesApi.create(payload);
                toast.push("Cours créé.");
            } else {
                await coursesApi.update(editId, payload);
                toast.push("Cours mis à jour.");
            }
            setOpen(false);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await coursesApi.remove(toDelete.id);
            toast.push("Cours supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Panel className="p-6">
            <SectionHead
                title="Cours"
                subtitle="Créez et gérez le catalogue de cours."
                onRefresh={refresh}
                loading={loading}
                onCreate={openCreate}
                createLabel="Nouveau cours"
            />
            {error && <ErrorBanner message={error} />}

            <div className={`grid grid-cols-[1.6fr_1fr_90px_70px_118px] gap-3 border-b pb-2 ${t.rowBorder}`}>
                {["Titre", "Catégorie", "Niveau", "Durée", ""].map((h, i) => (
                    <span key={i} className={t.head}>{h}</span>
                ))}
            </div>

            {loading && <div className="pt-4"><StateRow>Chargement des cours…</StateRow></div>}
            {!loading && items.length === 0 && !error && (
                <div className="pt-4"><StateRow>Aucun cours. Ajoutez votre premier cours.</StateRow></div>
            )}

            {!loading &&
                items.map((c) => (
                    <div key={c.id} className={`grid grid-cols-[1.6fr_1fr_90px_70px_118px] items-center gap-3 border-b py-3 last:border-b-0 ${t.rowBorder}`}>
                        <div className="min-w-0">
                            <p className={`${t.cellStrong} truncate`}>{c.titre}</p>
                            <p className={`${t.cellMuted} truncate`}>{c.instructeur || "—"} · {c.disponible ? "Disponible" : "Indisponible"}</p>
                        </div>
                        <span className={`${t.cell} truncate`}>{c.category?.nom ?? "—"}</span>
                        <span className={t.cell}>{NIVEAUX.find((n) => n.value === c.niveau)?.label ?? c.niveau}</span>
                        <span className={t.cell}>{c.dureeHeures}h</span>
                        <div className="flex items-center justify-end gap-1">
                            <button
                                type="button"
                                onClick={() => setLessonsFor(c)}
                                aria-label="Gérer les leçons"
                                title="Gérer les leçons"
                                className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-indigo-400" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
                            >
                                <Video size={15} />
                            </button>
                            <RowActions onEdit={() => openEdit(c)} onDelete={() => setToDelete(c)} />
                        </div>
                    </div>
                ))}

            {lessonsFor && <LessonsManager course={lessonsFor} onClose={() => setLessonsFor(null)} />}

            <Modal
                open={open}
                title={editId == null ? "Nouveau cours" : "Modifier le cours"}
                onClose={() => setOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Titre" value={form.titre} placeholder="Introduction à React" onChange={(e) => setForm({ ...form, titre: e.target.value })} />
                    <TextArea label="Description" value={form.description} placeholder="Apprendre les bases de React…" onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Instructeur" value={form.instructeur} placeholder="M. Sow" onChange={(e) => setForm({ ...form, instructeur: e.target.value })} />
                        <Field label="Durée (heures)" type="number" min={0} value={form.dureeHeures} placeholder="8" onChange={(e) => setForm({ ...form, dureeHeures: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Niveau" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value as Niveau })}>
                            {NIVEAUX.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                        </Select>
                        <Select label="Catégorie" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                            <option value="">— choisir —</option>
                            {categories.map((cat) => <option key={cat.idCategory} value={cat.idCategory}>{cat.nom}</option>)}
                        </Select>
                    </div>
                    <div className={`flex items-center justify-between rounded-xl border border-dashed px-4 py-3 ${catBorder}`}>
                        <span className="text-sm font-semibold">Cours disponible aux inscriptions</span>
                        <Toggle checked={form.disponible} onChange={() => setForm({ ...form, disponible: !form.disponible })} />
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer le cours « ${toDelete?.titre} » ?`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </Panel>
    );
}

/* ════════════════════════════════════════════════════════════
   3) CERTIFICATS
════════════════════════════════════════════════════════════ */
function fmtDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return iso;
    }
}
function userLabel(u?: ApiUser) {
    if (!u) return "—";
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    return name || u.email;
}

function CertificatesManager() {
    const t = useTable();
    const toast = useToast();
    const { items, loading, error, refresh } = useAsyncList<Certificate>(certificatesApi.getAll);
    const { items: users } = useAsyncList<ApiUser>(usersApi.getAll);
    const { items: courses } = useAsyncList<Course>(coursesApi.getAll);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ userId: "", courseId: "" });
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<Certificate | null>(null);
    const [deleting, setDeleting] = useState(false);

    const openCreate = () => {
        setForm({ userId: users[0] ? String(users[0].id) : "", courseId: courses[0] ? String(courses[0].id) : "" });
        setOpen(true);
    };

    const save = async () => {
        if (!form.userId || !form.courseId) return toast.push("Choisissez un étudiant et un cours.", "error");
        setSaving(true);
        try {
            const code = "CERT-" + Date.now().toString(36).toUpperCase();
            await certificatesApi.create({ userId: Number(form.userId), courseId: Number(form.courseId), codeUnique: code });
            toast.push("Certificat délivré.");
            setOpen(false);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await certificatesApi.remove(toDelete.id);
            toast.push("Certificat supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Panel className="p-6">
            <SectionHead
                title="Certificats"
                subtitle="Délivrez et révoquez les certificats d'apprentissage."
                onRefresh={refresh}
                loading={loading}
                onCreate={openCreate}
                createLabel="Délivrer un certificat"
            />
            {error && <ErrorBanner message={error} />}

            <div className={`grid grid-cols-[1.4fr_1.2fr_1fr_90px_70px] gap-3 border-b pb-2 ${t.rowBorder}`}>
                {["Cours", "Étudiant", "Code", "Date", ""].map((h, i) => (
                    <span key={i} className={t.head}>{h}</span>
                ))}
            </div>

            {loading && <div className="pt-4"><StateRow>Chargement des certificats…</StateRow></div>}
            {!loading && items.length === 0 && !error && (
                <div className="pt-4"><StateRow>Aucun certificat délivré pour l'instant.</StateRow></div>
            )}

            {!loading &&
                items.map((c) => (
                    <div key={c.id} className={`grid grid-cols-[1.4fr_1.2fr_1fr_90px_70px] items-center gap-3 border-b py-3 last:border-b-0 ${t.rowBorder}`}>
                        <span className={`${t.cellStrong} truncate`}>{c.course?.titre ?? "—"}</span>
                        <span className={`${t.cell} truncate`}>{userLabel(c.user)}</span>
                        <span className={`${t.cellMuted} truncate`}>{c.codeUnique}</span>
                        <span className={t.cellMuted}>{fmtDate(c.dateObtention)}</span>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setToDelete(c)}
                                aria-label="Supprimer"
                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ))}

            <Modal
                open={open}
                title="Délivrer un certificat"
                onClose={() => setOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Délivrance…" : "Délivrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <Select label="Étudiant" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}>
                        <option value="">— choisir —</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{userLabel(u)} ({u.email})</option>)}
                    </Select>
                    <Select label="Cours" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                        <option value="">— choisir —</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
                    </Select>
                    <p className="text-xs text-slate-400">Le code unique et la date sont générés par le serveur.</p>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer le certificat « ${toDelete?.codeUnique} » ?`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </Panel>
    );
}

/* ════════════════════════════════════════════════════════════
   4) INSCRIPTIONS (enrollments)
════════════════════════════════════════════════════════════ */
const STATUTS: { value: EnrollmentStatus; label: string; tone: "amber" | "green" | "red" }[] = [
    { value: "en_cours", label: "En cours", tone: "amber" },
    { value: "termine", label: "Terminé", tone: "green" },
    { value: "abandonne", label: "Abandonné", tone: "red" },
];

function EnrollmentsManager() {
    const t = useTable();
    const toast = useToast();
    const { items, loading, error, refresh } = useAsyncList<Enrollment>(enrollmentsApi.getAll);
    const { items: users } = useAsyncList<ApiUser>(usersApi.getAll);
    const { items: courses } = useAsyncList<Course>(coursesApi.getAll);

    const [createOpen, setCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ userId: "", courseId: "" });
    const [editing, setEditing] = useState<Enrollment | null>(null);
    const [editForm, setEditForm] = useState<{ progression: string; statut: EnrollmentStatus }>({ progression: "0", statut: "en_cours" });
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<Enrollment | null>(null);
    const [deleting, setDeleting] = useState(false);

    const openCreate = () => {
        setCreateForm({ userId: users[0] ? String(users[0].id) : "", courseId: courses[0] ? String(courses[0].id) : "" });
        setCreateOpen(true);
    };
    const create = async () => {
        if (!createForm.userId || !createForm.courseId) return toast.push("Choisissez un étudiant et un cours.", "error");
        setSaving(true);
        try {
            await enrollmentsApi.create(Number(createForm.userId), Number(createForm.courseId));
            toast.push("Inscription créée.");
            setCreateOpen(false);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const openEdit = (e: Enrollment) => {
        setEditing(e);
        setEditForm({ progression: String(e.progression), statut: e.statut });
    };
    const saveEdit = async () => {
        if (!editing) return;
        setSaving(true);
        try {
            const prog = Math.max(0, Math.min(100, Number(editForm.progression) || 0));
            await enrollmentsApi.update(editing.id, { progression: prog, statut: editForm.statut });
            toast.push("Inscription mise à jour.");
            setEditing(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await enrollmentsApi.remove(toDelete.id);
            toast.push("Inscription supprimée.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Panel className="p-6">
            <SectionHead
                title="Inscriptions"
                subtitle="Suivez et ajustez la progression des étudiants."
                onRefresh={refresh}
                loading={loading}
                onCreate={openCreate}
                createLabel="Nouvelle inscription"
            />
            {error && <ErrorBanner message={error} />}

            <div className={`grid grid-cols-[1.3fr_1.2fr_1.2fr_110px_80px] gap-3 border-b pb-2 ${t.rowBorder}`}>
                {["Étudiant", "Cours", "Progression", "Statut", ""].map((h, i) => (
                    <span key={i} className={t.head}>{h}</span>
                ))}
            </div>

            {loading && <div className="pt-4"><StateRow>Chargement des inscriptions…</StateRow></div>}
            {!loading && items.length === 0 && !error && (
                <div className="pt-4"><StateRow>Aucune inscription enregistrée.</StateRow></div>
            )}

            {!loading &&
                items.map((e) => {
                    const st = STATUTS.find((s) => s.value === e.statut);
                    return (
                        <div key={e.id} className={`grid grid-cols-[1.3fr_1.2fr_1.2fr_110px_80px] items-center gap-3 border-b py-3 last:border-b-0 ${t.rowBorder}`}>
                            <span className={`${t.cell} truncate`}>{userLabel(e.user)}</span>
                            <span className={`${t.cellStrong} truncate`}>{e.course?.titre ?? "—"}</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${e.progression}%` }} />
                                </div>
                                <span className={`${t.cellMuted} min-w-[34px] text-right`}>{Math.round(e.progression)}%</span>
                            </div>
                            <div><Badge tone={st?.tone ?? "slate"}>{st?.label ?? e.statut}</Badge></div>
                            <RowActions onEdit={() => openEdit(e)} onDelete={() => setToDelete(e)} />
                        </div>
                    );
                })}

            {/* Créer */}
            <Modal
                open={createOpen}
                title="Nouvelle inscription"
                onClose={() => setCreateOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setCreateOpen(false)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={create} disabled={saving}>{saving ? "Création…" : "Inscrire"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <Select label="Étudiant" value={createForm.userId} onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}>
                        <option value="">— choisir —</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{userLabel(u)} ({u.email})</option>)}
                    </Select>
                    <Select label="Cours" value={createForm.courseId} onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })}>
                        <option value="">— choisir —</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
                    </Select>
                </div>
            </Modal>

            {/* Modifier */}
            <Modal
                open={!!editing}
                title="Modifier l'inscription"
                onClose={() => setEditing(null)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setEditing(null)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={saveEdit} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm font-semibold">{editing?.course?.titre} — {userLabel(editing?.user)}</p>
                    <Field label="Progression (%)" type="number" min={0} max={100} value={editForm.progression} onChange={(e) => setEditForm({ ...editForm, progression: e.target.value })} />
                    <Select label="Statut" value={editForm.statut} onChange={(e) => setEditForm({ ...editForm, statut: e.target.value as EnrollmentStatus })}>
                        {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </Select>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer l'inscription de « ${userLabel(toDelete?.user)} » au cours « ${toDelete?.course?.titre} » ?`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </Panel>
    );
}

/* ════════════════════════════════════════════════════════════
   5) UTILISATEURS
════════════════════════════════════════════════════════════ */
const ROLES: { value: Role; label: string; tone: "indigo" | "green" | "slate" }[] = [
    { value: "user", label: "Étudiant", tone: "slate" },
    { value: "instructor", label: "Instructeur", tone: "green" },
    { value: "admin", label: "Administrateur", tone: "indigo" },
];

type UserForm = { firstName: string; lastName: string; email: string; password: string; role: Role };
const emptyUser: UserForm = { firstName: "", lastName: "", email: "", password: "", role: "user" };

function UsersManager() {
    const t = useTable();
    const toast = useToast();
    const { items, loading, error, refresh } = useAsyncList<ApiUser>(usersApi.getAll);

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<UserForm>(emptyUser);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<ApiUser | null>(null);
    const [deleting, setDeleting] = useState(false);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyUser);
        setOpen(true);
    };
    const openEdit = (u: ApiUser) => {
        setEditId(u.id);
        setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: "", role: u.role });
        setOpen(true);
    };

    const save = async () => {
        if (!form.firstName.trim() || !form.email.trim()) return toast.push("Prénom et email sont requis.", "error");
        setSaving(true);
        try {
            if (editId == null) {
                if (!form.password.trim()) {
                    setSaving(false);
                    return toast.push("Le mot de passe est requis pour un nouveau compte.", "error");
                }
                await usersApi.create({
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    role: form.role,
                });
                toast.push("Utilisateur créé.");
            } else {
                const payload: Partial<UserForm> = {
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    role: form.role,
                };
                if (form.password.trim()) payload.password = form.password;
                await usersApi.update(editId, payload);
                toast.push("Utilisateur mis à jour.");
            }
            setOpen(false);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        try {
            await usersApi.remove(toDelete.id);
            toast.push("Utilisateur supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.push((err as Error).message, "error");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Panel className="p-6">
            <SectionHead
                title="Utilisateurs"
                subtitle="Gérez les comptes et leurs rôles."
                onRefresh={refresh}
                loading={loading}
                onCreate={openCreate}
                createLabel="Nouvel utilisateur"
            />
            {error && <ErrorBanner message={error} />}

            <div className={`grid grid-cols-[40px_1.2fr_1.4fr_120px_80px] gap-3 border-b pb-2 ${t.rowBorder}`}>
                {["#", "Nom", "Email", "Rôle", ""].map((h, i) => (
                    <span key={i} className={t.head}>{h}</span>
                ))}
            </div>

            {loading && <div className="pt-4"><StateRow>Chargement des utilisateurs…</StateRow></div>}
            {!loading && items.length === 0 && !error && (
                <div className="pt-4"><StateRow>Aucun utilisateur trouvé.</StateRow></div>
            )}

            {!loading &&
                items.map((u) => {
                    const r = ROLES.find((x) => x.value === u.role);
                    return (
                        <div key={u.id} className={`grid grid-cols-[40px_1.2fr_1.4fr_120px_80px] items-center gap-3 border-b py-3 last:border-b-0 ${t.rowBorder}`}>
                            <span className={t.cellMuted}>#{u.id}</span>
                            <span className={`${t.cellStrong} truncate`}>{userLabel(u)}</span>
                            <span className={`${t.cell} truncate`}>{u.email}</span>
                            <div><Badge tone={r?.tone ?? "slate"}>{r?.label ?? u.role}</Badge></div>
                            <RowActions onEdit={() => openEdit(u)} onDelete={() => setToDelete(u)} />
                        </div>
                    );
                })}

            <Modal
                open={open}
                title={editId == null ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
                onClose={() => setOpen(false)}
                footer={
                    <>
                        <Btn variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</Btn>
                        <Btn variant="primary" onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                        <Field label="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                    <Field label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Field
                        label={editId == null ? "Mot de passe" : "Mot de passe (laisser vide pour ne pas changer)"}
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <Select label="Rôle" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Select>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!toDelete}
                busy={deleting}
                message={`Supprimer le compte de « ${userLabel(toDelete ?? undefined)} » ?`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </Panel>
    );
}

/* ════════════════════════════════════════════════════════════
   PAGE GESTION — onglets
════════════════════════════════════════════════════════════ */
type TabKey = "categories" | "cours" | "certificats" | "inscriptions" | "utilisateurs";

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
    { key: "cours", label: "Cours", icon: <BookOpen size={16} /> },
    { key: "categories", label: "Catégories", icon: <LayoutGrid size={16} /> },
    { key: "certificats", label: "Certificats", icon: <Award size={16} /> },
    { key: "inscriptions", label: "Inscriptions", icon: <GraduationCap size={16} /> },
    { key: "utilisateurs", label: "Utilisateurs", icon: <Users size={16} /> },
];

export default function Gestion() {
    const { darkMode } = useSettings();
    const [tab, setTab] = useState<TabKey>("cours");

    return (
        <ToastProvider>
            <div className={`mx-auto max-w-[1000px] px-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Administration</p>
                    <h1 className={`mt-2 text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                        Gestion de la plateforme
                    </h1>
                </div>

                {/* Onglets */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {TABS.map((tb) => {
                        const active = tab === tb.key;
                        return (
                            <button
                                key={tb.key}
                                type="button"
                                onClick={() => setTab(tb.key)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    active
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50"
                                        : darkMode
                                            ? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                                            : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
                                }`}
                            >
                                {tb.icon}
                                {tb.label}
                            </button>
                        );
                    })}
                </div>

                {tab === "cours" && <CoursesManager />}
                {tab === "categories" && <CategoriesManager />}
                {tab === "certificats" && <CertificatesManager />}
                {tab === "inscriptions" && <EnrollmentsManager />}
                {tab === "utilisateurs" && <UsersManager />}
            </div>
        </ToastProvider>
    );
}
