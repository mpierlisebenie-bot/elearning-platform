import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from "recharts";
import { learningTimeData } from "../data";

const fmt = (v: number) => v === 0 ? "0" : `${Math.round(v / 1000)}K`;

function RoundedBar(props: Record<string, unknown>) {
  const { x, y, width, height, fill } = props as {
    x: number; y: number; width: number; height: number; fill: string;
  };
  return <rect x={x} y={y} width={width} height={height} rx={6} ry={6} fill={fill} />;
}

export default function LearningTimeChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[260px]">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        Temps d'apprentissage par matière
      </h2>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={learningTimeData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: number) => fmt(v)} />
          <Bar dataKey="hours" shape={<RoundedBar />}>
            {learningTimeData.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
