import StatCard          from "./components/StatCard";
import ProgressionChart  from "./components/ProgressionChart";
import LearningTimeChart from "./components/LearningTimeChart";
import CategoryChart     from "./components/CategoryChart";
import MesCours          from "./components/MesCours";
import TauxApprentissage from "./components/TauxApprentissage";
import { statCards }     from "./data";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 p-5">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* ── Row 1 : Stat cards ── */}
        <div className="flex gap-3 flex-wrap">
          {statCards.map(card => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Row 2 : Area chart ── */}
        <ProgressionChart />

        {/* ── Row 3 : Bar + Donut ── */}
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
          <LearningTimeChart />
          <CategoryChart />
        </div>

        {/* ── Row 4 : Mes cours + Taux ── */}
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
          <MesCours />
          <TauxApprentissage />
        </div>

      </div>
    </div>
  );
}
