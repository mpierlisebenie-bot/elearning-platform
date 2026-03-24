import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { progressionData } from "../data";

type Tab = "Cours terminés par mois" | "Temps d'apprentissage";
const fmt = (v: number) => v === 0 ? "0" : `${Math.round(v / 1000)}K`;

export default function ProgressionChart() {
  const [active, setActive] = useState<Tab>("Cours terminés par mois");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
        <span className="text-sm font-semibold text-gray-800">
          Pregressions des étudiants
        </span>

        {(["Cours terminés par mois", "Temps d'apprentissage"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`text-xs transition-colors ${
              active === t ? "text-blue-500 font-semibold" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 inline-block" />
            Cette année
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-200 inline-block" />
            L'année dernière
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={progressionData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gThis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gLast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#bfdbfe" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: number) => fmt(v)} />
          <Area type="monotone" dataKey="lastYear"  stroke="#bfdbfe" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#gLast)" dot={false} />
          <Area type="monotone" dataKey="thisYear"  stroke="#475569" strokeWidth={1.5} fill="url(#gThis)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
