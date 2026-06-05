"use client";

import { useAccessibility } from "@/lib/accessibility-context";
import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";

export default function EpilepsyWarning() {
  const { hasSeenEpilepsyWarning, markEpilepsyWarningAsSeen, setSafeMode } = useAccessibility();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenEpilepsyWarning) {
      setIsVisible(true);
      // Scroll'u engelle
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasSeenEpilepsyWarning]);

  const handleContinueNormal = () => {
    setSafeMode(false);
    markEpilepsyWarningAsSeen();
    setIsVisible(false);
    // Scroll'u tekrar etkinleştir
    document.body.style.overflow = '';
  };

  const handleEnableSafeMode = () => {
    setSafeMode(true);
    markEpilepsyWarningAsSeen();
    setIsVisible(false);
    // Scroll'u tekrar etkinleştir
    document.body.style.overflow = '';
  };

  if (!isVisible) return null;

  return (
    <div className="epilepsy-warning-overlay ktn-scope">
      <div className="epilepsy-warning-modal">
        <div className="epilepsy-warning-icon">
          ⚠️
        </div>
        <h2 className="ktn-glitch" data-text={t.epilepsyWarning.title}>
          {t.epilepsyWarning.title}
        </h2>
        <p>{t.epilepsyWarning.description}</p>
        <div className="epilepsy-warning-buttons">
          <button 
            onClick={handleEnableSafeMode}
            className="ktn-btn btn-safe"
          >
            {t.epilepsyWarning.enableSafeMode}
          </button>
          <button 
            onClick={handleContinueNormal}
            className="ktn-btn btn-continue"
          >
            {t.epilepsyWarning.continueNormal}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .epilepsy-warning-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(10, 10, 15, 0.95);
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 999999 !important;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 1rem;
          overflow: hidden;
          pointer-events: auto !important;
        }

        .epilepsy-warning-overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 20%, rgba(122, 60, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255, 45, 85, 0.1) 0%, transparent 50%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .epilepsy-warning-modal {
          background: linear-gradient(145deg, #121421 0%, #1A1F2B 100%);
          border: 1.5px solid #7A3CFF;
          padding: 2.5rem;
          border-radius: 12px;
          max-width: 520px;
          width: 100%;
          margin: 1rem;
          text-align: center;
          box-shadow: 
            0 0 20px rgba(122, 60, 255, 0.3),
            0 20px 40px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #E8ECFF;
          position: relative !important;
          z-index: 1000000 !important;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          pointer-events: auto !important;
          transform: scale(1) !important;
          opacity: 1 !important;
        }

        .epilepsy-warning-modal::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
          border-radius: inherit;
          pointer-events: none;
        }

        .epilepsy-warning-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          animation: warning-glow 2s ease-in-out infinite alternate;
        }

        @keyframes warning-glow {
          0% { 
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
            transform: scale(1);
          }
          100% { 
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1));
            transform: scale(1.05);
          }
        }

        .epilepsy-warning-modal h2 {
          margin: 0 0 1.5rem 0;
          color: #FF2D55;
          font-size: 1.8rem;
          font-family: var(--font-display);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-shadow: 0 0 10px rgba(255, 45, 85, 0.5);
        }

        .epilepsy-warning-modal p {
          margin: 0 0 2.5rem 0;
          line-height: 1.7;
          color: #93A2B1;
          font-size: 1.1rem;
          font-weight: 400;
        }

        .epilepsy-warning-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-safe {
          background: linear-gradient(145deg, #4caf50, #45a049) !important;
          border-color: #4caf50 !important;
          box-shadow: 
            0 0 15px rgba(76, 175, 80, 0.4),
            0 4px 15px rgba(0, 0, 0, 0.3) !important;
        }

        .btn-safe:hover {
          transform: translateY(-2px) !important;
          box-shadow: 
            0 0 25px rgba(76, 175, 80, 0.6),
            0 8px 25px rgba(0, 0, 0, 0.4) !important;
        }

        .btn-continue {
          background: linear-gradient(145deg, rgba(122, 60, 255, 0.1), rgba(255, 45, 85, 0.05)) !important;
          border-color: #7A3CFF !important;
        }

        .btn-continue:hover {
          background: linear-gradient(145deg, rgba(122, 60, 255, 0.2), rgba(255, 45, 85, 0.1)) !important;
          transform: translateY(-2px) !important;
        }

        /* Güvenli mod için animasyonları devre dışı bırak */
        :global(body.safe-mode) .epilepsy-warning-overlay::before {
          animation: none !important;
        }

        :global(body.safe-mode) .epilepsy-warning-icon {
          animation: none !important;
          filter: none !important;
        }

        @media (max-width: 768px) {
          .epilepsy-warning-modal {
            padding: 1.5rem;
            margin: 0.5rem;
          }

          .epilepsy-warning-modal h2 {
            font-size: 1.5rem;
          }

          .epilepsy-warning-buttons {
            flex-direction: column;
            gap: 1rem;
          }

          .epilepsy-warning-buttons .ktn-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
