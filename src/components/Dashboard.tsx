import { useState } from "react";
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

/* ═══════════════════════════════════════════════
   DONNÉES
═══════════════════════════════════════════════ */
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
    { name: "Programmation", value: 52.1, color: "#1e293b" },
    { name: "Design",        value: 22.8, color: "#a78bfa" },
    { name: "Data",          value: 13.9, color: "#34d399" },
    { name: "Marketing",     value: 11.2, color: "#fb923c" },
];

const courses = [
    { id: "01", title: "React pour débutants", progress: 80, duration: "08h", color: "#60a5fa" },
    { id: "02", title: "HTML & CSS",           progress: 65, duration: "05h", color: "#34d399" },
    { id: "03", title: "JavaScript",           progress: 40, duration: "10h", color: "#a78bfa" },
    { id: "04", title: "Langage C",            progress: 6,  duration: "08h", color: "#fb923c" },
];

const learningRate = [
    { name: "Web",    value: 45, color: "#a78bfa" },
    { name: "Mobile", value: 32, color: "#60a5fa" },
    { name: "Design", value: 23, color: "#34d399" },
];

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
function StatCard({
                      label,
                      value,
                      bg,
                  }: {
    label: string;
    value: string;
    bg: string;
}) {
    return (
        <div
            style={{
                background: bg,
                borderRadius: 14,
                padding: "16px 20px 18px",
                flex: 1,
                minWidth: 120,
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#64748b",
                    fontWeight: 500,
                    marginBottom: 6,
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: 0,
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                }}
            >
                {value}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   LEGEND DOT
═══════════════════════════════════════════════ */
function LegendDot({
                       color,
                       dashed,
                       label,
                   }: {
    color: string;
    dashed: boolean;
    label: string;
}) {
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#64748b",
            }}
        >
      <span
          style={{
              display: "inline-block",
              width: 22,
              height: 2,
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
   PROGRESSION SECTION
═══════════════════════════════════════════════ */
type Tab = "Cours terminés par mois" | "Temps d'apprentissage";

function ProgressionSection() {
    const [tab, setTab] = useState<Tab>("Cours terminés par mois");

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 24px 16px",
                marginBottom: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    flexWrap: "wrap",
                    marginBottom: 16,
                }}
            >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
          Pressions des étudiants
        </span>

                {(["Cours terminés par mois", "Temps d'apprentissage"] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: tab === t ? 700 : 400,
                            color: tab === t ? "#0f172a" : "#94a3b8",
                            padding: "2px 0",
                            borderBottom: tab === t ? "2px solid #0f172a" : "2px solid transparent",
                            transition: "all .15s",
                        }}
                    >
                        {t}
                    </button>
                ))}

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
                    <LegendDot color="#94a3b8" dashed={false} label="Cette année" />
                    <LegendDot color="#cbd5e1" dashed label="L'année dernière" />
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={175}>
                <LineChart
                    data={progressionData}
                    margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                >
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                        ticks={[0, 10000, 20000, 30000]}
                    />
                    <Tooltip
                        formatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="prev"
                        stroke="#cbd5e1"
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   SUBJECT BAR CHART
═══════════════════════════════════════════════ */
function SubjectChart() {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 20px 12px",
                flex: 1,
                minWidth: 200,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Temps d'apprentissage par matière
            </p>
            <ResponsiveContainer width="100%" height={155}>
                <BarChart
                    data={subjectData}
                    margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
                    barCategoryGap="30%"
                >
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}k`)}
                        ticks={[0, 10000, 20000, 30000]}
                    />
                    <Tooltip
                        formatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                        {subjectData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   CATEGORY DONUT CHART
═══════════════════════════════════════════════ */
function CategoryChart() {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "20px 20px 12px",
                flex: 1,
                minWidth: 200,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Catégories de cours
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                        paddingAngle={2}
                        strokeWidth={0}
                    >
                        {categoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>

                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {categoryData.map((c) => (
                        <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span
                  style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: c.color,
                      flexShrink: 0,
                  }}
              />
                            <span style={{ fontSize: 11, color: "#64748b", minWidth: 80 }}>{c.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{c.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MY COURSES TABLE
═══════════════════════════════════════════════ */
function MyCourses() {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "22px 24px",
                flex: 3,
                minWidth: 260,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Mes cours
            </p>

            {/* Table header */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr 160px 60px",
                    gap: 8,
                    paddingBottom: 8,
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: 4,
                }}
            >
                {["#", "Cours", "Progression", "Durée"].map((h) => (
                    <span key={h} style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
            {h}
          </span>
                ))}
            </div>

            {/* Rows */}
            {courses.map((c) => (
                <div
                    key={c.id}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr 160px 60px",
                        gap: 8,
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f8fafc",
                    }}
                >
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{c.id}</span>
                    <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{c.title}</span>

                    {/* Progress bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                flex: 1,
                                height: 6,
                                background: "#f1f5f9",
                                borderRadius: 99,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${c.progress}%`,
                                    height: "100%",
                                    background: c.color,
                                    borderRadius: 99,
                                }}
                            />
                        </div>
                        <span style={{ fontSize: 10, color: "#94a3b8", minWidth: 26, textAlign: "right" }}>
              {c.progress}%
            </span>
                    </div>

                    {/* Duration badge */}
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#475569",
                            background: "#f1f5f9",
                            borderRadius: 8,
                            padding: "3px 10px",
                            textAlign: "center",
                        }}
                    >
            {c.duration}
          </span>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   LEARNING RATE GAUGE
═══════════════════════════════════════════════ */
function LearningRateCard() {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                padding: "22px 24px",
                flex: 2,
                minWidth: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
        >
            <p
                style={{
                    margin: "0 0 4px",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                    alignSelf: "flex-start",
                }}
            >
                Taux d'apprentissage
            </p>

            {/* Gauge */}
            <div style={{ position: "relative", width: 170, height: 110, marginTop: 12 }}>
                <PieChart width={170} height={110}>
                    {/* BG track */}
                    <Pie
                        data={[{ value: 1 }]}
                        dataKey="value"
                        cx={82}
                        cy={85}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={52}
                        outerRadius={70}
                        strokeWidth={0}
                    >
                        <Cell fill="#f1f5f9" />
                    </Pie>

                    {/* Segments */}
                    <Pie
                        data={learningRate}
                        dataKey="value"
                        cx={82}
                        cy={85}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={52}
                        outerRadius={70}
                        paddingAngle={2}
                        strokeWidth={0}
                    >
                        {learningRate.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>

                {/* Centre label */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
            80%
          </span>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
                {learningRate.map((d) => (
                    <span
                        key={d.name}
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}
                    >
            <span
                style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }}
            />
                        {d.name}
          </span>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════ */
export default function Dashboard() {
    return (
        <div
            style={{
                fontFamily: "'DM Sans', 'Nunito', 'Segoe UI', sans-serif",
                background: "#f8fafc",
                minHeight: "100vh",
                padding: "28px 24px",
                maxWidth: 860,
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
                <StatCard label="Cours inscrits"     value="05" bg="#fce7f3" />
                <StatCard label="Cours terminés"     value="08" bg="#fef9c3" />
                <StatCard label="Nouveaux étudiants" value=""   bg="#dcfce7" />
                <StatCard label="Étudiants actifs"   value="35" bg="#ede9fe" />
            </div>

            {/* Progression */}
            <ProgressionSection />

            {/* Subject + Category */}
            <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
                <SubjectChart />
                <CategoryChart />
            </div>

            {/* Courses + Rate */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <MyCourses />
                <LearningRateCard />
            </div>
        </div>
    );
}