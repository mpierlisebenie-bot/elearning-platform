# Dashboard Étudiants v2

Dashboard éducatif complet avec React 18 + TypeScript + Tailwind CSS + Recharts.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 🏗️ Build production

```bash
npm run build
npm run preview
```

## 📁 Structure

```
src/
├── components/
│   ├── StatCard.tsx            # KPI cards (cours inscrits, etc.)
│   ├── ProgressionChart.tsx    # Graphique en aires double courbe
│   ├── LearningTimeChart.tsx   # Barres colorées par matière
│   ├── CategoryChart.tsx       # Donut catégories de cours
│   ├── MesCours.tsx            # Tableau cours + barres de progression
│   └── TauxApprentissage.tsx   # Jauge donut 80%
├── data.ts                     # Toutes les données typées
├── App.tsx                     # Composant racine — importe tous les composants
├── main.tsx                    # Point d'entrée — monte <App /> uniquement
└── index.css                   # Tailwind base
```

## 🛠️ Stack

| Outil | Rôle |
|---|---|
| React 18 | UI |
| TypeScript | Typage statique |
| Tailwind CSS 3 | Styles utilitaires |
| Recharts | Graphiques (Area, Bar, Pie) |
| Vite | Bundler rapide |
