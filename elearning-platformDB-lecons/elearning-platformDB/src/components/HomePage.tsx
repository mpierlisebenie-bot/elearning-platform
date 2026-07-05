import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Code2, Palette, BarChart3, ShieldCheck, Smartphone, Cloud, Check } from "lucide-react"
import { useSettings } from "../contexts/SettingsContext"

/**
 * StudyLearn — Design system
 * ---------------------------------------------------
 * Concept: "le relevé de notes" — an academic transcript / course
 * ledger aesthetic. StudyLearn is treated less like a SaaS product
 * and more like an institution with a real catalog, real credits,
 * real cohorts. The signature element is the scrolling transcript
 * ticker beneath the hero — a literal, moving course ledger.
 *
 * Palette
 *  --ink     #14110F  primary text / headings
 *  --paper   #FAF7F1  page background
 *  --gold    #B8862E  primary accent (credits, CTA)
 *  --forest  #1F4439  secondary accent (depth, CTA band)
 *  --stone   #6E665C  secondary text
 *  --line    #E4DFD5  hairline borders / dividers
 *
 * Type
 *  Display — Fraunces (serif, used sparingly, italic for emphasis)
 *  Body    — Inter
 *  Utility — IBM Plex Mono (course codes, credit counts, labels)
 */

const CATALOG = [
    {
        code: "WEB",
        icon: Code2,
        label: "Développement Web",
        count: 142,
        detail: "JavaScript, React, architecture back-end",
    },
    {
        code: "UXD",
        icon: Palette,
        label: "Design & UX",
        count: 89,
        detail: "Recherche utilisateur, prototypage, design system",
    },
    {
        code: "DTA",
        icon: BarChart3,
        label: "Data & IA",
        count: 201,
        detail: "Machine learning, statistiques, ingénierie de données",
    },
    {
        code: "SEC",
        icon: ShieldCheck,
        label: "Cybersécurité",
        count: 67,
        detail: "Pentest, gouvernance, sécurité des systèmes",
    },
    {
        code: "MOB",
        icon: Smartphone,
        label: "Mobile",
        count: 95,
        detail: "iOS, Android, applications multiplateformes",
    },
    {
        code: "OPS",
        icon: Cloud,
        label: "Cloud & DevOps",
        count: 113,
        detail: "Infrastructure, CI/CD, observabilité",
    },
]

const TRANSCRIPT = CATALOG.flatMap((c) => [
    `${c.code}-${c.count.toString().padStart(3, "0")}`,
    `${c.count} cr.`,
    "•",
])

const STATS = [
    { value: "48 000+", label: "Apprenants actifs" },
    { value: "600+", label: "Cours au catalogue" },
    { value: "98 %", label: "Taux de satisfaction" },
    { value: "4,8 / 5", label: "Note moyenne" },
]

const STEPS = [
    {
        mark: "I.",
        title: "Choisissez votre filière",
        body: "Parcourez six domaines et plus de 600 cours conçus avec des praticiens en activité.",
    },
    {
        mark: "II.",
        title: "Suivez votre cursus",
        body: "Modules courts, projets concrets, évaluations — à votre rythme, sans date limite.",
    },
    {
        mark: "III.",
        title: "Obtenez votre certificat",
        body: "Un crédit reconnu à faire valoir auprès des recruteurs et de votre réseau.",
    },
]

const PLANS = [
    {
        code: "DÉC",
        name: "Découverte",
        price: "Gratuit",
        period: "",
        tagline: "Pour explorer la plateforme",
        features: [
            "Accès au catalogue complet",
            "3 cours d'initiation offerts",
            "Accès à la communauté",
            "Suivi de progression de base",
        ],
        cta: "Commencer",
        action: "inscription",
        featured: false,
    },
    {
        code: "ÉTU",
        name: "Étudiant",
        price: "50 000 FCFA",
        period: "/ mois",
        tagline: "Le cursus complet, sans limite",
        features: [
            "Tous les cours, tous les niveaux",
            "Certificat à chaque cursus terminé",
            "Projets pratiques évalués",
            "Suivi personnalisé et statistiques",
            "Nouveaux cours chaque trimestre",
        ],
        cta: "Créer un compte",
        action: "inscription",
        featured: true,
    },
    {
        code: "ÉTB",
        name: "Établissement",
        price: "Sur devis",
        period: "",
        tagline: "Pour les écoles et entreprises",
        features: [
            "Comptes illimités pour vos apprenants",
            "Tableau de bord administrateur",
            "Gestion des cours et des cohortes",
            "Support pédagogique dédié",
        ],
        cta: "Nous contacter",
        action: "contact",
        featured: false,
    },
]

export default function HomePage() {
    const navigate = useNavigate()
    const { darkMode } = useSettings()
    const heroRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    const scrollToId = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    const goCatalogue = (cat?: string) =>
        navigate(cat ? `/catalogue?cat=${encodeURIComponent(cat)}` : "/catalogue")

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60)
        return () => clearTimeout(t)
    }, [])

    return (
        <div
            className="min-h-screen overflow-x-hidden"
            data-theme={darkMode ? "dark" : "light"}
            style={{ background: "var(--paper)", color: "var(--ink)", fontFamily: "'Inter', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root{
          --ink:#14110F; --paper:#FAF7F1; --gold:#B8862E; --forest:#1F4439; --stone:#6E665C; --line:#E4DFD5;
          --card:#ffffff; --nav:rgba(250,247,241,0.92);
          --brand-dark:#14110F; --brand-cream:#FAF7F1;
        }
        [data-theme="dark"]{
          --ink:#F3EDE3; --paper:#16130F; --gold:#D2A24E; --forest:#225041; --stone:#A89E90; --line:#2C2823;
          --card:#211C17; --nav:rgba(22,19,15,0.92);
        }

        @keyframes fadeUp { from { opacity:0; transform: translateY(26px); } to { opacity:1; transform:none; } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .fade-up { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }
        .d1{animation-delay:.05s} .d2{animation-delay:.18s} .d3{animation-delay:.31s} .d4{animation-delay:.44s}

        .serif { font-family:'Fraunces', serif; }
        .mono { font-family:'IBM Plex Mono', monospace; }

        .ticker-track{
          display:flex; width:max-content;
          animation: ticker 38s linear infinite;
        }
        @media (prefers-reduced-motion: reduce){ .ticker-track{ animation:none; } .fade-up{ animation:none; opacity:1; } }

        .catalog-card{ transition: border-color .25s ease, transform .25s ease, background .25s ease; }
        .catalog-card:hover{ border-color:var(--gold); transform: translateY(-4px); background:var(--card); }
        .catalog-card:hover .catalog-arrow{ transform: translateX(4px); opacity:1; }
        .catalog-arrow{ transition: all .25s ease; opacity:0; }

        .underline-grow{ position:relative; }
        .underline-grow::after{
          content:''; position:absolute; left:0; right:0; bottom:-6px; height:1px; background:var(--gold);
          transform: scaleX(0); transform-origin:left; transition: transform .3s ease;
        }
        .underline-grow:hover::after{ transform: scaleX(1); }
      `}</style>

            {/* NAV */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-5 sticky top-0 z-50 border-b" style={{ borderColor: "var(--line)", background: "var(--nav)", backdropFilter: "blur(8px)" }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: "var(--brand-dark)" }}>
                        <span className="serif text-sm text-white">S</span>
                    </div>
                    <span className="font-bold text-[15px] tracking-tight">STUDYLEARN</span>
                </div>

                <div className="hidden md:flex items-center gap-8 mono text-[11px] uppercase tracking-widest" style={{ color: "var(--stone)" }}>
                    <button type="button" aria-label="Voir le catalogue" onClick={() => goCatalogue()} className="underline-grow hover:text-[var(--ink)] transition-colors">Catalogue</button>
                    <button type="button" aria-label="Méthode" onClick={() => scrollToId("methode")} className="underline-grow hover:text-[var(--ink)] transition-colors">Méthode</button>
                    <button type="button" aria-label="Tarifs" onClick={() => scrollToId("tarifs")} className="underline-grow hover:text-[var(--ink)] transition-colors">Tarifs</button>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        aria-label="Se connecter"
                        onClick={() => navigate("/login")}
                        className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                    >
                        Connexion
                    </button>
                    <button
                        type="button"
                        aria-label="S'inscrire"
                        onClick={() => navigate("/inscription")}
                        className="px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                        style={{ background: "var(--brand-dark)" }}
                    >
                        S'inscrire
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section ref={heroRef} className="relative px-6 md:px-10 pt-20 pb-16 max-w-[1180px] mx-auto">
                <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 items-end">
                    <div>
                        {visible && (
                            <>
                                <div className="fade-up d1 flex items-center gap-3 mb-8 mono text-[11px] uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                                    Catalogue 2026 — admissions ouvertes
                                </div>

                                <h1 className="fade-up d2 serif text-[2.75rem] md:text-[4.5rem] leading-[1.04] tracking-tight mb-7">
                                    Apprenez ce qui
                                    <br />
                                    <span style={{ fontStyle: "italic", color: "var(--forest)" }}>compte vraiment.</span>
                                </h1>

                                <p className="fade-up d3 text-[17px] md:text-lg max-w-lg leading-relaxed mb-10" style={{ color: "var(--stone)" }}>
                                    Des formations conçues avec des praticiens en activité, pensées
                                    pour des résultats mesurables. Rejoignez la plus grande
                                    communauté d'apprenants francophones.
                                </p>

                                <div className="fade-up d4 flex flex-wrap items-center gap-4">
                                    <button
                                        type="button"
                                        aria-label="Commencer gratuitement"
                                        onClick={() => navigate("/inscription")}
                                        className="group inline-flex items-center gap-2 px-7 py-4 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                                        style={{ background: "var(--forest)" }}
                                    >
                                        Commencer gratuitement
                                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Voir le catalogue"
                                        onClick={() => goCatalogue()}
                                        className="px-7 py-4 text-[14px] font-semibold border transition-colors hover:bg-[var(--card)]"
                                        style={{ borderColor: "var(--line)" }}
                                    >
                                        Voir le catalogue
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mini transcript preview card — echoes the ledger motif */}
                    <div className="hidden md:block border p-6" style={{ borderColor: "var(--line)" }}>
                        <div className="mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--stone)" }}>
                            Relevé — semestre en cours
                        </div>
                        <ul className="space-y-3">
                            {CATALOG.slice(0, 4).map((c) => (
                                <li key={c.code} className="flex items-center justify-between text-[13px] border-b pb-3" style={{ borderColor: "var(--line)" }}>
                                    <span className="mono" style={{ color: "var(--stone)" }}>{c.code}</span>
                                    <span className="font-medium">{c.label}</span>
                                    <span className="mono" style={{ color: "var(--gold)" }}>{c.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* TRANSCRIPT TICKER — signature element */}
            <div className="overflow-hidden border-y" style={{ borderColor: "var(--brand-dark)", background: "var(--brand-dark)" }}>
                <div className="ticker-track py-3.5">
                    {[...TRANSCRIPT, ...TRANSCRIPT].map((item, i) => (
                        <span key={i} className="mono text-[12px] mx-4 whitespace-nowrap" style={{ color: item === "•" ? "var(--gold)" : "#FAF7F1" }}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 max-w-[1180px] mx-auto">
                {STATS.map((s, i) => (
                    <div
                        key={s.label}
                        className="flex flex-col items-start py-12 px-6 md:px-10 border-b"
                        style={{ borderColor: "var(--line)", borderLeft: i !== 0 ? "1px solid var(--line)" : "none" }}
                    >
                        <span className="serif text-3xl md:text-4xl" style={{ color: "var(--forest)" }}>{s.value}</span>
                        <span className="mono text-[10px] mt-2 uppercase tracking-widest" style={{ color: "var(--stone)" }}>{s.label}</span>
                    </div>
                ))}
            </section>

            {/* CATALOG */}
            <section id="catalogue" className="px-6 md:px-10 py-24 max-w-[1180px] mx-auto">
                <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
                    <div>
                        <p className="mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                            Filières
                        </p>
                        <h2 className="serif text-3xl md:text-[2.75rem] tracking-tight">
                            Le catalogue, par domaine
                        </h2>
                    </div>
                    <p className="max-w-xs text-[14px]" style={{ color: "var(--stone)" }}>
                        Six filières, plus de 600 cours, mis à jour chaque trimestre par notre comité pédagogique.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border" style={{ borderColor: "var(--line)" }}>
                    {CATALOG.map((c, i) => {
                        const Icon = c.icon
                        return (
                            <div
                                key={c.label}
                                role="button"
                                tabIndex={0}
                                onClick={() => goCatalogue(c.label)}
                                onKeyDown={(e) => { if (e.key === "Enter") goCatalogue(c.label) }}
                                className="catalog-card p-8 cursor-pointer border-b border-r"
                                style={{
                                    borderColor: "var(--line)",
                                    borderRightWidth: (i + 1) % 3 === 0 ? 0 : 1,
                                }}
                            >
                                <div className="flex items-center justify-between mb-7">
                                    <span className="mono text-[11px]" style={{ color: "var(--gold)" }}>{c.code}</span>
                                    <Icon size={20} strokeWidth={1.5} style={{ color: "var(--forest)" }} />
                                </div>
                                <div className="font-semibold text-[17px] mb-1.5">{c.label}</div>
                                <div className="text-[13px] mb-5 leading-relaxed" style={{ color: "var(--stone)" }}>{c.detail}</div>
                                <div className="flex items-center justify-between">
                                    <span className="mono text-[12px]" style={{ color: "var(--stone)" }}>{c.count} cours</span>
                                    <ArrowRight size={14} className="catalog-arrow" style={{ color: "var(--gold)" }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* METHOD */}
            <section id="methode" className="px-6 md:px-10 py-20 max-w-[1180px] mx-auto border-t" style={{ borderColor: "var(--line)" }}>
                <p className="mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                    Méthode
                </p>
                <h2 className="serif text-3xl md:text-[2.75rem] tracking-tight mb-14 max-w-xl">
                    Un cursus, trois étapes
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                    {STEPS.map((s) => (
                        <div key={s.mark}>
                            <div className="serif text-2xl mb-4" style={{ color: "var(--forest)" }}>{s.mark}</div>
                            <div className="font-semibold text-[16px] mb-2">{s.title}</div>
                            <p className="text-[14px] leading-relaxed" style={{ color: "var(--stone)" }}>{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TARIFS */}
            <section id="tarifs" className="px-6 md:px-10 py-24 max-w-[1180px] mx-auto border-t" style={{ borderColor: "var(--line)" }}>
                <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
                    <div>
                        <p className="mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                            Tarifs
                        </p>
                        <h2 className="serif text-3xl md:text-[2.75rem] tracking-tight">
                            Trois formules, un seul cap
                        </h2>
                    </div>
                    <p className="max-w-xs text-[14px]" style={{ color: "var(--stone)" }}>
                        Sans engagement. Vous changez ou résiliez votre formule quand vous voulez.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 border" style={{ borderColor: "var(--line)" }}>
                    {PLANS.map((p, i) => (
                        <div
                            key={p.name}
                            className="p-8 md:p-10 flex flex-col border-b md:border-b-0"
                            style={{
                                borderColor: "var(--line)",
                                borderRightWidth: i !== PLANS.length - 1 ? 1 : 0,
                                background: p.featured ? "var(--forest)" : "transparent",
                                color: p.featured ? "#fff" : "var(--ink)",
                            }}
                        >
                            <div className="flex items-center justify-between mb-6 min-h-[24px]">
                                <span className="mono text-[11px]" style={{ color: "var(--gold)" }}>{p.code}</span>
                                {p.featured && (
                                    <span className="mono text-[10px] uppercase tracking-widest px-2 py-1" style={{ background: "var(--gold)", color: "var(--brand-dark)" }}>
                                        Le plus choisi
                                    </span>
                                )}
                            </div>

                            <h3 className="serif text-2xl mb-1">{p.name}</h3>
                            <p className="text-[13px] mb-6" style={{ color: p.featured ? "#C9D9CF" : "var(--stone)" }}>{p.tagline}</p>

                            <div className="flex items-baseline gap-1.5 mb-8">
                                <span className="serif text-3xl md:text-[2.5rem] leading-none">{p.price}</span>
                                {p.period && (
                                    <span className="mono text-[12px]" style={{ color: p.featured ? "#C9D9CF" : "var(--stone)" }}>{p.period}</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-9 flex-1">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                                        <Check size={15} strokeWidth={2} style={{ color: p.featured ? "var(--gold)" : "var(--forest)", marginTop: 2, flexShrink: 0 }} />
                                        <span style={{ color: p.featured ? "#F3F1EC" : "var(--ink)" }}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                aria-label={p.cta}
                                onClick={() =>
                                    p.action === "contact"
                                        ? (window.location.href = "mailto:contact@studylearn.app")
                                        : navigate("/inscription")
                                }
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
                                style={p.featured ? { background: "var(--gold)", color: "var(--brand-dark)" } : { background: "var(--brand-dark)", color: "#fff" }}
                            >
                                {p.cta}
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section id="admissions" className="px-6 md:px-10 pb-24 max-w-[1180px] mx-auto">
                <div
                    className="p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
                    style={{ background: "var(--forest)" }}
                >
                    <div>
                        <p className="mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "#C9D9CF" }}>
                            Admissions ouvertes
                        </p>
                        <h3 className="serif text-3xl md:text-[2.75rem] text-white leading-tight max-w-md">
                            Prêt à passer au <span style={{ fontStyle: "italic", color: "var(--gold)" }}>niveau supérieur</span> ?
                        </h3>
                    </div>
                    <button
                        type="button"
                        aria-label="Créer un compte"
                        onClick={() => navigate("/inscription")}
                        className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-[14px] shrink-0 transition-transform hover:-translate-y-0.5"
                        style={{ background: "var(--gold)", color: "var(--brand-dark)" }}
                    >
                        Créer un compte
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t" style={{ borderColor: "var(--line)", background: "var(--brand-dark)" }}>
                <div className="max-w-[1180px] mx-auto px-6 md:px-10 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
                        {/* Brand */}
                        <div className="col-span-2">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ background: "var(--brand-cream)" }}>
                                    <span className="serif text-sm" style={{ color: "var(--brand-dark)" }}>S</span>
                                </div>
                                <span className="font-bold text-[15px] tracking-tight text-white">STUDYLEARN</span>
                            </div>
                            <p className="text-[13.5px] leading-relaxed max-w-xs mb-6" style={{ color: "#9A938A" }}>
                                L'institution en ligne des praticiens francophones : un vrai catalogue,
                                de vrais crédits, de vrais résultats.
                            </p>
                            <p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                                Catalogue 2026 — admissions ouvertes
                            </p>
                        </div>

                        {/* Filières */}
                        <div>
                            <p className="mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#6E665C" }}>Filières</p>
                            <ul className="space-y-3 text-[13.5px]">
                                {["Développement Web", "Design & UX", "Data & IA", "Cybersécurité"].map((f) => (
                                    <li key={f}>
                                        <button type="button" onClick={() => goCatalogue(f)} className="hover:text-white transition-colors text-left" style={{ color: "#9A938A" }}>
                                            {f}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Plateforme */}
                        <div>
                            <p className="mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#6E665C" }}>Plateforme</p>
                            <ul className="space-y-3 text-[13.5px]">
                                <li><button type="button" onClick={() => goCatalogue()} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Catalogue</button></li>
                                <li><button type="button" onClick={() => scrollToId("methode")} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Méthode</button></li>
                                <li><button type="button" onClick={() => scrollToId("tarifs")} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Tarifs</button></li>
                                <li><button type="button" onClick={() => navigate("/login")} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Connexion</button></li>
                            </ul>
                        </div>

                        {/* Ressources */}
                        <div>
                            <p className="mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "#6E665C" }}>Ressources</p>
                            <ul className="space-y-3 text-[13.5px]">
                                <li><a href="mailto:contact@studylearn.app" className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Contact</a></li>
                                <li><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>CGU</button></li>
                                <li><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors" style={{ color: "#9A938A" }}>Confidentialité</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(228,223,213,0.12)" }}>
                        <span className="mono text-[11px]" style={{ color: "#6E665C" }}>© 2026 STUDYLEARN — TOUS DROITS RÉSERVÉS</span>
                        <span className="mono text-[11px]" style={{ color: "#6E665C" }}>Conçu à Dakar pour la communauté francophone</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}