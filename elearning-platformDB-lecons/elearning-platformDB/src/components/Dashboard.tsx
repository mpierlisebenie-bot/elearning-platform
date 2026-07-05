import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings, translationStrings } from "../contexts/SettingsContext";
import {
    enrollmentsApi,
    certificatesApi,
    weatherApi,
    lessonsApi,
    toYouTubeEmbed,
    type Enrollment,
    type Certificate,
    type Weather,
    type Lesson,
} from "../services/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts";


const progressionData = [
    { month: "Jan", current: 3000,  prev: 2000 },
    { month: "Fév", current: 8000,  prev: 4000 },
    { month: "Mar", current: 12000, prev: 6000 },
    { month: "Avr", current: 24000, prev: 9000 },
    { month: "Mai", current: 17000, prev: 13000 },
    { month: "Jun", current: 26000, prev: 16000 },
    { month: "Jul", current: 24000, prev: 19000 },
];

const subjectData = [
    { name: "Html",   value: 15000, color: "#a78bfa" },
    { name: "CSS",    value: 22000, color: "#34d399" },
    { name: "JS",     value: 17000, color: "#1e293b" },
    { name: "Python", value: 28000, color: "#60a5fa" },
    { name: "React",  value: 20000, color: "#86efac" },
    { name: "C",      value: 12000, color: "#c084fc" },
];

const categoryData = [
    { name: "Programmation", value: 52.1, color: "#4f46e5" },
    { name: "Design",        value: 22.8, color: "#a78bfa" },
    { name: "Data",          value: 13.9, color: "#34d399" },
    { name: "Marketing",     value: 11.2, color: "#fb923c" },
];

const learningRate = [
    { name: "Web",    value: 45, color: "#4f46e5" },
    { name: "Mobile", value: 32, color: "#60a5fa" },
    { name: "Design", value: 23, color: "#34d399" },
];

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
    const settings = useSettings();
    return (
        <div
            className={`relative flex-1 min-w-[140px] rounded-2xl px-5 py-4 border transition-colors ${
                settings.darkMode
                    ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200/70 hover:border-slate-300"
            }`}
        >
            <span
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ background: accent }}
            />
            <p className={`text-[10px] font-bold uppercase tracking-[0.18em] mb-2 ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>
                {label}
            </p>
            <p className={`tabular text-[28px] leading-none font-extrabold tracking-tight ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                {value}
            </p>
        </div>
    );
}

function LegendDot({ color, dashed, label }: { color: string; dashed: boolean; label: string }) {
    const settings = useSettings();
    return (
        <span className={`flex items-center gap-1.5 text-[11px] font-medium ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>
            <span
                className="inline-block w-5 h-0.5 rounded-full"
                style={{
                    background: dashed
                        ? `repeating-linear-gradient(to right,${color} 0,${color} 4px,transparent 4px,transparent 8px)`
                        : color,
                }}
            />
            {label}
        </span>
    );
}

/* ═══════════════════════════════════════════════
   CARD WRAPPER (shared visual shell)
═══════════════════════════════════════════════ */
function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
    const settings = useSettings();
    return (
        <div
            className={`rounded-2xl border ${
                settings.darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70"
            } ${className}`}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   WEATHER CARD — API externe Open-Meteo
   (exigence de l'examen : consommation d'une API
   externe gratuite, météo affichée sur le dashboard)
═══════════════════════════════════════════════ */
function WeatherCard() {
    const settings = useSettings();
    const [weather, setWeather] = useState<Weather | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        weatherApi
            .get() // Dakar par défaut
            .then((data) => {
                if (!cancelled) setWeather(data);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (error) return null; // le widget ne doit jamais bloquer le dashboard

    const muted = settings.darkMode ? "text-slate-400" : "text-slate-500";
    const strong = settings.darkMode ? "text-white" : "text-slate-900";

    return (
        <Card className="px-5 py-3.5 mb-4 flex items-center gap-4 flex-wrap">
            <span className="text-[26px]" aria-hidden>
                {weather ? weather.icone : "🌡️"}
            </span>
            {weather ? (
                <>
                    <div>
                        <p className={`leading-tight ${strong}`}>
                            <span className="font-display text-[22px] font-semibold tabular">
                                {Math.round(weather.temperature)}°C
                            </span>
                            <span className={`ml-2.5 text-[13px] font-semibold ${muted}`}>
                                {weather.description}
                            </span>
                        </p>
                        <p className={`mt-0.5 text-[11px] ${muted}`}>
                            {weather.ville} · Humidité {weather.humidite}% · Vent{" "}
                            {Math.round(weather.vitesseVent)} km/h
                        </p>
                    </div>
                    <span className={`ml-auto text-[9px] uppercase tracking-[0.22em] font-bold ${muted}`}>
                        Open-Meteo
                    </span>
                </>
            ) : (
                <p className={`text-sm ${muted}`}>Chargement de la météo…</p>
            )}
        </Card>
    );
}

function ProgressionSection() {
    const settings = useSettings();
    const strings = translationStrings[settings.language].dashboard;
    const [tab, setTab] = useState<string>(strings.progressionTabs[0]);
    const tooltipBorder = settings.darkMode ? "1px solid #334155" : "1px solid #e2e8f0";
    const tooltipBg = settings.darkMode ? "#0f172a" : "#fff";
    const textColor = settings.darkMode ? "#f8fafc" : "#0f172a";
    const mutedColor = settings.darkMode ? "#cbd5e1" : "#94a3b8";

    return (
        <Card className="p-6 mb-4">
            <div className="flex items-center gap-5 flex-wrap mb-4">
                <span className={`text-sm font-bold whitespace-nowrap ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                    {strings.progressionTitle}
                </span>

                <div className="flex items-center gap-4">
                    {[...strings.progressionTabs].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                                tab === t
                                    ? settings.darkMode
                                        ? "text-white border-indigo-400"
                                        : "text-indigo-600 border-indigo-600"
                                    : "text-slate-400 border-transparent hover:text-indigo-500"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <LegendDot color="#4f46e5" dashed={false} label="Cette année" />
                    <LegendDot color="#c7d2fe" dashed={true} label="L'année dernière" />
                </div>
            </div>
            

            <ResponsiveContainer width="100%" height={190}>
                <LineChart data={progressionData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
                    <YAxis
                        tick={{ fontSize: 10, fill: mutedColor }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                        ticks={[0, 10000, 20000, 30000]}
                    />
                    <Tooltip
                        formatter={(v) => (typeof v === "number" ? `${(v / 1000).toFixed(0)}k` : v)}
                        contentStyle={{ fontSize: 12, borderRadius: 12, border: tooltipBorder, background: tooltipBg, color: textColor, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    />
                    <Line type="monotone" dataKey="current" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="prev" stroke="#c7d2fe" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}

function SubjectChart() {
    const settings = useSettings();
    const strings = translationStrings[settings.language].dashboard;
    const textColor = settings.darkMode ? "#f8fafc" : "#0f172a";
    const mutedColor = settings.darkMode ? "#cbd5e1" : "#94a3b8";
    const tooltipBorder = settings.darkMode ? "1px solid #334155" : "1px solid #e2e8f0";
    const tooltipBg = settings.darkMode ? "#0f172a" : "#fff";

    return (
        <Card className="p-5 flex-1 min-w-[220px]">
            <p className={`text-sm font-bold mb-3 ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                {strings.subjectChartTitle}
            </p>
            <ResponsiveContainer width="100%" height={165}>
                <BarChart data={subjectData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barCategoryGap="30%">
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: mutedColor }} axisLine={false} tickLine={false} />
                    <YAxis
                        tick={{ fontSize: 10, fill: mutedColor }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                        ticks={[0, 10000, 20000, 30000]}
                    />
                    <Tooltip
                        formatter={(v) => (typeof v === "number" ? `${(v / 1000).toFixed(0)}k` : v)}
                        contentStyle={{ fontSize: 12, borderRadius: 12, border: tooltipBorder, background: tooltipBg, color: textColor }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {subjectData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

function CategoryChart() {
    const settings = useSettings();
    const strings = translationStrings[settings.language].dashboard;

    return (
        <Card className="p-5 flex-1 min-w-[220px]">
            <p className={`text-sm font-bold mb-4 ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                {strings.categoryChartTitle}
            </p>
            <div className="flex items-center gap-4">
                <PieChart width={120} height={120}>
                    <Pie
                        data={categoryData}
                        dataKey="value"
                        cx={55}
                        cy={55}
                        innerRadius={32}
                        outerRadius={54}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={3}
                        strokeWidth={0}
                    >
                        {categoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>

                <div className="flex flex-col gap-2.5">
                    {categoryData.map((c) => (
                        <div key={c.name} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                            <span className={`text-xs min-w-[80px] ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>{c.name}</span>
                            <span className={`text-xs font-bold ${settings.darkMode ? "text-white" : "text-slate-900"}`}>{c.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

function MyCourses({ enrollments, loading, onRefresh }: { enrollments?: Enrollment[]; loading?: boolean; onRefresh?: () => void }) {
    const settings = useSettings();
    const strings = translationStrings[settings.language].dashboard;
    const data = enrollments ?? [];
    const [selected, setSelected] = useState<Enrollment | null>(null);

    return (
        <Card className="p-6 flex-[3] min-w-[280px]">
            <p className={`text-base font-extrabold mb-4 ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                {strings.myCoursesTitle}
            </p>

            <div className={`grid grid-cols-[28px_1fr_150px_48px_76px] gap-2 pb-2 mb-1 border-b ${settings.darkMode ? "border-slate-800" : "border-slate-100"}`}>
                {["#", "Cours", "Progression", "Durée", ""].map((h, i) => (
                    <span key={i} className={`text-[11px] font-semibold ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {h}
                    </span>
                ))}
            </div>

            {loading && (
                <p className={`py-4 text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>Chargement…</p>
            )}

            {!loading && data.length === 0 && (
                <p className={`py-4 text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Aucun cours suivi pour l'instant. Inscrivez-vous depuis le catalogue.
                </p>
            )}

            {!loading && data.map((e, idx) => {
                const color = BAR_COLORS[idx % BAR_COLORS.length];
                const done = e.statut === "termine" || e.progression >= 100;
                return (
                    <div
                        key={e.id}
                        className={`grid grid-cols-[28px_1fr_150px_48px_76px] gap-2 items-center py-2.5 border-b last:border-b-0 ${
                            settings.darkMode ? "border-slate-800/60" : "border-slate-50"
                        }`}
                    >
                        <span className={`text-xs font-medium ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>
                            {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className={`text-sm font-semibold truncate ${settings.darkMode ? "text-slate-100" : "text-slate-800"}`}>
                            {e.course?.titre ?? "Cours"}
                        </span>

                        <div className="flex items-center gap-2">
                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${settings.darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${e.progression}%`, background: color }} />
                            </div>
                            <span className={`text-[10px] min-w-[26px] text-right ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>{Math.round(e.progression)}%</span>
                        </div>

                        <span
                            className={`text-[11px] font-bold rounded-lg px-2 py-1 text-center ${
                                settings.darkMode ? "bg-slate-800 text-slate-300" : "bg-indigo-50 text-indigo-600"
                            }`}
                        >
                            {e.course?.dureeHeures ?? 0}h
                        </span>

                        <button
                            type="button"
                            onClick={() => setSelected(e)}
                            className={`text-[11px] font-bold rounded-lg px-2.5 py-1.5 transition-colors ${
                                done
                                    ? settings.darkMode
                                        ? "bg-slate-800 text-emerald-300"
                                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        >
                            {done ? "Revoir" : "Suivre"}
                        </button>
                    </div>
                );
            })}

            {selected && (
                <CoursePlayer
                    enrollment={selected}
                    onClose={() => setSelected(null)}
                    onUpdated={() => onRefresh?.()}
                />
            )}
        </Card>
    );
}

/* ═══════════════════════════════════════════════
   COURSE PLAYER — les leçons réelles du cours
   (vidéo YouTube + contenu écrit). Chaque leçon
   validée met à jour la progression via
   PUT /enrollments/:id. Si le cours n'a pas encore
   de leçons, des chapitres génériques sont affichés.
═══════════════════════════════════════════════ */
function CoursePlayer({
    enrollment,
    onClose,
    onUpdated,
}: {
    enrollment: Enrollment;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const settings = useSettings();
    const dark = settings.darkMode;
    const course = enrollment.course;

    const [lessons, setLessons] = useState<Lesson[] | null>(null); // null = chargement
    const [progress, setProgress] = useState(enrollment.progression);
    const [activeIdx, setActiveIdx] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Charger les leçons réelles du cours
    useEffect(() => {
        let cancelled = false;
        lessonsApi
            .getByCourse(course?.id ?? enrollment.id)
            .then((data) => {
                if (!cancelled) setLessons(data);
            })
            .catch(() => {
                if (!cancelled) setLessons([]); // pas bloquant : repli générique
            });
        return () => {
            cancelled = true;
        };
    }, [course?.id, enrollment.id]);

    const hasLessons = (lessons?.length ?? 0) > 0;
    // Nombre d'étapes : leçons réelles, sinon chapitres dérivés de la durée
    const nbSteps = hasLessons
        ? (lessons as Lesson[]).length
        : Math.min(10, Math.max(3, Math.round(course?.dureeHeures || 4)));
    const step = 100 / nbSteps;
    const doneCount = Math.min(nbSteps, Math.round(progress / step));
    const isFinished = progress >= 100;

    // Leçon affichée : la prochaine à faire par défaut
    useEffect(() => {
        setActiveIdx(Math.min(doneCount, nbSteps - 1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessons]);

    const activeLesson = hasLessons ? (lessons as Lesson[])[activeIdx] : null;
    const embedUrl = toYouTubeEmbed(activeLesson?.videoUrl);

    const save = async (value: number) => {
        setSaving(true);
        setError("");
        try {
            const v = Math.min(100, Math.round(value));
            await enrollmentsApi.update(enrollment.id, {
                progression: v,
                statut: v >= 100 ? "termine" : "en_cours",
            });
            setProgress(v);
            onUpdated();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const stepTitle = (i: number) =>
        hasLessons ? (lessons as Lesson[])[i].titre : `Chapitre ${i + 1}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm" onClick={onClose}>
            <div
                className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
                onClick={(ev) => ev.stopPropagation()}
            >
                {/* En-tête du lecteur */}
                <div className="relative px-7 pt-5 pb-4 bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#4f46e5] text-white flex-shrink-0">
                    <span className="absolute inset-x-7 bottom-0 h-[2px] rounded-t-full bg-gradient-to-r from-[#c9a24b]/90 to-transparent" />
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-indigo-200/80 mb-1">
                                Lecteur de cours
                            </p>
                            <h3 className="font-display text-[20px] font-semibold leading-tight">{course?.titre}</h3>
                            <p className="mt-0.5 text-[11px] text-indigo-200/80">
                                {course?.instructeur} · {nbSteps} {hasLessons ? "leçons" : "chapitres"}
                            </p>
                        </div>
                        <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80">✕</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-7 py-5">
                    {lessons === null && (
                        <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Chargement des leçons…</p>
                    )}

                    {/* ── Leçon active : vidéo + contenu écrit ── */}
                    {activeLesson && (
                        <div className="mb-6">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
                                Leçon {activeIdx + 1} / {nbSteps}
                            </p>
                            <h4 className={`font-display text-[19px] font-semibold mb-3 ${dark ? "text-white" : "text-slate-900"}`}>
                                {activeLesson.titre}
                            </h4>

                            {embedUrl && (
                                <div className="relative w-full rounded-xl overflow-hidden mb-4" style={{ paddingTop: "56.25%" }}>
                                    <iframe
                                        src={embedUrl}
                                        title={activeLesson.titre}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {activeLesson.contenu && (
                                <p className={`text-[13.5px] leading-relaxed whitespace-pre-line ${dark ? "text-slate-300" : "text-slate-600"}`}>
                                    {activeLesson.contenu}
                                </p>
                            )}

                            {!embedUrl && !activeLesson.contenu && (
                                <p className={`text-[13px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                                    Cette leçon n'a pas encore de contenu.
                                </p>
                            )}
                        </div>
                    )}

                    {lessons !== null && !hasLessons && course?.description && (
                        <p className={`text-[13px] leading-relaxed mb-5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                            {course.description}
                        </p>
                    )}

                    {/* ── Sommaire ── */}
                    {lessons !== null && (
                        <div className="space-y-2">
                            {Array.from({ length: nbSteps }, (_, i) => {
                                const state = i < doneCount ? "done" : i === doneCount && !isFinished ? "current" : "locked";
                                const clickable = hasLessons && i <= doneCount;
                                const isActive = hasLessons && i === activeIdx;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => clickable && setActiveIdx(i)}
                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                            clickable ? "cursor-pointer" : ""
                                        } ${
                                            isActive
                                                ? dark ? "border-indigo-500/60 bg-indigo-500/10" : "border-indigo-300 bg-indigo-50/70"
                                                : state === "current"
                                                    ? dark ? "border-indigo-500/40 bg-indigo-500/5" : "border-indigo-200 bg-indigo-50/40"
                                                    : dark ? "border-slate-800" : "border-slate-100"
                                        }`}
                                    >
                                        <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                                                state === "done"
                                                    ? "bg-emerald-500 text-white"
                                                    : state === "current"
                                                        ? "bg-indigo-600 text-white"
                                                        : dark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"
                                            }`}
                                        >
                                            {state === "done" ? "✓" : i + 1}
                                        </span>
                                        <span
                                            className={`text-[13px] font-semibold flex-1 truncate ${
                                                state === "locked"
                                                    ? dark ? "text-slate-600" : "text-slate-400"
                                                    : dark ? "text-slate-100" : "text-slate-800"
                                            }`}
                                        >
                                            {stepTitle(i)}
                                        </span>
                                        {hasLessons && (
                                            <span className={`text-[10px] font-semibold flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                                                {(lessons as Lesson[])[i].dureeMinutes} min
                                            </span>
                                        )}
                                        {state === "current" && (
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    save((i + 1) * step);
                                                }}
                                                className="text-[11px] font-bold rounded-lg px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 flex-shrink-0"
                                            >
                                                {saving ? "…" : "Valider"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {error && <p className="mt-4 text-[12px] text-rose-500">{error}</p>}
                </div>

                {/* Pied : progression globale */}
                <div className={`px-7 py-4 border-t flex items-center gap-4 flex-shrink-0 ${dark ? "border-slate-800" : "border-slate-100"}`}>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                        <div
                            className="h-full rounded-full transition-all bg-gradient-to-r from-indigo-600 to-[#c9a24b]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={`tabular text-[13px] font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                        {Math.round(progress)}%
                    </span>
                    {isFinished ? (
                        <span className="text-[11px] font-bold text-emerald-500">Cours terminé 🎓</span>
                    ) : (
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => save(100)}
                            className={`text-[11px] font-bold rounded-lg px-3 py-1.5 border transition-colors disabled:opacity-60 ${
                                dark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Tout terminer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function LearningRateCard({ avgProgress = 0 }: { avgProgress?: number }) {
    const settings = useSettings();
    const trackColor = settings.darkMode ? "#1e293b" : "#f1f5f9";
    const strings = translationStrings[settings.language].dashboard;

    return (
        <Card className="p-6 flex-[2] min-w-[200px] flex flex-col items-center">
            <p className={`text-base font-extrabold self-start mb-1 ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                {strings.learningRateTitle}
            </p>

            <div className="relative w-[170px] h-[110px] mt-3">
                <PieChart width={170} height={110}>
                    <Pie data={[{ value: 1 }]} dataKey="value" cx={82} cy={85} startAngle={180} endAngle={0} innerRadius={52} outerRadius={70} strokeWidth={0}>
                        <Cell fill={trackColor} />
                    </Pie>
                    <Pie data={learningRate} dataKey="value" cx={82} cy={85} startAngle={180} endAngle={0} innerRadius={52} outerRadius={70} paddingAngle={2} strokeWidth={0}>
                        {learningRate.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>

                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                    <span className={`text-3xl font-black leading-none ${settings.darkMode ? "text-white" : "text-slate-900"}`}>{avgProgress}%</span>
                </div>
            </div>

            <div className="flex gap-3.5 mt-3 justify-center">
                {learningRate.map((d) => (
                    <span key={d.name} className={`flex items-center gap-1.5 text-[11px] ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        {d.name}
                    </span>
                ))}
            </div>
        </Card>
    );
}


type DashboardPage =
    | "profil"
    | "mes-cours"
    | "progression"
    | "certificats"
    | "parametres";

function ProfileSection() {
    const auth = useAuth();
    const settings = useSettings();
    const allStrings = translationStrings[settings.language];
    const strings = allStrings.dashboard;
    const fullName = auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : "";
    const initial = (auth.user?.firstName || auth.user?.email || "?").charAt(0).toUpperCase();
    const roleLabel: Record<string, string> = {
        user: allStrings.header.student,
        instructor: "Instructeur",
        admin: "Administrateur",
    };

    return (
        <Card className="overflow-hidden">
            {/* Bandeau — carte d'étudiant */}
            <div className="relative h-28 bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#4f46e5]">
                <span className="absolute inset-x-8 bottom-0 h-[2px] rounded-t-full bg-gradient-to-r from-[#c9a24b]/90 to-transparent" />
                <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 82% 20%, white 0, transparent 34%), radial-gradient(circle at 12% 110%, white 0, transparent 30%)",
                    }}
                />
                <p className="absolute top-5 right-7 text-[9px] font-bold uppercase tracking-[0.3em] text-indigo-200/80">
                    StudyLearn · Carte étudiant
                </p>
            </div>

            <div className="px-8 pb-9 -mt-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-display text-3xl font-semibold ring-4 ${settings.darkMode ? "ring-slate-900" : "ring-white"}`}>
                    {initial}
                </div>
                <h2 className={`font-display mt-4 text-[26px] font-semibold tracking-tight ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                    {fullName || strings.profileTitle}
                </h2>
                <p className={`mt-1.5 text-[13px] max-w-md ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {strings.profileDescription}
                </p>

                <div className="mt-7 grid sm:grid-cols-2 gap-3.5 w-full max-w-xl">
                    <div className={`rounded-xl px-4 py-3.5 border text-left ${settings.darkMode ? "bg-slate-800/40 border-slate-800" : "bg-[#fafaf7] border-slate-200/70"}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5 ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>Email</p>
                        <p className={`text-sm font-semibold truncate ${settings.darkMode ? "text-slate-100" : "text-slate-800"}`}>{auth.user?.email || "non défini"}</p>
                    </div>
                    <div className={`rounded-xl px-4 py-3.5 border text-left ${settings.darkMode ? "bg-slate-800/40 border-slate-800" : "bg-[#fafaf7] border-slate-200/70"}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5 ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>Statut</p>
                        <p className={`text-sm font-semibold inline-flex items-center gap-2 ${settings.darkMode ? "text-slate-100" : "text-slate-800"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
                            {roleLabel[auth.user?.role ?? "user"] ?? allStrings.header.student}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function DashboardCertificates({ certificates, loading }: { certificates?: Certificate[]; loading?: boolean }) {
    const settings = useSettings();
    const strings = translationStrings[settings.language];
    const data = certificates ?? [];

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString(settings.language === "en" ? "en-US" : settings.language === "es" ? "es-ES" : "fr-FR", {
                day: "2-digit", month: "short", year: "numeric",
            });
        } catch {
            return iso;
        }
    };

    return (
        <Card className="p-7 md:p-9 min-h-[360px]">
            <h2 className={`text-2xl font-extrabold ${settings.darkMode ? "text-white" : "text-slate-900"}`}>{strings.dashboard.certificatesTitle}</h2>
            <p className={`mt-3 mb-6 text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>{strings.dashboard.certificatesDescription}</p>

            {loading && (
                <p className={`text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>Chargement…</p>
            )}

            {!loading && data.length === 0 && (
                <p className={`text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Aucun certificat pour l'instant. Terminez un cours pour en obtenir un.
                </p>
            )}

            <div className="grid gap-3">
                {!loading && data.map((cert) => (
                    <div
                        key={cert.id}
                        className={`rounded-2xl p-4 border flex items-center justify-between transition-colors hover:border-indigo-200 ${
                            settings.darkMode ? "border-slate-800 hover:bg-slate-800/30" : "border-slate-100 hover:bg-indigo-50/30"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-lg">
                                🎓
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${settings.darkMode ? "text-white" : "text-slate-900"}`}>{cert.course?.titre ?? "Certificat"}</p>
                                <p className={`text-xs mt-0.5 ${settings.darkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    {cert.codeUnique} · {formatDate(cert.dateObtention)}
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">Validé</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function DashboardSettings() {
    const settings = useSettings();
    const strings = translationStrings[settings.language];
    const [saved, setSaved] = useState(false);

    const handleToggle = (key: "notifications" | "darkMode") => {
        if (key === "notifications") {
            settings.setNotifications(!settings.notifications);
            return;
        }
        settings.setDarkMode(!settings.darkMode);
    };

    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        settings.setLanguage(event.target.value as "fr" | "en" | "es");
    };

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
    };

    const rowClass = `rounded-2xl p-4 border flex justify-between items-center ${
        settings.darkMode ? "border-slate-800" : "border-slate-100"
    }`;
    const labelClass = `text-sm font-bold ${settings.darkMode ? "text-white" : "text-slate-900"}`;
    const descClass = `text-xs mt-1 ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`;
    const stateLabel = (on: boolean, onWord: string, offWord: string) => (on ? onWord : offWord);

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`w-11 h-6 rounded-full relative transition-colors ${checked ? "bg-indigo-600" : settings.darkMode ? "bg-slate-700" : "bg-slate-200"}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
        </button>
    );

    return (
        <Card className="p-7 md:p-9 min-h-[360px]">
            <h2 className={`text-2xl font-extrabold ${settings.darkMode ? "text-white" : "text-slate-900"}`}>{strings.dashboard.settingsTitle}</h2>
            <p className={`mt-3 mb-6 text-sm ${settings.darkMode ? "text-slate-400" : "text-slate-500"}`}>{strings.dashboard.settingsDescription}</p>

            <form onSubmit={handleSave} className="grid gap-4 max-w-xl">
                <div className={rowClass}>
                    <div>
                        <p className={labelClass}>{strings.dashboard.notifications}</p>
                        <p className={descClass}>{strings.dashboard.notificationsDescription}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${settings.darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {stateLabel(
                                settings.notifications,
                                settings.language === "fr" ? "Activées" : settings.language === "es" ? "Activadas" : "Enabled",
                                settings.language === "fr" ? "Désactivées" : settings.language === "es" ? "Desactivadas" : "Disabled"
                            )}
                        </span>
                        <Toggle checked={settings.notifications} onChange={() => handleToggle("notifications")} />
                    </div>
                </div>

                <div className={rowClass}>
                    <div>
                        <p className={labelClass}>{strings.dashboard.darkMode}</p>
                        <p className={descClass}>{strings.dashboard.darkModeDescription}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${settings.darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {stateLabel(
                                settings.darkMode,
                                settings.language === "fr" ? "Activé" : settings.language === "es" ? "Activado" : "Enabled",
                                settings.language === "fr" ? "Désactivé" : settings.language === "es" ? "Desactivado" : "Disabled"
                            )}
                        </span>
                        <Toggle checked={settings.darkMode} onChange={() => handleToggle("darkMode")} />
                    </div>
                </div>

                <div className={rowClass}>
                    <div>
                        <p className={labelClass}>{strings.dashboard.language}</p>
                        <p className={descClass}>{strings.dashboard.languageDescription}</p>
                    </div>
                    <select
                        value={settings.language}
                        onChange={handleLanguageChange}
                        className="min-w-[120px] rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-sm px-4 py-2.5 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-100"
                    >
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                    </select>
                </div>

                <div className="flex justify-end items-center gap-3 mt-1">
                    {saved && <span className="text-sm font-bold text-emerald-600">{strings.dashboard.savedMessage}</span>}
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {strings.dashboard.saveButton}
                    </button>
                </div>
            </form>
        </Card>
    );
}

/* ═══════════════════════════════════════════════
   HOOK — données réelles de l'utilisateur (backend)
═══════════════════════════════════════════════ */
const BAR_COLORS = ["#4f46e5", "#34d399", "#a78bfa", "#fb923c", "#60a5fa", "#ec4899"];

function useUserData() {
    const auth = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        if (!auth.user) return;
        setLoading(true);
        setError("");
        try {
            const [enr, cert] = await Promise.all([
                enrollmentsApi.getByUser(auth.user.id),
                certificatesApi.getByUser(auth.user.id),
            ]);
            setEnrollments(enr);
            setCertificates(cert);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [auth.user]);

    useEffect(() => {
        load();
    }, [load]);

    return { enrollments, certificates, loading, error, refresh: load };
}

function Dashboard({ currentPage }: { currentPage: DashboardPage }) {
    const settings = useSettings();
    const strings = translationStrings[settings.language];
    const { enrollments, certificates, loading, error, refresh } = useUserData();

    const pageTitle = {
        profil: strings.menu.profil,
        "mes-cours": strings.menu.mesCours,
        progression: strings.menu.progression,
        certificats: strings.menu.certificats,
        parametres: strings.menu.parametres,
    }[currentPage];

    // Statistiques dérivées des données réelles
    const total = enrollments.length;
    const completed = enrollments.filter((e) => e.statut === "termine").length;
    const inProgress = enrollments.filter((e) => e.statut === "en_cours").length;
    const avgProgress = total
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progression, 0) / total)
        : 0;
    const pad = (n: number) => String(n).padStart(2, "0");

    const renderContent = () => {
        switch (currentPage) {
            case "profil":
                return <ProfileSection />;
            case "mes-cours":
                return <MyCourses enrollments={enrollments} loading={loading} onRefresh={refresh} />;
            case "progression":
                return (
                    <>
                        <div className="flex gap-3.5 mb-4 flex-wrap">
                            <StatCard label="Cours inscrits" value={pad(total)} accent="#ec4899" />
                            <StatCard label="Cours terminés" value={pad(completed)} accent="#eab308" />
                            <StatCard label="En cours" value={pad(inProgress)} accent="#22c55e" />
                            <StatCard label="Certificats" value={pad(certificates.length)} accent="#8b5cf6" />
                        </div>
                        <ProgressionSection />
                        <div className="flex gap-3.5 mb-4 flex-wrap">
                            <SubjectChart />
                            <CategoryChart />
                        </div>
                        <div className="flex gap-3.5 flex-wrap">
                            <MyCourses enrollments={enrollments} loading={loading} onRefresh={refresh} />
                            <LearningRateCard avgProgress={avgProgress} />
                        </div>
                    </>
                );
            case "certificats":
                return <DashboardCertificates certificates={certificates} loading={loading} />;
            case "parametres":
                return <DashboardSettings />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <div className="px-1 py-1 max-w-[900px] mx-auto box-border">
            <div className="flex justify-between items-end gap-3.5 mb-6 flex-wrap">
                <div>
                    <p className={`text-[10px] font-bold tracking-[0.24em] uppercase ${settings.darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        Tableau de bord
                    </p>
                    <h1 className={`font-display mt-2 text-[32px] leading-none font-semibold tracking-tight ${settings.darkMode ? "text-white" : "text-slate-900"}`}>
                        {pageTitle}
                    </h1>
                    <span className="title-rule" />
                </div>
                <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-colors disabled:opacity-60 ${
                        settings.darkMode
                            ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                            : "border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
                    }`}
                >
                    {loading ? "Chargement…" : "Rafraîchir"}
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            <WeatherCard />

            {renderContent()}
        </div>
    );
}

export default Dashboard;
