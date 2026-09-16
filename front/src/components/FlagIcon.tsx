import { useId } from "react";

/**
 * SVG bayrak. Emoji bayrakları Windows Chrome'da render edilmediği için
 * (harf koduna düşüyor) çizim satır içinde tutulur; her tarayıcıda aynı görünür.
 */
export default function FlagIcon({
  country,
  className,
}: {
  country: "tr" | "gb";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  if (country === "tr") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={className}
        role="img"
        aria-label="Türkçe"
        style={{ height: "1em", width: "auto", display: "block", borderRadius: "3px", boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" }}
      >
        <rect width="60" height="40" rx="4" fill="#E30A17" />
        <circle cx="25" cy="20" r="10" fill="#fff" />
        <circle cx="28.5" cy="20" r="8" fill="#E30A17" />
        <polygon
          fill="#fff"
          points="37,15 38.47,17.98 41.76,18.46 39.38,20.77 39.94,24.05 37,22.5 34.06,24.05 34.62,20.77 32.24,18.46 35.53,17.98"
        />
      </svg>
    );
  }

  // Birleşik Krallık (İngilizce için). id'ler aynı sayfada iki kez render
  // edildiğinde çakışmasın diye useId ile benzersiz.
  const round = `r${uid}`;
  const diag = `d${uid}`;
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      role="img"
      aria-label="English"
      style={{ height: "1em", width: "auto", display: "block", borderRadius: "3px", boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" }}
    >
      <defs>
        <clipPath id={round}>
          <rect width="60" height="30" rx="4" />
        </clipPath>
        <clipPath id={diag}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${round})`}>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${diag})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
