import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { categoryData } from "../data";

export default function CategoryChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex-1 min-w-[230px]">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">
        Catégories de cours
      </h2>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={130} height={130}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%" cy="50%"
              innerRadius={38} outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <ul className="space-y-1.5 text-xs">
          {categoryData.map(c => (
            <li key={c.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-gray-500 w-24">{c.name}</span>
              <span className="font-semibold text-gray-700">{c.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
