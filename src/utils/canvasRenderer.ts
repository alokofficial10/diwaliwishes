/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalConfig, GreetingState, WishTemplate } from '../types';

// Word wrap helper for Devanagari & Latin text with safety metrics
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Draw subtle archival paper & luxury linen texture for physical stationery feel
function drawLuxuryPaperTexture(ctx: CanvasRenderingContext2D, width: number, height: number, opacity = 0.04) {
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  const step = 8;
  for (let x = 0; x < width; x += step * 3) {
    for (let y = 0; y < height; y += step * 3) {
      if ((x + y) % 5 === 0) {
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }
  }
  ctx.fillStyle = `rgba(254, 240, 138, ${opacity * 1.5})`;
  const goldFlecks = [
    [180, 220], [340, 180], [860, 240], [1020, 190],
    [210, 520], [990, 540], [150, 880], [1050, 920],
    [240, 1240], [960, 1260], [420, 1480], [780, 1490],
  ];
  goldFlecks.forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.arc(fx, fy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// 1. DIWALI ARTWORK: Cinematic 3D Terracotta & Brass Diya with deep ground shadow, radiant flame & flanking diyas
export function drawDiwaliDiya(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 1,
  flameFlicker = 1
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Ground contact cast shadow (deep elliptical occlusion)
  const shadowGrad = ctx.createRadialGradient(0, 36, 10, 0, 36, 75);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(0, 38, 75, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Intricate rangoli mandala medallion beneath diya like an architectural pedestal
  ctx.save();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.28)';
  ctx.lineWidth = 1.8;
  const petals = 16;
  for (let i = 0; i < petals; i++) {
    ctx.rotate((Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(35, 25, 78, 0);
    ctx.quadraticCurveTo(35, -25, 0, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(60, 0, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 82, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Flanking smaller 3D Diyas for cinematic depth
  const drawMiniDiya = (mx: number, my: number, mscale: number) => {
    ctx.save();
    ctx.translate(mx, my);
    ctx.scale(mscale, mscale);
    // mini shadow
    ctx.beginPath();
    ctx.ellipse(0, 24, 40, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    // mini bowl
    ctx.beginPath();
    ctx.moveTo(-32, -2);
    ctx.quadraticCurveTo(-38, 18, 0, 24);
    ctx.quadraticCurveTo(38, 18, 32, -2);
    ctx.quadraticCurveTo(0, -10, -32, -2);
    ctx.closePath();
    ctx.fillStyle = '#92400E';
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // mini flame
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.quadraticCurveTo(-12, -14, 0, -36);
    ctx.quadraticCurveTo(12, -14, 0, -4);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.quadraticCurveTo(-6, -14, 0, -26);
    ctx.quadraticCurveTo(6, -14, 0, -6);
    ctx.fillStyle = '#FFFBEB';
    ctx.fill();
    ctx.restore();
  };
  drawMiniDiya(-95, 10, 0.6);
  drawMiniDiya(95, 10, 0.6);

  // Volumetric ambient light halo
  const glowGrad = ctx.createRadialGradient(0, -34, 6, 0, -34, 135);
  glowGrad.addColorStop(0, 'rgba(255, 248, 180, 0.9)');
  glowGrad.addColorStop(0.25, 'rgba(245, 158, 11, 0.6)');
  glowGrad.addColorStop(0.65, 'rgba(239, 68, 68, 0.22)');
  glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, -34, 135, 0, Math.PI * 2);
  ctx.fill();

  // 3D Terracotta Bowl with Realistic Lighting & Concave Lip
  // Diya Base Bowl (Shaded with 3D gradient)
  ctx.beginPath();
  ctx.moveTo(-56, -4);
  ctx.quadraticCurveTo(-64, 28, 0, 38);
  ctx.quadraticCurveTo(64, 28, 56, -4);
  ctx.quadraticCurveTo(0, -18, -56, -4);
  ctx.closePath();

  const bowlGrad = ctx.createLinearGradient(-56, -10, 56, 38);
  bowlGrad.addColorStop(0, '#78350F');
  bowlGrad.addColorStop(0.2, '#B45309');
  bowlGrad.addColorStop(0.5, '#F59E0B');
  bowlGrad.addColorStop(0.8, '#D97706');
  bowlGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = bowlGrad;
  ctx.fill();

  // Brass Rim Filigree & 3D Specular Highlight
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Concentric beading
  ctx.fillStyle = '#FEF08A';
  for (let d = -45; d <= 45; d += 9) {
    ctx.beginPath();
    ctx.arc(d, -3 + Math.abs(d) * 0.08, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner concave depression where oil & wick rest
  ctx.beginPath();
  ctx.ellipse(0, -6, 44, 11, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#451A03';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cotton wick (charred tip)
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -8);
  ctx.stroke();

  // Multi-tier 3D Flame: Outer red, middle golden amber, inner incandescent white
  const flameH = 58 * flameFlicker;
  const flameW = 24;

  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.quadraticCurveTo(-flameW, -24, 0, -8 - flameH);
  ctx.quadraticCurveTo(flameW, -24, 0, -8);
  ctx.fillStyle = '#EF4444';
  ctx.shadowColor = '#F59E0B';
  ctx.shadowBlur = 22;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.quadraticCurveTo(-flameW * 0.65, -24, 0, -8 - flameH * 0.84);
  ctx.quadraticCurveTo(flameW * 0.65, -24, 0, -8);
  ctx.fillStyle = '#F59E0B';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(-flameW * 0.3, -24, 0, -8 - flameH * 0.52);
  ctx.quadraticCurveTo(flameW * 0.3, -24, 0, -10);
  ctx.fillStyle = '#FFFBEB';
  ctx.shadowBlur = 0;
  ctx.fill();

  // Rising embers
  ctx.fillStyle = '#FEF08A';
  const embers = [[-8, -75], [10, -82], [-14, -94], [6, -105], [16, -118]];
  embers.forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// 2. HOLI ARTWORK: 3D Pichkari spraying volumetric gulal powder clouds & color bursts
export function drawHoliArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Volumetric layered color powder clouds with 3D depth
  const clouds = [
    { x: -60, y: -25, r: 70, color: 'rgba(244, 63, 94, 0.55)', rim: '#FDA4AF' }, // Rose magenta
    { x: 60, y: -30, r: 75, color: 'rgba(245, 158, 11, 0.55)', rim: '#FEF08A' }, // Saffron yellow
    { x: 0, y: -62, r: 65, color: 'rgba(16, 185, 129, 0.45)', rim: '#A7F3D0' },  // Spring green
    { x: -40, y: 35, r: 58, color: 'rgba(14, 165, 233, 0.5)', rim: '#BAE6FD' },  // Peacock cyan
    { x: 50, y: 35, r: 62, color: 'rgba(168, 85, 247, 0.45)', rim: '#E9D5FF' }, // Royal violet
  ];
  clouds.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.strokeStyle = c.rim;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Brass bowls (कटोरी) with heaped gulal powder and ground shadows
  const drawGulalBowl = (bx: number, by: number, powderCol: string, rimCol: string) => {
    ctx.save();
    ctx.translate(bx, by);
    // Cast shadow
    ctx.beginPath();
    ctx.ellipse(0, 24, 32, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fill();

    // Brass bowl base
    ctx.beginPath();
    ctx.ellipse(0, 16, 30, 12, 0, 0, Math.PI);
    ctx.fillStyle = '#B45309';
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Heaped powder mound
    ctx.beginPath();
    ctx.moveTo(-28, 16);
    ctx.quadraticCurveTo(0, -20, 28, 16);
    ctx.closePath();
    ctx.fillStyle = powderCol;
    ctx.fill();
    ctx.strokeStyle = rimCol;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  drawGulalBowl(-46, 28, '#EC4899', '#FDA4AF');
  drawGulalBowl(46, 28, '#F59E0B', '#FEF08A');

  // 3D Brass & Teak Wood Pichkari
  ctx.save();
  ctx.rotate(-Math.PI / 4.2);
  ctx.translate(0, -18);

  // Cylinder body with metallic brass sheen
  const pichGrad = ctx.createLinearGradient(-16, 0, 16, 0);
  pichGrad.addColorStop(0, '#78350F');
  pichGrad.addColorStop(0.25, '#FDE047');
  pichGrad.addColorStop(0.7, '#F59E0B');
  pichGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = pichGrad;
  ctx.fillRect(-16, -48, 32, 96);
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -48, 32, 96);

  // Decorative engraved bands
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(-16, -26, 32, 7);
  ctx.fillRect(-16, 12, 32, 7);

  // Nozzle with metallic shine
  ctx.beginPath();
  ctx.moveTo(-13, -48);
  ctx.lineTo(0, -75);
  ctx.lineTo(13, -48);
  ctx.closePath();
  ctx.fillStyle = '#FBBF24';
  ctx.fill();
  ctx.stroke();

  // Color spray jet stream
  ctx.strokeStyle = '#EC4899';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -75);
  ctx.quadraticCurveTo(-18, -100, -36, -118);
  ctx.moveTo(0, -75);
  ctx.lineTo(0, -125);
  ctx.moveTo(0, -75);
  ctx.quadraticCurveTo(18, -100, 36, -118);
  ctx.stroke();

  // Handle plunger
  ctx.fillStyle = '#10B981';
  ctx.fillRect(-7, 48, 14, 42);
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.ellipse(0, 90, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Joyous powder droplets and sparkling specks
  const specks = [
    [-88, -70, 5.5, '#EC4899'], [88, -80, 6.5, '#FBBF24'],
    [-98, 48, 5, '#38BDF8'], [105, 54, 6, '#10B981'],
    [0, -98, 7.5, '#F43F5E'], [-30, -82, 4.5, '#A855F7'],
    [32, -88, 4.5, '#F97316'],
  ];
  specks.forEach(([sx, sy, sr, scol]) => {
    ctx.beginPath();
    ctx.arc(Number(sx), Number(sy), Number(sr), 0, Math.PI * 2);
    ctx.fillStyle = String(scol);
    ctx.fill();
  });

  ctx.restore();
}

// 3. CHHATH PUJA ARTWORK: Cinematic Sunrise over sacred river, water reflections & 3D bamboo soop
export function drawChhathArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Atmospheric sunrise glow
  const sunGlow = ctx.createRadialGradient(0, -45, 10, 0, -45, 120);
  sunGlow.addColorStop(0, '#FFFBEB');
  sunGlow.addColorStop(0.3, '#FDE047');
  sunGlow.addColorStop(0.65, '#EA580C');
  sunGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(0, -45, 120, 0, Math.PI * 2);
  ctx.fill();

  // Surya Dev core disk
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(0, -45, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 3.2;
  ctx.stroke();

  // Divine Arghya rays
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12;
    const len = i % 2 === 0 ? 78 : 62;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 52, -45 + Math.sin(angle) * 52);
    ctx.lineTo(Math.cos(angle) * len, -45 + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Sacred sugarcane stalks (ईख) forming an auspicious natural arch
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-98, 80);
  ctx.quadraticCurveTo(-104, -25, -55, -78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(98, 80);
  ctx.quadraticCurveTo(104, -25, 55, -78);
  ctx.stroke();

  // Water ripples with dynamic golden specular reflections
  for (let w = 0; w < 4; w++) {
    const wy = 22 + w * 13;
    ctx.strokeStyle = `rgba(251, 146, 60, ${0.75 - w * 0.14})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-118, wy);
    ctx.bezierCurveTo(-60, wy - 6, 0, wy + 6, 60, wy - 6);
    ctx.bezierCurveTo(85, wy + 6, 118, wy, 128, wy);
    ctx.stroke();
  }

  // Woven 3D Bamboo Soop with cast shadow
  ctx.beginPath();
  ctx.ellipse(0, 48, 68, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, 38, 66, 24, 0, 0, Math.PI * 2);
  const soopGrad = ctx.createLinearGradient(0, 14, 0, 62);
  soopGrad.addColorStop(0, '#D97706');
  soopGrad.addColorStop(1, '#78350F');
  ctx.fillStyle = soopGrad;
  ctx.fill();
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Offerings in soop: Fresh coconut, apple, yellow banana bunch
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.arc(-28, 32, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.arc(30, 32, 9.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.ellipse(0, 44, 18, 7, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Center lit ghee diya in soop
  drawDiwaliDiya(ctx, 0, 30, 0.48, 1);

  ctx.restore();
}

// 4. GOVARDHAN PUJA ARTWORK: 3D Terraced Govardhan hill with Annakut 56-bhog pots & Krishna peacock feather
export function drawGovardhanArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Ground shadow
  ctx.beginPath();
  ctx.ellipse(0, 68, 100, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  // Hill Aura
  const hillAura = ctx.createRadialGradient(0, 0, 10, 0, 0, 105);
  hillAura.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
  hillAura.addColorStop(0.5, 'rgba(16, 185, 129, 0.28)');
  hillAura.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = hillAura;
  ctx.beginPath();
  ctx.arc(0, 0, 105, 0, Math.PI * 2);
  ctx.fill();

  // Terraced Govardhan Hill with rich mossy green gradients
  const hillGrad = ctx.createLinearGradient(0, -38, 0, 68);
  hillGrad.addColorStop(0, '#15803D');
  hillGrad.addColorStop(0.5, '#166534');
  hillGrad.addColorStop(1, '#0F3D20');

  ctx.beginPath();
  ctx.moveTo(-102, 68);
  ctx.quadraticCurveTo(-68, 12, -34, 24);
  ctx.quadraticCurveTo(0, -38, 34, 20);
  ctx.quadraticCurveTo(68, 12, 102, 68);
  ctx.closePath();
  ctx.fillStyle = hillGrad;
  ctx.fill();
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Divine Krishna Peacock Feather (मोरपंख) at summit
  ctx.save();
  ctx.translate(0, -48);
  ctx.beginPath();
  ctx.ellipse(0, -22, 18, 28, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#0284C7';
  ctx.fill();
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -22, 12, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#0D9488';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(0, -22, 8, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#312E81';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -22, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FDE047';
  ctx.fill();
  ctx.restore();

  // Annakut 56-Bhog Clay Pots array with delicious sweets
  const potColors = ['#FBBF24', '#F59E0B', '#DC2626', '#FEF08A', '#FBBF24'];
  for (let p = -2; p <= 2; p++) {
    const px = p * 26;
    const py = 54;
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#B45309';
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    // Prasad sweet topping
    ctx.beginPath();
    ctx.arc(px, py - 4, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = potColors[(p + 2) % potColors.length];
    ctx.fill();
  }

  // Auspicious Kamdhenu cow silhouette accents
  ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
  ctx.beginPath();
  ctx.arc(-60, 40, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, 40, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 5. HAPPY NEW YEAR ARTWORK: 3D Sculpted 2026 typography with Art-Deco gilded arch & champagne fireworks
export function drawNewYearArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Midnight starry halo
  const starHalo = ctx.createRadialGradient(0, 0, 10, 0, 0, 105);
  starHalo.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  starHalo.addColorStop(0.5, 'rgba(96, 165, 250, 0.22)');
  starHalo.addColorStop(1, 'rgba(96, 165, 250, 0)');
  ctx.fillStyle = starHalo;
  ctx.beginPath();
  ctx.arc(0, 0, 105, 0, Math.PI * 2);
  ctx.fill();

  // Art-Deco concentric gold rings
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();

  // Champagne fireworks starbursts
  const starburstColors = ['#FDE047', '#60A5FA', '#F43F5E', '#A855F7', '#34D399'];
  starburstColors.forEach((col, sIdx) => {
    const angleOffset = (sIdx * Math.PI) / 5;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.8;
    for (let r = 0; r < 8; r++) {
      const a = angleOffset + (r * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 28, Math.sin(a) * 28);
      ctx.lineTo(Math.cos(a) * 78, Math.sin(a) * 78);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 78, Math.sin(a) * 78, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }
  });

  // Central 3D Medallion with Extruded Bevel
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  const medGrad = ctx.createLinearGradient(-28, -28, 28, 28);
  medGrad.addColorStop(0, '#FEF08A');
  medGrad.addColorStop(0.5, '#F59E0B');
  medGrad.addColorStop(1, '#B45309');
  ctx.fillStyle = medGrad;
  ctx.shadowColor = '#FDE047';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.strokeStyle = '#FFFBEB';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // "2026" in 3D sculpted serif typography
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 16px "Cinzel Decorative", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('2026', 0, 0);

  ctx.restore();
}

// 6. GANESH PUJA ARTWORK: 3D Sculpted Prabhavali temple archway with Lord Ganesha, golden mukut & fresh modak
export function drawGaneshArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Ground shadow
  ctx.beginPath();
  ctx.ellipse(0, 48, 70, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  // Sacred Prabhavali aura
  const haloGrad = ctx.createRadialGradient(0, -18, 10, 0, -18, 105);
  haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  haloGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.45)');
  haloGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, -18, 105, 0, Math.PI * 2);
  ctx.fill();

  // Temple arch columns
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -18, 72, Math.PI * 0.8, Math.PI * 2.2);
  ctx.stroke();

  // Royal Golden Mukut (Crown)
  ctx.beginPath();
  ctx.moveTo(-30, -42);
  ctx.lineTo(-36, -66);
  ctx.lineTo(-16, -54);
  ctx.lineTo(0, -88);
  ctx.lineTo(16, -54);
  ctx.lineTo(36, -66);
  ctx.lineTo(30, -42);
  ctx.closePath();
  const mukutGrad = ctx.createLinearGradient(-36, -88, 36, -42);
  mukutGrad.addColorStop(0, '#FFFBEB');
  mukutGrad.addColorStop(0.4, '#FDE047');
  mukutGrad.addColorStop(0.8, '#F59E0B');
  mukutGrad.addColorStop(1, '#B45309');
  ctx.fillStyle = mukutGrad;
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Mukut ruby jewel in center
  ctx.beginPath();
  ctx.arc(0, -56, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#DC2626';
  ctx.fill();

  // Divine Face in sacred vermilion
  ctx.beginPath();
  ctx.arc(0, -18, 28, 0, Math.PI * 2);
  ctx.fillStyle = '#EA580C';
  ctx.fill();
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 2.4;
  ctx.stroke();

  // Auspicious ears
  ctx.beginPath();
  ctx.ellipse(-35, -20, 15, 20, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#EA580C';
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(35, -20, 15, 20, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#EA580C';
  ctx.fill();
  ctx.stroke();

  // Divine Trunk curving to the left
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.quadraticCurveTo(-12, 18, -26, 14);
  ctx.quadraticCurveTo(-32, 8, -24, -2);
  ctx.lineWidth = 7.5;
  ctx.strokeStyle = '#EA580C';
  ctx.stroke();

  // Sacred Tilak
  ctx.fillStyle = '#FEF08A';
  ctx.fillRect(-11, -30, 22, 3.2);
  ctx.fillRect(-8, -25, 16, 3.2);
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(0, -20, 3, 0, Math.PI * 2);
  ctx.fill();

  // Fresh ribbed banana leaf with Modak
  ctx.beginPath();
  ctx.ellipse(40, 28, 22, 11, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#15803D';
  ctx.fill();

  // 3D Golden Modak with pleats
  ctx.beginPath();
  ctx.moveTo(30, 26);
  ctx.quadraticCurveTo(27, 10, 40, 4);
  ctx.quadraticCurveTo(53, 10, 50, 26);
  ctx.closePath();
  ctx.fillStyle = '#FEF08A';
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

// 7. LAKSHMI PUJA ARTWORK: 3D Sahasradala Lotus throne, sacred Kalash with coconut & falling gold coins
export function drawLakshmiArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Ground water shadow
  ctx.beginPath();
  ctx.ellipse(0, 42, 85, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fill();

  // Lotus pond aura
  const lotusAura = ctx.createRadialGradient(0, -12, 8, 0, -12, 105);
  lotusAura.addColorStop(0, 'rgba(254, 205, 211, 0.85)');
  lotusAura.addColorStop(0.45, 'rgba(244, 63, 94, 0.38)');
  lotusAura.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = lotusAura;
  ctx.beginPath();
  ctx.arc(0, -12, 105, 0, Math.PI * 2);
  ctx.fill();

  // 3D Layered Lotus Petals
  const drawPetal = (angle: number, length: number, width: number, color: string, strokeCol: string) => {
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.quadraticCurveTo(width, -length * 0.55, 0, -length);
    ctx.quadraticCurveTo(-width, -length * 0.55, 0, 8);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.restore();
  };

  for (let a = -5; a <= 5; a++) {
    drawPetal((a * Math.PI) / 11, 60, 18, '#E11D48', '#FDA4AF');
  }
  for (let a = -4; a <= 4; a++) {
    drawPetal((a * Math.PI) / 13, 50, 15, '#FB7185', '#FFF1F2');
  }
  for (let a = -2; a <= 2; a++) {
    drawPetal((a * Math.PI) / 15, 38, 12, '#FECDD3', '#FFFFFF');
  }

  // Sacred Mangal Kalash at base
  ctx.save();
  ctx.translate(0, 34);
  ctx.beginPath();
  ctx.arc(0, 6, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#F59E0B';
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -14, 11, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#78350F';
  ctx.fill();

  ctx.fillStyle = '#15803D';
  [-18, -9, 9, 18].forEach((lx) => {
    ctx.beginPath();
    ctx.ellipse(lx, -5, 4.5, 13, (lx / 25), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 3D Stamped Gold Coins Cascade (धन वर्षा) with metallic glints
  const goldCoins = [
    [-45, -55], [45, -50], [-26, -78], [26, -72],
    [-56, -24], [56, -20], [-14, -94], [14, -98],
    [-38, 12], [38, 14],
  ];
  goldCoins.forEach(([cxPos, cyPos]) => {
    ctx.beginPath();
    ctx.arc(cxPos, cyPos, 7, 0, Math.PI * 2);
    const coinGrad = ctx.createLinearGradient(cxPos - 7, cyPos - 7, cxPos + 7, cyPos + 7);
    coinGrad.addColorStop(0, '#FFFBEB');
    coinGrad.addColorStop(0.3, '#FEF08A');
    coinGrad.addColorStop(0.7, '#F59E0B');
    coinGrad.addColorStop(1, '#92400E');
    ctx.fillStyle = coinGrad;
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Inner coin emboss dot
    ctx.beginPath();
    ctx.arc(cxPos, cyPos, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#78350F';
    ctx.fill();
  });

  ctx.restore();
}

// 8. RAKSHA BANDHAN ARTWORK: 3D Zari-embroidered Rakhi medallion with silk tassels & silver puja thali
export function drawRakhiArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Thali shadow
  ctx.beginPath();
  ctx.ellipse(0, 15, 110, 35, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  // Silver Puja Thali base rim
  ctx.beginPath();
  ctx.ellipse(0, 15, 105, 32, 0, 0, Math.PI * 2);
  const thaliGrad = ctx.createLinearGradient(-105, 0, 105, 0);
  thaliGrad.addColorStop(0, '#CBD5E1');
  thaliGrad.addColorStop(0.5, '#F8FAFC');
  thaliGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = thaliGrad;
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Braided Silk Cord extending horizontally
  ctx.strokeStyle = '#F43F5E';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-125, 0);
  ctx.lineTo(125, 0);
  ctx.stroke();

  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-125, -2);
  ctx.lineTo(125, -2);
  ctx.stroke();

  // Thread beads
  const beads = [-90, -65, -42, 42, 65, 90];
  beads.forEach((bx) => {
    ctx.beginPath();
    ctx.arc(bx, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.strokeStyle = '#881337';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  });

  // Central Ornate 3D Dial Medallion
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.fillStyle = '#991B1B';
  ctx.fill();
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  for (let s = 0; s < 14; s++) {
    const angle = (s * Math.PI) / 7;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * 38, Math.sin(angle) * 38, 3.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#DC2626';
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Center sparkling ruby facet
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(13, 0);
  ctx.lineTo(0, 13);
  ctx.lineTo(-13, 0);
  ctx.closePath();
  ctx.fillStyle = '#FEF08A';
  ctx.fill();

  ctx.restore();
}

// 9. CHRISTMAS ARTWORK: 3D Pine Tree with Bethlehem Star, baubles & Flying Santa Sleigh silhouette
export function drawChristmasArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1, santaProgress = 0.5) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Flying Santa Claus and Reindeer Sleigh in the sky!
  // Santa enters from left (-140) and flies across to right (140) based on santaProgress
  const santaX = -140 + santaProgress * 280;
  const santaY = -85 + Math.sin(santaProgress * Math.PI * 2) * 8;

  ctx.save();
  ctx.translate(santaX, santaY);
  ctx.fillStyle = '#FEF08A';
  // Reindeer 1
  ctx.beginPath();
  ctx.ellipse(32, -4, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(38, -12, 3, 9); // head/neck
  // Reindeer 2
  ctx.beginPath();
  ctx.ellipse(18, -2, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(24, -10, 3, 9);
  // Sleigh runner & body
  ctx.beginPath();
  ctx.moveTo(-16, 4);
  ctx.lineTo(2, 4);
  ctx.quadraticCurveTo(8, 2, 8, -4);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#FEF08A';
  ctx.stroke();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.roundRect(-14, -8, 18, 10, 3);
  ctx.fill();
  // Santa figure
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-8, -10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(-8, -13, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Ambient tree glow
  const treeGlow = ctx.createRadialGradient(0, -10, 10, 0, -10, 105);
  treeGlow.addColorStop(0, 'rgba(254, 240, 138, 0.5)');
  treeGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.22)');
  treeGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = treeGlow;
  ctx.beginPath();
  ctx.arc(0, -10, 105, 0, Math.PI * 2);
  ctx.fill();

  // 3D Pine Tree tiers with snow dust
  const treeGrad = ctx.createLinearGradient(0, -64, 0, 54);
  treeGrad.addColorStop(0, '#15803D');
  treeGrad.addColorStop(0.5, '#166534');
  treeGrad.addColorStop(1, '#0F3D20');

  // Top Tier
  ctx.beginPath();
  ctx.moveTo(0, -64);
  ctx.lineTo(-28, -30);
  ctx.lineTo(28, -30);
  ctx.closePath();
  ctx.fillStyle = treeGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Middle Tier
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(-48, 8);
  ctx.lineTo(48, 8);
  ctx.closePath();
  ctx.fillStyle = treeGrad;
  ctx.fill();
  ctx.stroke();

  // Base Tier
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-70, 46);
  ctx.lineTo(70, 46);
  ctx.closePath();
  ctx.fillStyle = treeGrad;
  ctx.fill();
  ctx.stroke();

  // Trunk
  ctx.fillStyle = '#78350F';
  ctx.fillRect(-11, 46, 22, 18);

  // Shining Golden Bethlehem Star topper
  ctx.save();
  ctx.translate(0, -70);
  ctx.fillStyle = '#FDE047';
  ctx.shadowColor = '#FEF08A';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(angle) * 17;
    const y = Math.sin(angle) * 17;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Baubles with reflection glints
  const baubles = [
    [-15, -26, '#EF4444'], [15, -24, '#FBBF24'],
    [-28, 0, '#38BDF8'], [28, -2, '#F43F5E'],
    [-40, 36, '#FBBF24'], [0, 28, '#EF4444'], [40, 34, '#A855F7'],
  ];
  baubles.forEach(([bx, by, bcol]) => {
    ctx.beginPath();
    ctx.arc(Number(bx), Number(by), 5.5, 0, Math.PI * 2);
    ctx.fillStyle = String(bcol);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Glass highlight
    ctx.beginPath();
    ctx.arc(Number(bx) - 1.8, Number(by) - 1.8, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  });

  ctx.restore();
}

// 10. EID ARTWORK: 3D Islamic Mihrab archway, radiant crescent moon (हिलाल) & swaying brass Fanous lanterns
export function drawEidArtwork(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1, lanternSway = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Midnight lapis lunar radiance
  const moonGlow = ctx.createRadialGradient(-10, -10, 8, -10, -10, 105);
  moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
  moonGlow.addColorStop(0.45, 'rgba(20, 184, 166, 0.4)');
  moonGlow.addColorStop(1, 'rgba(20, 184, 166, 0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(-10, -10, 105, 0, Math.PI * 2);
  ctx.fill();

  // Islamic 8-pointed geometric archway ring
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-46, -46, 92, 92);
  }
  ctx.restore();

  // 3D Golden Crescent Moon (हिलाल)
  ctx.save();
  ctx.fillStyle = '#FDE047';
  ctx.shadowColor = '#FBBF24';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(-6, -6, 48, 0.22, 1.78 * Math.PI, false);
  ctx.arc(12, -15, 42, 1.7 * Math.PI, 0.3, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Radiant 8-pointed Islamic Star
  ctx.save();
  ctx.translate(26, -22);
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const rOuter = 15;
    const rInner = 7;
    const xOuter = Math.cos(angle) * rOuter;
    const yOuter = Math.sin(angle) * rOuter;
    const xInner = Math.cos(angle + Math.PI / 8) * rInner;
    const yInner = Math.sin(angle + Math.PI / 8) * rInner;
    if (i === 0) ctx.moveTo(xOuter, yOuter);
    else ctx.lineTo(xOuter, yOuter);
    ctx.lineTo(xInner, yInner);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Left & Right Hanging Brass Fanous Lanterns (swaying gently)
  const drawFanous = (lx: number, ly: number, swayAngle: number) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(swayAngle);

    // Chain
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(0, -15);
    ctx.stroke();

    // Lantern dome & body
    ctx.fillStyle = '#0D9488';
    ctx.beginPath();
    ctx.moveTo(-14, 22);
    ctx.lineTo(-10, -8);
    ctx.lineTo(0, -18);
    ctx.lineTo(10, -8);
    ctx.lineTo(14, 22);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Inner warm lamp glow
    ctx.fillStyle = '#FEF08A';
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawFanous(-58, 20, lanternSway);
  drawFanous(58, 20, -lanternSway);

  ctx.restore();
}

// Master Artwork Router for Diwali
export function drawFestivalArtwork(
  ctx: CanvasRenderingContext2D,
  _festival: FestivalConfig,
  cx: number,
  cy: number,
  scale = 1
) {
  drawDiwaliDiya(ctx, cx, cy, scale, 1);
}

// Draw Luxury Double Border with Engraved Gold Corner Flourishes
export function drawFestivalBorder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  accentColor: string
) {
  ctx.save();
  const outerInset = 34;
  const ow = width - outerInset * 2;
  const oh = height - outerInset * 2;

  // Outer primary gold line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(outerInset, outerInset, ow, oh);

  // Inner delicate gold hairline
  const innerInset = outerInset + 10;
  const iw = width - innerInset * 2;
  const ih = height - innerInset * 2;
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(innerInset, innerInset, iw, ih);

  // Luxury Corner Cartouches
  const corners = [
    { cx: innerInset, cy: innerInset, sx: 1, sy: 1 },
    { cx: innerInset + iw, cy: innerInset, sx: -1, sy: 1 },
    { cx: innerInset, cy: innerInset + ih, sx: 1, sy: -1 },
    { cx: innerInset + iw, cy: innerInset + ih, sx: -1, sy: -1 },
  ];

  corners.forEach(({ cx, cy, sx, sy }) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sx, sy);
    ctx.strokeStyle = '#FBBF24';
    ctx.fillStyle = '#F59E0B';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(0, 0);
    ctx.lineTo(36, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(16, 8);
    ctx.lineTo(16, 16);
    ctx.lineTo(8, 16);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(24, 24, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

// Helper to safely load raster image assets with timeout and cache handling
function loadRasterImage(url: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        reject(new Error(`Image load timeout for ${url}`));
      }
    }, timeoutMs);

    img.onload = () => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve(img);
      }
    };
    img.onerror = (e) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        reject(new Error(`Failed to load image asset from ${url}: ${e}`));
      }
    };

    img.src = url;

    // If image is already complete in browser cache
    if (img.complete && img.naturalWidth > 0) {
      isSettled = true;
      clearTimeout(timer);
      resolve(img);
    }
  });
}

// Resilient asset loader with fallback URL attempts
async function loadHeroImageWithFallback(primaryUrl: string): Promise<HTMLImageElement> {
  const candidates = [
    primaryUrl,
    primaryUrl.replace(/^\/assets\//, '/src/assets/images/'),
    primaryUrl.replace(/^\/src\/assets\/images\//, '/assets/'),
    '/assets/diwali_ram_mandir_personalized.png',
    '/assets/diwali_ram_mandir_universal.png',
    '/assets/aistudio/image_25aaf2bd.png',
  ];
  const uniqueUrls = Array.from(new Set(candidates));

  for (const url of uniqueUrls) {
    try {
      return await loadRasterImage(url, 4000);
    } catch {
      // try next candidate
    }
  }
  throw new Error(`Failed to load hero image from candidate URLs`);
}

// 1. Ornate Golden Lotus Icon for Top Hallmark
function drawGoldenLotusIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size = 30) {
  ctx.save();
  ctx.translate(cx, cy);

  const lotusGrad = ctx.createLinearGradient(0, -size, 0, size);
  lotusGrad.addColorStop(0, '#FFFDF0');
  lotusGrad.addColorStop(0.3, '#FEF08A');
  lotusGrad.addColorStop(0.7, '#F59E0B');
  lotusGrad.addColorStop(1, '#B45309');

  ctx.fillStyle = lotusGrad;
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.3;

  // Center petal
  ctx.beginPath();
  ctx.moveTo(0, size * 0.7);
  ctx.quadraticCurveTo(size * 0.5, 0, 0, -size * 0.85);
  ctx.quadraticCurveTo(-size * 0.5, 0, 0, size * 0.7);
  ctx.fill();
  ctx.stroke();

  // Left & right inner petals
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.7);
    ctx.quadraticCurveTo(dir * size * 0.9, size * 0.1, dir * size * 0.65, -size * 0.5);
    ctx.quadraticCurveTo(dir * size * 0.3, -size * 0.1, 0, size * 0.7);
    ctx.fill();
    ctx.stroke();
  });

  // Base leaves
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.7);
    ctx.quadraticCurveTo(dir * size * 1.1, size * 0.6, dir * size * 0.9, size * 0.15);
    ctx.quadraticCurveTo(dir * size * 0.4, size * 0.4, 0, size * 0.7);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

// 2. Sculpted 3D "Happy Diwali" Grand Typography with radiant flame over 'i'
function drawCinematicHappyDiwaliTitle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  titleY: number
) {
  ctx.save();

  // "Wishing you and your family a very"
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFBEB';
  ctx.font = '500 23px "Poppins", serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;
  ctx.fillText('Wishing you and your family a very', cx, titleY - 142);

  // "Happy" (Italic gold serif)
  ctx.fillStyle = '#FEF08A';
  ctx.font = 'italic 700 48px "Rozha One", "Cinzel Decorative", serif';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
  ctx.shadowBlur = 16;
  ctx.fillText('Happy', cx, titleY - 94);

  // "Diwali" (Sculpted 3D monumental gold typography)
  const diwaliGrad = ctx.createLinearGradient(cx - 200, titleY - 80, cx + 200, titleY + 20);
  diwaliGrad.addColorStop(0, '#FFFDF0');
  diwaliGrad.addColorStop(0.2, '#FEF08A');
  diwaliGrad.addColorStop(0.55, '#F59E0B');
  diwaliGrad.addColorStop(0.85, '#D97706');
  diwaliGrad.addColorStop(1, '#92400E');

  // Deep shadow pass for realistic relief
  ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.font = '900 112px "Cinzel Decorative", "Rozha One", serif';
  ctx.fillStyle = 'rgba(12, 2, 7, 0.95)';
  ctx.fillText('Diwali', cx, titleY + 5);

  // Radiant outer amber glow pass
  ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 0;

  // Foreground gradient fill
  ctx.fillStyle = diwaliGrad;
  ctx.fillText('Diwali', cx, titleY);

  // Crisp gold stroke bevel highlight
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
  ctx.lineWidth = 1.8;
  ctx.strokeText('Diwali', cx, titleY);

  // Radiant miniature oil lamp flame atop the 'i' of Diwali (approx cx + 172, titleY - 96)
  const flameX = cx + 172;
  const flameY = titleY - 98;

  const fGlow = ctx.createRadialGradient(flameX, flameY, 2, flameX, flameY, 26);
  fGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  fGlow.addColorStop(0.35, 'rgba(245, 158, 11, 0.75)');
  fGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = fGlow;
  ctx.beginPath();
  ctx.arc(flameX, flameY, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFBEB';
  ctx.beginPath();
  ctx.moveTo(flameX, flameY - 12);
  ctx.quadraticCurveTo(flameX + 6, flameY, flameX, flameY + 6);
  ctx.quadraticCurveTo(flameX - 6, flameY, flameX, flameY - 12);
  ctx.fill();

  ctx.restore();
}

// 3. Ornate Raised Gold Nameplate with Deep Velvet Gradient & Flanking Wings
function drawOrnateGoldNameplate(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  name: string,
  maxWidth = 720,
  isSecondary = false
) {
  ctx.save();

  // Dynamic responsive font sizing so long names never clip
  let fontSize = isSecondary ? 30 : 35;
  ctx.font = `700 ${fontSize}px "Rozha One", "Yatra One", "Poppins", serif`;
  let textWidth = ctx.measureText(name).width;

  while (textWidth > maxWidth - 160 && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `700 ${fontSize}px "Rozha One", "Yatra One", "Poppins", serif`;
    textWidth = ctx.measureText(name).width;
  }

  const plateW = Math.min(maxWidth, Math.max(isSecondary ? 380 : 440, textWidth + 150));
  const plateH = isSecondary ? 58 : 66;
  const x = cx - plateW / 2;
  const y = cy - plateH / 2;

  // Outer ambient shadow for physical raised 3D depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.88)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;

  // Background: Royal Velvet Mahogany gradient fill
  const bgGrad = ctx.createLinearGradient(x, y, x, y + plateH);
  bgGrad.addColorStop(0, '#15040C');
  bgGrad.addColorStop(0.3, '#340B1D');
  bgGrad.addColorStop(0.7, '#240614');
  bgGrad.addColorStop(1, '#110309');

  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, plateW, plateH, 18);
  ctx.fill();

  // Reset shadow for crisp border outlines
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Outer gold beveled border
  const borderGrad = ctx.createLinearGradient(x, y, x + plateW, y + plateH);
  borderGrad.addColorStop(0, '#F59E0B');
  borderGrad.addColorStop(0.25, '#FEF08A');
  borderGrad.addColorStop(0.7, '#D97706');
  borderGrad.addColorStop(1, '#FDE047');

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2.4;
  ctx.stroke();

  // Inset hairline gold frame
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x + 4, y + 4, plateW - 8, plateH - 8, 14);
  ctx.stroke();

  // Corner gold diamond rivets
  ctx.fillStyle = '#FEF08A';
  const corners = [
    [x + 10, y + 10],
    [x + plateW - 10, y + 10],
    [x + 10, y + plateH - 10],
    [x + plateW - 10, y + plateH - 10],
  ];
  corners.forEach(([cxp, cyp]) => {
    ctx.beginPath();
    ctx.arc(cxp, cyp, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Flanking ornate filigree leaf wing accents
  const drawWing = (dir: 1 | -1) => {
    ctx.save();
    ctx.strokeStyle = '#FDE047';
    ctx.fillStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    const wingX = dir === 1 ? x + plateW - 24 : x + 24;

    ctx.beginPath();
    ctx.moveTo(wingX, cy);
    ctx.lineTo(wingX + dir * 8, cy - 8);
    ctx.lineTo(wingX + dir * 14, cy);
    ctx.lineTo(wingX + dir * 8, cy + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(wingX - dir * 6, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.restore();
  };

  drawWing(-1);
  drawWing(1);

  // Render Name with sculpted embossed gold lettering
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  const textGrad = ctx.createLinearGradient(cx, y + 8, cx, y + plateH - 8);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(0.2, '#FEF9C3');
  textGrad.addColorStop(0.65, '#FDE047');
  textGrad.addColorStop(1, '#F59E0B');

  ctx.fillStyle = textGrad;
  ctx.font = `700 ${fontSize}px "Rozha One", "Yatra One", "Poppins", serif`;
  ctx.fillText(name, cx, cy);

  ctx.restore();
}

// 4. Translucent Bottom Hallmark Ribbon Bar
function drawBottomHallmarkRibbon(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  text: string
) {
  ctx.save();
  const barW = 1040;
  const barH = 46;
  const barX = (width - barW) / 2;

  // Translucent dark gradient bar
  const barGrad = ctx.createLinearGradient(barX, y, barX + barW, y);
  barGrad.addColorStop(0, 'rgba(15, 3, 9, 0)');
  barGrad.addColorStop(0.12, 'rgba(15, 3, 9, 0.88)');
  barGrad.addColorStop(0.5, 'rgba(25, 5, 15, 0.94)');
  barGrad.addColorStop(0.88, 'rgba(15, 3, 9, 0.88)');
  barGrad.addColorStop(1, 'rgba(15, 3, 9, 0)');

  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(barX, y, barW, barH, 23);
  ctx.fill();

  // Subtle gold border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Gold text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FEF08A';
  ctx.font = 'italic 500 18px "Poppins", sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.fillText(text, width / 2, y + barH / 2);

  ctx.restore();
}

// MASTER GREETING POSTER GENERATOR: Cinematic Commercial-Grade Advertising Poster
export async function renderFestivalCard(
  state: GreetingState,
  festival: FestivalConfig,
  template: WishTemplate
): Promise<HTMLCanvasElement> {
  try {
    await document.fonts.ready;
  } catch {
    // Continue
  }

  // ==========================================
  // BRANCH A: CINEMATIC DIWALI RAM MANDIR DESIGN
  // Matches user's approved reference image exactly
  // ==========================================
  if (festival.id === 'diwali') {
    const isSpecial = state.recipientMode === 'special' && Boolean(state.recipientName && state.recipientName.trim());
    const diwaliAssetUrl = isSpecial
      ? '/assets/diwali_ram_mandir_personalized.png'
      : '/assets/diwali_ram_mandir_universal.png';

    let heroImage: HTMLImageElement | null = null;
    try {
      heroImage = await loadHeroImageWithFallback(diwaliAssetUrl);
    } catch (err) {
      console.warn('Could not load Diwali hero asset:', err);
    }

    if (heroImage) {
      const width = 1024;
      const height = 1536;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire 2D context for canvas card');

      // 1. Draw the exact cinematic Ram Mandir background
      ctx.drawImage(heroImage, 0, 0, width, height);

      const cx = 472; // Exact optical center of cartouche and sunset opening
      const fontFamilies = '"Rozha One", "Yatra One", "Noto Serif Devanagari", "Noto Sans Devanagari", "Cinzel Decorative", serif';

      // 2. SENDER NAME (Inside Upper Box, cy = 650)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let sFontSize = 32;
      ctx.font = `700 ${sFontSize}px ${fontFamilies}`;
      let sWidth = ctx.measureText(state.senderName).width;
      while (sWidth > 220 && sFontSize > 16) {
        sFontSize -= 1.5;
        ctx.font = `700 ${sFontSize}px ${fontFamilies}`;
        sWidth = ctx.measureText(state.senderName).width;
      }

      if (sWidth > 220) {
        const expandW = Math.min(380, sWidth + 24);
        ctx.save();
        ctx.fillStyle = '#1c0510';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(cx - expandW / 2, 624, expandW, 52, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      const sGrad = ctx.createLinearGradient(cx, 630, cx, 670);
      sGrad.addColorStop(0, '#FFFFFF');
      sGrad.addColorStop(0.25, '#FEF9C3');
      sGrad.addColorStop(0.65, '#FDE047');
      sGrad.addColorStop(1, '#D97706');

      ctx.fillStyle = sGrad;
      ctx.fillText(state.senderName, cx, 650);

      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.strokeText(state.senderName, cx, 650);
      ctx.restore();

      if (isSpecial && state.recipientName) {
        // 3. RECIPIENT NAME (Inside Lower Box, cy = 743)
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let rFontSize = 29;
        ctx.font = `700 ${rFontSize}px ${fontFamilies}`;
        let rWidth = ctx.measureText(state.recipientName).width;
        while (rWidth > 200 && rFontSize > 15) {
          rFontSize -= 1.5;
          ctx.font = `700 ${rFontSize}px ${fontFamilies}`;
          rWidth = ctx.measureText(state.recipientName).width;
        }

        if (rWidth > 200) {
          const expandW = Math.min(340, rWidth + 22);
          ctx.save();
          ctx.fillStyle = '#1c0510';
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(cx - expandW / 2, 717, expandW, 52, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        const rGrad = ctx.createLinearGradient(cx, 725, cx, 765);
        rGrad.addColorStop(0, '#FFFFFF');
        rGrad.addColorStop(0.25, '#FEF9C3');
        rGrad.addColorStop(0.65, '#FDE047');
        rGrad.addColorStop(1, '#D97706');

        ctx.fillStyle = rGrad;
        ctx.fillText(state.recipientName, cx, 743);

        ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.strokeText(state.recipientName, cx, 743);
        ctx.restore();

        // 4. Personalized Hindi Greeting below cartouche
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFBEB';
        ctx.font = `700 28px ${fontFamilies}`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 2;

        ctx.fillText('आपको और आपके पूरे परिवार को', cx, 868);
        ctx.fillText('दीपावली की हार्दिक शुभकामनाएँ।', cx, 908);
        ctx.restore();

        // Golden lotus divider
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx - 130, 946);
        ctx.lineTo(cx - 24, 946);
        ctx.moveTo(cx + 24, 946);
        ctx.lineTo(cx + 130, 946);
        ctx.stroke();

        ctx.fillStyle = '#FEF08A';
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪷', cx, 945);
        ctx.restore();

        // Festival quote
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FEF08A';
        ctx.font = `500 21px ${fontFamilies}`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 10;
        ctx.fillText('“दीपों की रोशनी से आपका जीवन', cx, 988);
        ctx.fillText('सुख, समृद्धि और खुशियों से हमेशा जगमगाए।”', cx, 1022);
        ctx.restore();

      } else {
        // Universal Mode
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFBEB';
        ctx.font = `600 20px ${fontFamilies}`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText('आप सभी एवं आपके परिवार को', cx, 735);
        ctx.restore();

        // Universal Hindi greeting
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFBEB';
        ctx.font = `700 29px ${fontFamilies}`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 2;

        ctx.fillText('दीपावली की हार्दिक शुभकामनाएँ!', cx, 868);
        ctx.restore();

        // Golden lotus divider
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx - 130, 915);
        ctx.lineTo(cx - 24, 915);
        ctx.moveTo(cx + 24, 915);
        ctx.lineTo(cx + 130, 915);
        ctx.stroke();

        ctx.fillStyle = '#FEF08A';
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪷', cx, 914);
        ctx.restore();

        // Festival quote
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FEF08A';
        ctx.font = `500 22px ${fontFamilies}`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 10;
        ctx.fillText('“दीपों की रोशनी से आपका जीवन सुख, समृद्धि', cx, 960);
        ctx.fillText('और खुशियों से हमेशा जगमगाए।”', cx, 996);
        ctx.restore();
      }

      return canvas;
    }
  }

  // ==========================================
  // BRANCH B: STANDARD / PROCEDURAL FESTIVAL LAYOUT
  // (Holi, Eid, Raksha Bandhan, Ganesh Chaturthi, etc.)
  // ==========================================
  const width = 1200;
  const height = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not acquire 2D context for canvas card');

  let heroImage: HTMLImageElement | null = null;
  if (festival.heroAssetUrl) {
    try {
      heroImage = await loadHeroImageWithFallback(festival.heroAssetUrl);
    } catch (err) {
      console.warn('Could not load hero image asset, using procedural fallback:', err);
    }
  }

  const isHeroImage = Boolean(heroImage);

  if (heroImage) {
    // High-resolution hero image
    ctx.drawImage(heroImage, 0, 0, width, height);

    const topScrim = ctx.createLinearGradient(0, 0, 0, 360);
    topScrim.addColorStop(0, 'rgba(10, 2, 6, 0.82)');
    topScrim.addColorStop(0.5, 'rgba(12, 3, 7, 0.52)');
    topScrim.addColorStop(1, 'rgba(15, 3, 8, 0)');
    ctx.fillStyle = topScrim;
    ctx.fillRect(0, 0, width, 360);

    const bottomScrim = ctx.createLinearGradient(0, 780, 0, height);
    bottomScrim.addColorStop(0, 'rgba(10, 2, 6, 0)');
    bottomScrim.addColorStop(0.25, 'rgba(12, 3, 7, 0.65)');
    bottomScrim.addColorStop(0.65, 'rgba(10, 2, 5, 0.92)');
    bottomScrim.addColorStop(1, 'rgba(8, 2, 4, 0.98)');
    ctx.fillStyle = bottomScrim;
    ctx.fillRect(0, 780, width, height - 780);
  } else {
    // Rich Dimensional Velvet Background with Radial Illumination
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height * 0.38,
      120,
      width / 2,
      height * 0.48,
      width * 0.88
    );
    bgGrad.addColorStop(0, festival.colors.bgMid);
    bgGrad.addColorStop(0.5, festival.colors.bgStart);
    bgGrad.addColorStop(1, festival.colors.bgEnd);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    drawLuxuryPaperTexture(ctx, width, height, 0.05);
  }

  // Double Gold Border
  drawFestivalBorder(ctx, width, height, festival.colors.accentPrimary);

  // Hallmark Header: FESTIVE WISHES
  ctx.textAlign = 'center';
  ctx.fillStyle = festival.colors.textGold;
  ctx.font = '700 22px "Cinzel Decorative", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('F E S T I V E   W I S H E S', width / 2, 115);
  ctx.letterSpacing = '0px';

  // Tagline Badge Ribbon
  ctx.save();
  ctx.fillStyle = festival.colors.badgeBg;
  ctx.strokeStyle = festival.colors.accentPrimary;
  ctx.lineWidth = 1.5;
  const tagW = 480;
  const tagH = 38;
  ctx.beginPath();
  ctx.roundRect((width - tagW) / 2, 135, tagW, tagH, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FEF08A';
  ctx.font = '600 17px "Yatra One", sans-serif';
  ctx.fillText(`॥ ${festival.taglineHi} • 2026 ॥`, width / 2, 160);
  ctx.restore();

  // Grand Festival Heading
  ctx.save();
  ctx.shadowColor = festival.colors.borderGlow;
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 4;

  const textGrad = ctx.createLinearGradient(width / 2 - 240, 220, width / 2 + 240, 300);
  textGrad.addColorStop(0, '#FFFBEB');
  textGrad.addColorStop(0.25, festival.colors.textGold);
  textGrad.addColorStop(0.75, festival.colors.accentPrimary);
  textGrad.addColorStop(1, '#D97706');

  ctx.fillStyle = textGrad;
  ctx.font = '900 84px "Rozha One", "Yatra One", serif';
  ctx.fillText(festival.headingHi, width / 2, 265);
  ctx.restore();

  // Ornamental divider
  ctx.strokeStyle = festival.colors.accentPrimary;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 295);
  ctx.lineTo(width / 2 + 200, 295);
  ctx.stroke();

  ctx.fillStyle = festival.colors.textGold;
  ctx.beginPath();
  ctx.moveTo(width / 2, 289);
  ctx.lineTo(width / 2 + 7, 295);
  ctx.lineTo(width / 2, 301);
  ctx.lineTo(width / 2 - 7, 295);
  ctx.closePath();
  ctx.fill();

  // Centerpiece Hero Artwork (for non-hero images)
  if (!isHeroImage) {
    drawFestivalArtwork(ctx, festival, width / 2, 485, 2.05);
  }

  // Personalized Greeting Message
  const isSpecial = state.recipientMode === 'special' && Boolean(state.recipientName);
  const personalizedGreeting = isSpecial
    ? template.specialTextHi(state.senderName, state.recipientName)
    : template.allTextHi(state.senderName);

  let textStartY = isHeroImage ? (isSpecial ? 840 : 870) : 720;

  // Recipient Plaque Ribbon
  if (isSpecial) {
    const bannerW = Math.min(840, Math.max(520, state.recipientName.length * 28 + 260));
    const bannerH = 58;
    const bannerX = (width - bannerW) / 2;
    const bannerY = textStartY - 46;

    ctx.save();
    const plaqueGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerW, bannerY);
    plaqueGrad.addColorStop(0, 'rgba(15, 4, 12, 0.88)');
    plaqueGrad.addColorStop(0.5, 'rgba(40, 10, 25, 0.95)');
    plaqueGrad.addColorStop(1, 'rgba(15, 4, 12, 0.88)');

    ctx.fillStyle = plaqueGrad;
    ctx.strokeStyle = festival.colors.accentPrimary;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 29);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = festival.colors.textGold;
    ctx.font = '700 32px "Yatra One", sans-serif';
    ctx.fillText(`✨ प्रिय ${state.recipientName} जी ✨`, width / 2, bannerY + 40);
    ctx.restore();

    textStartY += 65;
  }

  // Primary Greeting Text
  ctx.save();
  ctx.fillStyle = '#FFFBEB';
  const fontSize = personalizedGreeting.length > 80 ? 34 : 38;
  const lineHeight = fontSize + 16;
  ctx.font = `700 ${fontSize}px "Rozha One", "Yatra One", serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 14;

  const greetingLines = wrapText(ctx, personalizedGreeting, 960);
  greetingLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, textStartY + idx * lineHeight);
  });
  ctx.restore();

  // Inset Stationery Wish / Shloka Box
  const quoteStartY = textStartY + greetingLines.length * lineHeight + (isHeroImage ? 28 : 42);
  const quoteBoxW = 1000;
  const quoteBoxH = isHeroImage ? 180 : 195;
  const quoteBoxX = (width - quoteBoxW) / 2;

  ctx.save();
  ctx.fillStyle = isHeroImage ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0.52)';
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(quoteBoxX, quoteStartY, quoteBoxW, quoteBoxH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(quoteBoxX + 6, quoteStartY + 6, quoteBoxW - 12, quoteBoxH - 12);

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '500 27px "Yatra One", sans-serif';
  const quoteLines = wrapText(ctx, `“ ${template.quoteHi} ”`, quoteBoxW - 70);
  quoteLines.forEach((qLine, qIdx) => {
    ctx.fillText(qLine, width / 2, quoteStartY + 48 + qIdx * 40);
  });

  ctx.fillStyle = festival.colors.textGold;
  ctx.font = 'italic 19px "Poppins", sans-serif';
  const enLines = wrapText(ctx, template.englishSubtext, quoteBoxW - 70);
  if (enLines.length > 0) {
    ctx.fillText(enLines[0], width / 2, quoteStartY + quoteBoxH - 26);
  }
  ctx.restore();

  // Luxury Gilded Sender Signature Badge at Footer
  const footerY = height - 130;
  const senderBadgeW = Math.min(880, Math.max(560, state.senderName.length * 28 + 260));
  const senderBadgeH = 74;
  const senderBadgeX = (width - senderBadgeW) / 2;

  ctx.save();
  const badgeGrad = ctx.createLinearGradient(
    senderBadgeX,
    footerY,
    senderBadgeX + senderBadgeW,
    footerY
  );
  badgeGrad.addColorStop(0, festival.colors.badgeBg);
  badgeGrad.addColorStop(0.5, festival.colors.bgMid);
  badgeGrad.addColorStop(1, festival.colors.badgeBg);

  ctx.fillStyle = badgeGrad;
  ctx.strokeStyle = festival.colors.textGold;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(senderBadgeX, footerY, senderBadgeW, senderBadgeH, 37);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = festival.colors.textGold;
  ctx.font = '20px serif';
  ctx.fillText('❖', senderBadgeX + 40, footerY + 45);
  ctx.fillText('❖', senderBadgeX + senderBadgeW - 40, footerY + 45);

  ctx.fillStyle = '#FFFBEB';
  ctx.font = '700 30px "Yatra One", sans-serif';
  ctx.fillText(`सादर प्रेषक: ${state.senderName}`, width / 2, footerY + 47);

  ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
  ctx.font = '600 16px "Poppins", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('FESTIVE WISHES • FESTIVE-WISHES.APP', width / 2, height - 20);
  ctx.letterSpacing = '0px';

  ctx.restore();

  return canvas;
}
