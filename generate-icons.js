const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4a017"/>
      <stop offset="50%" style="stop-color:#f3d98a"/>
      <stop offset="100%" style="stop-color:#d4a017"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#0a0a0a"/>
  <rect x="${Math.round(size * 0.05)}" y="${Math.round(size * 0.05)}" width="${Math.round(size * 0.9)}" height="${Math.round(size * 0.9)}" rx="${Math.round(size * 0.15)}" fill="none" stroke="url(#gold)" stroke-width="${Math.max(2, Math.round(size * 0.02))}"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="url(#gold)" font-family="Georgia, serif" font-weight="bold" font-size="${Math.round(size * 0.5)}">A</text>
</svg>`;
  
  fs.writeFileSync(path.join(iconDir, `icon-${size}.svg`), svg);
  // Also create a simple copy as png reference (browsers will use svg)
  fs.writeFileSync(path.join(iconDir, `icon-${size}.png`), svg);
});

console.log('Icons generated:', sizes.map(s => `icon-${s}`).join(', '));
