import { Platform } from 'react-native';

/**
 * Injects global CSS for the web platform:
 * - Google Fonts
 * - Halftone dot background
 * - Header sunburst
 * - Pop Art hover/animation classes
 */
export function injectGlobalWebStyles(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const styleId = 'pop-art-global-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800;900&family=Fredoka:wght@600;700&display=swap');

    body {
      background-color: #FF99CC !important;
      font-family: 'Outfit', 'Fredoka', sans-serif !important;
      background-image: radial-gradient(rgba(0,0,0,0.15) 25%, transparent 26%), radial-gradient(rgba(0,0,0,0.15) 25%, transparent 26%) !important;
      background-size: 28px 28px !important;
      background-position: 0 0, 14px 14px !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    *, *::before, *::after {
      box-sizing: inherit !important;
    }
    #root, [data-testid="root"] {
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }

    .card-dots {
      background-image: radial-gradient(rgba(26, 115, 232, 0.8) 25%, transparent 26%), radial-gradient(rgba(26, 115, 232, 0.8) 25%, transparent 26%) !important;
      background-size: 16px 16px !important;
      background-position: 0 0, 8px 8px !important;
    }

    .header-sunburst {
      background-color: #1976D2 !important;
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 200'%3E%3Crect x='0' y='130' width='500' height='70' fill='%231565C0'/%3E%3Cpath d='M0 145 Q40 125 80 145 Q120 165 160 145 Q200 125 240 145 Q280 165 320 145 Q360 125 400 145 Q440 165 500 145 L500 200 L0 200 Z' fill='%231E88E5' stroke='%23001B4B' stroke-width='3'/%3E%3Cpath d='M0 160 Q50 140 100 160 Q150 180 200 160 Q250 140 300 160 Q350 180 400 160 Q450 140 500 160 L500 200 L0 200 Z' fill='%23FFFFFF' stroke='%23001B4B' stroke-width='2' fill-opacity='0.3'/%3E%3Crect x='0' y='170' width='500' height='30' fill='%23F5C842'/%3E%3Ccircle cx='310' cy='60' r='32' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Ccircle cx='345' cy='45' r='40' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Ccircle cx='390' cy='55' r='35' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Ccircle cx='430' cy='45' r='42' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Ccircle cx='465' cy='60' r='30' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Crect x='295' y='75' width='185' height='55' fill='%23FFF' stroke='%23001B4B' stroke-width='5'/%3E%3Cpolygon points='60,10 72,45 110,45 80,67 92,102 60,80 28,102 40,67 10,45 48,45' fill='%23E63B12' stroke='%23001B4B' stroke-width='4' stroke-linejoin='round'/%3E%3Cline x1='60' y1='55' x2='260' y2='10' stroke='%23FFE600' stroke-width='22' stroke-linecap='round' opacity='0.9'/%3E%3Cline x1='60' y1='55' x2='270' y2='50' stroke='%231565C0' stroke-width='22' stroke-linecap='round' opacity='0.9'/%3E%3Cline x1='60' y1='55' x2='265' y2='95' stroke='%23FFE600' stroke-width='18' stroke-linecap='round' opacity='0.9'/%3E%3Cline x1='60' y1='55' x2='255' y2='128' stroke='%23E63B12' stroke-width='18' stroke-linecap='round' opacity='0.9'/%3E%3Cpolygon points='60,10 72,45 110,45 80,67 92,102 60,80 28,102 40,67 10,45 48,45' fill='%23E63B12' stroke='%23001B4B' stroke-width='4' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-size: 100% 100% !important;
      background-position: center !important;
      border-bottom: 5px solid #001B4B !important;
    }

    .pop-button-hover {
      transition: all 0.15s ease-in-out !important;
    }
    .pop-button-hover:hover {
      transform: translate(-3px, -3px) !important;
      box-shadow: 7px 7px 0px #000000 !important;
    }
    .pop-button-hover:active {
      transform: translate(2px, 2px) !important;
      box-shadow: 2px 2px 0px #000000 !important;
    }

    .pop-card-hover {
      transition: all 0.2s ease-in-out !important;
    }
    .pop-card-hover:hover {
      transform: translateY(-5px) !important;
      box-shadow: 9px 9px 0px #000000 !important;
    }
  `;
  document.head.appendChild(style);
}
