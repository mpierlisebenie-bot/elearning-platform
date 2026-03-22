import iconPanneau from "../assets/icons/panneau.png";
import iconFavoris from "../assets/icons/favoris.png";
import iconHistorique from "../assets/icons/historique.png";
import iconCloche from "../assets/icons/cloche.png";
import iconRecherche from "../assets/icons/recherche.png";

type HeaderProps = {
  onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header
      style={{
        height: 64,
        width: "100%",
        borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        borderLeft: "0.5px solid rgba(0,0,0,0.1)",
        borderBottomLeftRadius: 12,
        paddingLeft: 16,
        paddingRight: 24,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      {/* Gauche : panneau + favoris + titre */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>

        {/* Icône panneau latéral */}
        <button
          onClick={onMenuToggle}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}
        >
          <img src={iconPanneau} alt="Panneau" style={{ width: 20, height: 20, objectFit: "contain" }} />
        </button>

        {/* Icône favoris — cachée sur mobile */}
        <button
          className="hidden sm:flex"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img src={iconFavoris} alt="Favoris" style={{ width: 20, height: 20, objectFit: "contain" }} />
        </button>

        {/* Titre — caché sur très petit écran */}
        <div
          className="hidden sm:flex"
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 36,
            minWidth: 36,
            minHeight: 36,
            borderRadius: 16,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "20px",
              color: "rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            StudyLearn Dashboard
          </span>
        </div>
      </div>

      {/* Droite : recherche + historique + cloche */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>

        {/* Barre de recherche — réduite sur mobile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            backgroundColor: "#0000000A",
            borderRadius: 12,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 12,
            paddingRight: 12,
            height: 36,
            opacity: 1,
            boxSizing: "border-box",
          }}
          className="w-32 sm:w-[220px]"
        >
          <img
            src={iconRecherche}
            alt="Recherche"
            style={{ width: 16, height: 16, objectFit: "contain", opacity: 0.4, flexShrink: 0 }}
          />
          <span
            className="hidden sm:block"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              color: "rgba(0,0,0,0.35)",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            Recherche un cours
          </span>

          {/* Raccourci / */}
          <div
            className="hidden sm:flex"
            style={{
              width: 20,
              height: 16,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "16px",
                color: "rgba(0,0,0,0.2)",
                textAlign: "center",
              }}
            >
              /
            </span>
          </div>
        </div>

        {/* Historique */}
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}
        >
          <img src={iconHistorique} alt="Historique" style={{ width: 20, height: 20, objectFit: "contain" }} />
        </button>

        {/* Cloche */}
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}
        >
          <img src={iconCloche} alt="Notifications" style={{ width: 20, height: 20, objectFit: "contain" }} />
        </button>
      </div>
    </header>
  );
}