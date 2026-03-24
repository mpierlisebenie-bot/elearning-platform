import type { StatCard as StatCardType } from "../data";

export default function StatCard({ label, value, bg }: StatCardType) {
  return (
    <div className={`rounded-2xl px-5 py-4 ${bg} flex-1 min-w-[130px]`}>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
