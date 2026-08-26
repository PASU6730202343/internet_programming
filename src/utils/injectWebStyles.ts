import { Platform } from 'react-native';

/**
 * Injects global CSS for the web platform:
 * - Google Fonts (Press Start 2P pixel font + VT323)
 * - Minecraft pixel-art background with grass/dirt borders
 * - Animated torches, flowers, clouds
 * - Scrolling marquee
 * - Card hover effects
 */
export function injectGlobalWebStyles(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const styleId = 'minecraft-global-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

    /* ═══════════════════════════════════════════════════
       BASE
    ═══════════════════════════════════════════════════ */
    body {
      background-color: #1a1a2e !important;
      font-family: 'VT323', 'Press Start 2P', 'Courier New', monospace !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      image-rendering: pixelated !important;
      overflow-x: hidden !important;
    }

    /* Starry sky background */
    body::before {
      content: '' !important;
      position: fixed !important;
      inset: 0 !important;
      z-index: -2 !important;
      background: linear-gradient(180deg, #0a0a1a 0%, #1a2a3a 40%, #2a4a3a 70%, #1a3a2a 100%) !important;
    }

    *, *::before, *::after {
      box-sizing: inherit !important;
    }
    #root, [data-testid="root"] {
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }

    /* ═══════════════════════════════════════════════════
       MINECRAFT GRASS/DIRT TOP BORDER
    ═══════════════════════════════════════════════════ */
    .mc-top-border {
      position: relative;
      width: 100%;
      height: 48px;
      background:
        /* grass top layer */
        linear-gradient(180deg, #5b8731 0%, #4a7328 8px, #3d6120 8px, #3d6120 12px,
        /* dirt layers */
        #8b6740 12px, #8b6740 16px,
        #7a5a38 16px, #7a5a38 20px,
        #6e5030 20px, #6e5030 24px,
        #624828 24px, #624828 28px,
        #5a4020 28px, #5a4020 32px,
        #4e3818 32px, #4e3818 36px,
        #3d2b12 36px, #3d2b12 40px,
        #2d1f0c 40px, #2d1f0c 48px) !important;
      image-rendering: pixelated;
      z-index: 10;
    }

    /* Pixel grass tufts on top */
    .mc-top-border::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 0;
      right: 0;
      height: 12px;
      background: 
        repeating-linear-gradient(90deg,
          transparent 0px, transparent 16px,
          #5b8731 16px, #5b8731 20px,
          transparent 20px, transparent 32px,
          #4a7328 32px, #4a7328 36px,
          transparent 36px, transparent 64px
        );
      image-rendering: pixelated;
    }

    /* ═══════════════════════════════════════════════════
       MINECRAFT GRASS/DIRT BOTTOM BORDER
    ═══════════════════════════════════════════════════ */
    .mc-bottom-border {
      position: relative;
      width: 100%;
      height: 64px;
      background:
        linear-gradient(180deg,
        #5b8731 0%, #4a7328 8px, #3d6120 8px, #3d6120 12px,
        #8b6740 12px, #8b6740 20px,
        #7a5a38 20px, #7a5a38 28px,
        #6e5030 28px, #6e5030 36px,
        #624828 36px, #624828 44px,
        #5a4020 44px, #5a4020 52px,
        #3d2b12 52px, #3d2b12 64px) !important;
      image-rendering: pixelated;
    }

    /* Pixel flowers on bottom border */
    .mc-bottom-border::before {
      content: '🌸 🌼 🌺 🌻 🌷';
      position: absolute;
      top: -16px;
      left: 10%;
      font-size: 14px;
      letter-spacing: 40px;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
      animation: sway 3s ease-in-out infinite;
    }
    .mc-bottom-border::after {
      content: '🌿 🌱 🍀 🌾 🌿';
      position: absolute;
      top: -14px;
      right: 10%;
      font-size: 12px;
      letter-spacing: 30px;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
      animation: sway 4s ease-in-out infinite reverse;
    }

    @keyframes sway {
      0%, 100% { transform: translateX(0) rotate(0deg); }
      50% { transform: translateX(3px) rotate(1deg); }
    }

    /* ═══════════════════════════════════════════════════
       TORCH ANIMATION
    ═══════════════════════════════════════════════════ */
    .mc-torch {
      position: relative;
      width: 32px;
      height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mc-torch::before {
      content: '🔥';
      font-size: 18px;
      animation: torchFlicker 0.4s ease-in-out infinite alternate;
      filter: brightness(1.3);
    }
    .mc-torch::after {
      content: '';
      width: 6px;
      height: 24px;
      background: linear-gradient(180deg, #8b6740 0%, #6e5030 100%);
      border: 1px solid #5a4020;
      image-rendering: pixelated;
    }

    @keyframes torchFlicker {
      0% { transform: scale(1) translateY(0); opacity: 1; }
      33% { transform: scale(1.05) translateY(-1px); opacity: 0.9; }
      66% { transform: scale(0.95) translateY(1px); opacity: 1; }
      100% { transform: scale(1.02) translateY(-2px); opacity: 0.85; }
    }

    /* ═══════════════════════════════════════════════════
       SCROLLING MARQUEE
    ═══════════════════════════════════════════════════ */
    .mc-marquee-container {
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
    }
    .mc-marquee-text {
      display: inline-block;
      animation: marqueeScroll 20s linear infinite;
      padding-left: 100%;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }

    /* ═══════════════════════════════════════════════════
       SIDEBAR STYLES
    ═══════════════════════════════════════════════════ */
    .mc-sidebar {
      min-width: 180px;
      max-width: 200px;
    }

    .mc-category-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 2px solid transparent;
      border-radius: 4px;
      background: transparent;
      color: #c8a84e;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      width: 100%;
      text-align: left;
      letter-spacing: 1px;
      image-rendering: pixelated;
    }
    .mc-category-btn:hover {
      background: #3d2b1a;
      border-color: #5a4a2a;
      transform: translateX(4px);
    }
    .mc-category-btn.active {
      background: #4a8c3f;
      border-color: #6ab85e;
      color: #ffffff;
      box-shadow: 0 0 12px rgba(74, 140, 63, 0.4);
    }

    .mc-cart-section {
      border: 3px solid #5a4a2a;
      border-radius: 6px;
      background: #1a120b;
      padding: 12px;
    }

    .mc-view-cart-btn {
      display: block;
      width: 100%;
      padding: 10px;
      background: #4a8c3f;
      border: 3px solid #6ab85e;
      border-radius: 4px;
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      cursor: pointer;
      text-align: center;
      letter-spacing: 1px;
      transition: all 0.15s ease;
      image-rendering: pixelated;
    }
    .mc-view-cart-btn:hover {
      background: #5a9c4f;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 140, 63, 0.4);
    }

    /* ═══════════════════════════════════════════════════
       CARD HOVER / ANIMATIONS
    ═══════════════════════════════════════════════════ */
    .pop-card-hover {
      transition: all 0.2s ease-in-out !important;
      position: relative;
    }
    .pop-card-hover:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 0 0 2px rgba(198,169,108,0.3) !important;
    }

    /* Show edit/delete on hover */
    .card-admin-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 5;
    }
    .pop-card-hover:hover .card-admin-overlay {
      opacity: 1;
    }

    .pop-button-hover {
      transition: all 0.15s ease-in-out !important;
      image-rendering: pixelated !important;
    }
    .pop-button-hover:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(198,169,108,0.3) !important;
      filter: brightness(1.2) !important;
    }
    .pop-button-hover:active {
      transform: translateY(1px) !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important;
    }

    /* Add to cart button */
    .mc-add-cart-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #4a8c3f;
      border: 2px solid #6ab85e;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-size: 18px;
      image-rendering: pixelated;
    }
    .mc-add-cart-btn:hover {
      background: #5a9c4f;
      transform: scale(1.1);
      box-shadow: 0 0 16px rgba(74, 140, 63, 0.5);
    }
    .mc-add-cart-btn:active {
      transform: scale(0.95);
    }

    /* ═══════════════════════════════════════════════════
       PRODUCT CARD IMAGE DECORATION
    ═══════════════════════════════════════════════════ */
    .card-image-deco {
      position: relative;
      overflow: hidden;
    }
    .card-image-deco::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: repeating-linear-gradient(90deg,
        #5b8731 0px, #5b8731 8px,
        #4a7328 8px, #4a7328 16px
      );
      image-rendering: pixelated;
    }

    /* ═══════════════════════════════════════════════════
       COIN BADGE
    ═══════════════════════════════════════════════════ */
    .mc-coin-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #3d2b1a;
      border: 2px solid #c8a84e;
      border-radius: 6px;
      padding: 6px 14px;
      font-family: 'Press Start 2P', monospace;
      font-size: 11px;
      color: #FFD700;
      text-shadow: 1px 1px 0 #000;
    }
    .mc-coin-icon {
      width: 18px;
      height: 18px;
      background: radial-gradient(circle, #FFD700 40%, #DAA520 70%, #B8860B 100%);
      border-radius: 50%;
      border: 2px solid #B8860B;
      display: inline-block;
      box-shadow: inset 0 -2px 4px rgba(0,0,0,0.3);
    }

    /* ═══════════════════════════════════════════════════
       SECTION HEADER (CREATOR)
    ═══════════════════════════════════════════════════ */
    .mc-section-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 24px;
      background: linear-gradient(180deg, #3d2b1a 0%, #2d1f12 100%);
      border: 3px solid #5a4a2a;
      border-radius: 6px;
      margin: 24px auto;
      max-width: 400px;
    }

    /* ═══════════════════════════════════════════════════
       POTION ICON (Logo)
    ═══════════════════════════════════════════════════ */
    .mc-potion-icon {
      width: 36px;
      height: 36px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      filter: drop-shadow(0 0 8px rgba(200, 100, 255, 0.6));
      animation: potionGlow 2s ease-in-out infinite alternate;
    }
    @keyframes potionGlow {
      0% { filter: drop-shadow(0 0 6px rgba(200, 100, 255, 0.4)); }
      100% { filter: drop-shadow(0 0 14px rgba(200, 100, 255, 0.8)); }
    }

    /* ═══════════════════════════════════════════════════
       SCROLLBAR
    ═══════════════════════════════════════════════════ */
    ::-webkit-scrollbar {
      width: 10px !important;
    }
    ::-webkit-scrollbar-track {
      background: #1a120b !important;
    }
    ::-webkit-scrollbar-thumb {
      background: #5a4a2a !important;
      border: 2px solid #3d2b1a !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #8b7a45 !important;
    }

    /* ═══════════════════════════════════════════════════
       RESPONSIVE
    ═══════════════════════════════════════════════════ */
    @media (max-width: 768px) {
      .mc-sidebar {
        display: none !important;
      }
    }

    /* Star rating colors */
    .mc-star { color: #FFD700; text-shadow: 0 0 4px rgba(255,215,0,0.4); }
  `;
  document.head.appendChild(style);
}
