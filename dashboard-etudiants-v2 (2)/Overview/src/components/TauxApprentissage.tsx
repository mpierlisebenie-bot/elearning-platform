import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { learningRateSegments } from "../data";

// Semi-circle trick: add a transparent "bottom half" so only top shows
const TOTAL = 100;
const filledData = [
  ...learningRateSegments,
  { name: "", value: TOTAL, color: "transparent" }, // hidden lower half
];

export default function TauxApprentissage() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[220px] flex flex-col items-center">
      <h2 className="text-sm font-semibold text-gray-800 mb-2 self-start">
        Taux d'apprentissage
      </h2>

      {/* Donut with centred % label */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filledData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={-180}
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {filledData.map((e, i) => (
                <Cell key={i} fill={e.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centred label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-800">80%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        {learningRateSegments.map(s => (
          <span key={s.name} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
