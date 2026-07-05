/**
 * adminUi.tsx — Briques d'interface réutilisables pour l'espace « Gestion ».
 * Tout est aligné sur le design du tableau de bord (indigo / slate / Sora)
 * et respecte le mode sombre via useSettings().
 */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useSettings } from "../../contexts/SettingsContext";

/* ═══════════════════════ Panneau (carte) ═══════════════════════ */
export function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
    const { darkMode } = useSettings();
    return (
        <div
            className={`rounded-2xl border ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            } ${className}`}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════ Boutons ═══════════════════════ */
type BtnVariant = "primary" | "ghost" | "danger" | "soft";
export function Btn({
    variant = "primary",
    children,
    className = "",
    ...rest
}: {
    variant?: BtnVariant;
    children: ReactNode;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { darkMode } = useSettings();
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";
    const styles: Record<BtnVariant, string> = {
        primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 hover:bg-indigo-700",
        soft: darkMode
            ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
        ghost: darkMode
            ? "text-slate-300 hover:bg-slate-800"
            : "text-slate-600 hover:bg-slate-100",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };
    return (
        <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
            {children}
        </button>
    );
}

/* ═══════════════════════ Champs de formulaire ═══════════════════════ */
const fieldShell = (darkMode: boolean) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-4 ${
        darkMode
            ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
            : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-100"
    }`;

function Label({ children }: { children: ReactNode }) {
    const { darkMode } = useSettings();
    return (
        <span
            className={`mb-1.5 block text-[11px] font-bold uppercase tracking-wider ${
                darkMode ? "text-slate-400" : "text-slate-500"
            }`}
        >
            {children}
        </span>
    );
}

export function Field({
    label,
    ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    const { darkMode } = useSettings();
    return (
        <label className="block">
            <Label>{label}</Label>
            <input className={fieldShell(darkMode)} {...rest} />
        </label>
    );
}

export function TextArea({
    label,
    ...rest
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const { darkMode } = useSettings();
    return (
        <label className="block">
            <Label>{label}</Label>
            <textarea className={`${fieldShell(darkMode)} resize-y min-h-[80px]`} {...rest} />
        </label>
    );
}

export function Select({
    label,
    children,
    ...rest
}: { label: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    const { darkMode } = useSettings();
    return (
        <label className="block">
            <Label>{label}</Label>
            <select className={`${fieldShell(darkMode)} cursor-pointer`} {...rest}>
                {children}
            </select>
        </label>
    );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    const { darkMode } = useSettings();
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative h-6 w-11 rounded-full transition-colors ${
                checked ? "bg-indigo-600" : darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-5" : ""
                }`}
            />
        </button>
    );
}

/* ═══════════════════════ Modale ═══════════════════════ */
export function Modal({
    open,
    title,
    onClose,
    children,
    footer,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}) {
    const { darkMode } = useSettings();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div
                role="dialog"
                aria-modal="true"
                className={`relative z-10 w-full max-w-lg rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                }`}
            >
                <div
                    className={`flex items-center justify-between border-b px-6 py-4 ${
                        darkMode ? "border-slate-800" : "border-slate-100"
                    }`}
                >
                    <h3 className={`text-lg font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                        className={`grid h-8 w-8 place-items-center rounded-lg text-lg transition-colors ${
                            darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"
                        }`}
                    >
                        ✕
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
                {footer && (
                    <div
                        className={`flex justify-end gap-2 border-t px-6 py-4 ${
                            darkMode ? "border-slate-800" : "border-slate-100"
                        }`}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════ Confirmation de suppression ═══════════════════════ */
export function ConfirmDialog({
    open,
    message,
    onConfirm,
    onCancel,
    busy,
}: {
    open: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    busy?: boolean;
}) {
    const { darkMode } = useSettings();
    return (
        <Modal
            open={open}
            title="Confirmer la suppression"
            onClose={onCancel}
            footer={
                <>
                    <Btn variant="ghost" onClick={onCancel} disabled={busy}>
                        Annuler
                    </Btn>
                    <Btn variant="danger" onClick={onConfirm} disabled={busy}>
                        {busy ? "Suppression…" : "Supprimer"}
                    </Btn>
                </>
            }
        >
            <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{message}</p>
        </Modal>
    );
}

/* ═══════════════════════ États (vide / chargement / erreur) ═══════════════════════ */
export function StateRow({ children }: { children: ReactNode }) {
    const { darkMode } = useSettings();
    return (
        <div
            className={`rounded-xl border border-dashed px-4 py-8 text-center text-sm ${
                darkMode ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
            }`}
        >
            {children}
        </div>
    );
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
        </div>
    );
}

/* ═══════════════════════ Badge ═══════════════════════ */
export function Badge({ tone, children }: { tone: "green" | "amber" | "red" | "indigo" | "slate"; children: ReactNode }) {
    const tones: Record<string, string> = {
        green: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-600",
        indigo: "bg-indigo-50 text-indigo-600",
        slate: "bg-slate-100 text-slate-600",
    };
    return (
        <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>
            {children}
        </span>
    );
}

/* ═══════════════════════ Toasts ═══════════════════════ */
type ToastTone = "success" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };
type ToastCtx = { push: (message: string, tone?: ToastTone) => void };

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const push = useCallback((message: string, tone: ToastTone = "success") => {
        const id = Date.now() + Math.random();
        setItems((prev) => [...prev, { id, message, tone }]);
        window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
    }, []);

    return (
        <ToastContext.Provider value={{ push }}>
            {children}
            <div className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={`rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 ${
                            t.tone === "success" ? "bg-emerald-600" : "bg-red-600"
                        }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
    return ctx;
}

/* ═══════════════════════ Hook de chargement de liste ═══════════════════════ */
export function useAsyncList<T>(loader: () => Promise<T[]>) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setItems(await loader());
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { items, loading, error, refresh, setItems };
}
