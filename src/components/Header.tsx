import iconPanneau from "../assets/icons/panneau.png";
import iconFavoris from "../assets/icons/favoris.png";
import iconCloche from "../assets/icons/cloche.png";
import iconRecherche from "../assets/icons/recherche.png";

type HeaderProps = {
  onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
    return (
        <header className="h-20 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button onClick={onMenuToggle} className="p-2 hover:bg-slate-100 rounded-xl transition-colors md:hidden">
                    <img src={iconPanneau} alt="Menu" className="w-5 h-5 opacity-70" />
                </button>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all w-72">
                    <img src={iconRecherche} alt="S" className="w-4 h-4 opacity-40" />
                    <input
                        type="text"
                        placeholder="Rechercher un cours..."
                        className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full font-medium"
                    />
                    <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-md bg-white">/</kbd>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2.5 hover:bg-slate-50 rounded-xl border border-slate-100 transition-all relative group">
                    <img src={iconCloche} alt="Notif" className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">Pierlise Benie</p>
                        <p className="text-[10px] font-medium text-indigo-600">Étudiant Premium</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-indigo-200 transition-all">
                        <img src={iconFavoris} alt="Profil" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}