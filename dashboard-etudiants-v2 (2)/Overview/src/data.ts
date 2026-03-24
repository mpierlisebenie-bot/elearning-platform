// ── Types ─────────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string;
  bg: string;
}

export interface ProgressionPoint {
  month: string;
  thisYear: number;
  lastYear: number;
}

export interface SubjectTime {
  subject: string;
  hours: number;
  color: string;
}

export interface Category {
  name: string;
  value: number;
  color: string;
}

export interface Course {
  id: string;
  title: string;
  progression: number;
  duration: string;
  barColor: string;
}

export interface LearningRateSegment {
  name: string;
  value: number;
  color: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const statCards: StatCard[] = [
  { label: "Cours inscrits",      value: "05", bg: "bg-rose-100"  },
  { label: "Cours terminés",      value: "08", bg: "bg-yellow-50" },
  { label: "Nouveaux étudiants",  value: "",   bg: "bg-green-50"  },
  { label: "Étudiants actifs",    value: "35", bg: "bg-blue-50"   },
];

export const progressionData: ProgressionPoint[] = [
  { month: "Jan", thisYear: 10000, lastYear: 8000  },
  { month: "Feb", thisYear: 13000, lastYear: 11000 },
  { month: "Mar", thisYear: 15000, lastYear: 14000 },
  { month: "Apr", thisYear: 22000, lastYear: 20000 },
  { month: "May", thisYear: 28000, lastYear: 25000 },
  { month: "Jun", thisYear: 20000, lastYear: 22000 },
  { month: "Jul", thisYear: 24000, lastYear: 26000 },
];

export const learningTimeData: SubjectTime[] = [
  { subject: "Html",   hours: 15000, color: "#93c5fd" },
  { subject: "CSS",    hours: 28000, color: "#2dd4bf" },
  { subject: "JS",     hours: 18000, color: "#1e293b" },
  { subject: "Python", hours: 30000, color: "#818cf8" },
  { subject: "React",  hours: 20000, color: "#c4b5fd" },
  { subject: "C",      hours: 25000, color: "#34d399" },
];

export const categoryData: Category[] = [
  { name: "Programation", value: 52.1, color: "#1e293b" },
  { name: "Design",       value: 22.8, color: "#a5b4fc" },
  { name: "Data",         value: 13.9, color: "#6ee7b7" },
  { name: "Marketing",    value: 11.2, color: "#bfdbfe" },
];

export const coursesData: Course[] = [
  { id: "01", title: "React pour débutants", progression: 65,  duration: "09h",  barColor: "bg-blue-400"   },
  { id: "02", title: "HTML & CSS",           progression: 80,  duration: "10h",  barColor: "bg-teal-400"   },
  { id: "03", title: "JavaScript",           progression: 45,  duration: "10h",  barColor: "bg-violet-400" },
  { id: "04", title: "Langage C",            progression: 30,  duration: "07h",  barColor: "bg-orange-400" },
];

export const learningRateSegments: LearningRateSegment[] = [
  { name: "Web",    value: 45, color: "#1e293b"  },
  { name: "Mobile", value: 35, color: "#a5b4fc"  },
  { name: "Design", value: 20, color: "#6ee7b7"  },
];
