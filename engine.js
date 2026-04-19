/* engine.js — Dynamic Theme Engine Core Logic */

'use strict';

/* ── ELEMENT REFS ── */
const root = document.documentElement;

const inputs = {
  primary:       document.getElementById('colorPrimary'),
  accent:        document.getElementById('colorAccent'),
  bg:            document.getElementById('colorBg'),
  surface:       document.getElementById('colorSurface'),
  text:          document.getElementById('colorText'),
  fontFamily:    document.getElementById('fontFamily'),
  fontSize:      document.getElementById('fontSize'),
  lineHeight:    document.getElementById('lineHeight'),
  letterSpacing: document.getElementById('letterSpacing'),
  radius:        document.getElementById('borderRadius'),
  spacing:       document.getElementById('spacing'),
  shadow:        document.getElementById('shadow'),
};

const labels = {
  primary:       document.getElementById('hexPrimary'),
  accent:        document.getElementById('hexAccent'),
  bg:            document.getElementById('hexBg'),
  surface:       document.getElementById('hexSurface'),
  text:          document.getElementById('hexText'),
  fontSize:      document.getElementById('fontSizeVal'),
  lineHeight:    document.getElementById('lineHeightVal'),
  letterSpacing: document.getElementById('letterSpacingVal'),
  radius:        document.getElementById('radiusVal'),
  spacing:       document.getElementById('spacingVal'),
  shadow:        document.getElementById('shadowVal'),
};

const shadowLevels = [
  'none',
  '0 8px 32px rgba(0,0,0,0.4)',
  '0 16px 48px rgba(0,0,0,0.6)',
  '0 24px 64px rgba(0,0,0,0.8)',
];

/* ── SHADOW LABEL MAP ── */
const shadowNames = ['None', 'Medium', 'Strong', 'Deep'];

/* ── APPLY THEME ── */
function applyTheme() {
  const p  = inputs.primary.value;
  const a  = inputs.accent.value;
  const bg = inputs.bg.value;
  const su = inputs.surface.value;
  const tx = inputs.text.value;

  root.style.setProperty('--color-primary', p);
  root.style.setProperty('--color-accent',  a);
  root.style.setProperty('--color-bg',      bg);
  root.style.setProperty('--color-surface', su);
  root.style.setProperty('--color-text',    tx);

  // Derive muted from text
  root.style.setProperty('--color-muted',  hexWithAlpha(tx, 0.5));
  root.style.setProperty('--color-border', hexWithAlpha(tx, 0.08));

  // Header bg to match
  const header = document.querySelector('.site-header');
  if (header) {
    const [r2, g2, b2] = hexToRgb(bg);
    header.style.background = `rgba(${r2},${g2},${b2},0.85)`;
  }

  // Typography
  root.style.setProperty('--font-family',   inputs.fontFamily.value);
  root.style.setProperty('--font-size-base', inputs.fontSize.value + 'px');
  root.style.setProperty('--line-height',    inputs.lineHeight.value);
  root.style.setProperty('--letter-spacing', inputs.letterSpacing.value + 'px');

  // Shape
  root.style.setProperty('--radius',  inputs.radius.value + 'px');
  root.style.setProperty('--spacing', inputs.spacing.value);

  // Shadow
  const shadowIdx = parseInt(inputs.shadow.value);
  root.style.setProperty('--shadow', shadowLevels[shadowIdx]);

  // Update hex labels
  labels.primary.textContent  = p;
  labels.accent.textContent   = a;
  labels.bg.textContent       = bg;
  labels.surface.textContent  = su;
  labels.text.textContent     = tx;

  // Slider labels
  labels.fontSize.textContent      = inputs.fontSize.value + 'px';
  labels.lineHeight.textContent    = parseFloat(inputs.lineHeight.value).toFixed(1);
  labels.letterSpacing.textContent = inputs.letterSpacing.value + 'px';
  labels.radius.textContent        = inputs.radius.value + 'px';
  labels.spacing.textContent       = parseFloat(inputs.spacing.value).toFixed(1) + '×';
  labels.shadow.textContent        = shadowNames[shadowIdx];

  // Update range track fill
  updateRangeFills();
}

/* ── RANGE FILL (CSS custom property trick) ── */
function updateRangeFills() {
  const ranges = document.querySelectorAll('input[type="range"]');
  ranges.forEach(r => {
    const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty('--pct', pct + '%');
  });
}

/* ── APPLY PRESET ── */
function applyPreset(name) {
  const p = PRESETS[name];
  if (!p) return;

  inputs.primary.value       = p.primary;
  inputs.accent.value        = p.accent;
  inputs.bg.value            = p.bg;
  inputs.surface.value       = p.surface;
  inputs.text.value          = p.text;
  inputs.fontFamily.value    = p.font;
  inputs.fontSize.value      = p.fontSize;
  inputs.radius.value        = p.radius;
  inputs.shadow.value        = p.shadow;
  inputs.spacing.value       = p.spacing;

  applyTheme();
  showToast(`✦ ${name.charAt(0).toUpperCase() + name.slice(1)} theme applied`);
}

/* ── EXPORT JSON ── */
function exportJSON() {
  const theme = collectTheme();
  const blob  = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'theme.json');
  showToast('⬇ theme.json downloaded');
}

/* ── EXPORT CSS ── */
function exportCSS() {
  const theme = collectTheme();
  const css   = buildCSSVars(theme);
  const blob  = new Blob([css], { type: 'text/css' });
  downloadBlob(blob, 'theme.css');
  showToast('⬇ theme.css downloaded');
}

/* ── COPY CSS VARS ── */
function copyCSS() {
  const theme = collectTheme();
  const css   = buildCSSVars(theme);
  navigator.clipboard.writeText(css).then(() => {
    showToast('⎘ CSS variables copied!');
  });
}

/* ── BUILD CSS :root BLOCK ── */
function buildCSSVars(theme) {
  return `:root {
  /* Colors */
  --color-primary:   ${theme.colors.primary};
  --color-accent:    ${theme.colors.accent};
  --color-bg:        ${theme.colors.bg};
  --color-surface:   ${theme.colors.surface};
  --color-text:      ${theme.colors.text};

  /* Typography */
  --font-family:     ${theme.typography.fontFamily};
  --font-size-base:  ${theme.typography.fontSize}px;
  --line-height:     ${theme.typography.lineHeight};
  --letter-spacing:  ${theme.typography.letterSpacing}px;

  /* Shape */
  --radius:  ${theme.shape.radius}px;
  --spacing: ${theme.shape.spacing};
  --shadow:  ${theme.shape.shadow};
}`;
}

/* ── COLLECT CURRENT THEME ── */
function collectTheme() {
  return {
    name: 'custom',
    exportedAt: new Date().toISOString(),
    colors: {
      primary: inputs.primary.value,
      accent:  inputs.accent.value,
      bg:      inputs.bg.value,
      surface: inputs.surface.value,
      text:    inputs.text.value,
    },
    typography: {
      fontFamily:    inputs.fontFamily.value,
      fontSize:      parseInt(inputs.fontSize.value),
      lineHeight:    parseFloat(inputs.lineHeight.value),
      letterSpacing: parseFloat(inputs.letterSpacing.value),
    },
    shape: {
      radius:  parseInt(inputs.radius.value),
      spacing: parseFloat(inputs.spacing.value),
      shadow:  shadowLevels[parseInt(inputs.shadow.value)],
    },
  };
}

/* ── RESET ── */
function resetAll() {
  applyPreset('midnight');
  inputs.lineHeight.value    = 1.6;
  inputs.letterSpacing.value = 0;
  applyTheme();
  showToast('↺ Theme reset to default');
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── DOWNLOAD HELPER ── */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/* ── COLOR HELPERS ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function hexWithAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── WIRE UP EVENTS ── */

// All color inputs
['primary', 'accent', 'bg', 'surface', 'text'].forEach(key => {
  inputs[key].addEventListener('input', applyTheme);
});

// All range + select inputs
['fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'radius', 'spacing', 'shadow'].forEach(key => {
  inputs[key].addEventListener('input', applyTheme);
});

// Presets
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
});

// Exports
document.getElementById('exportJSON').addEventListener('click', exportJSON);
document.getElementById('exportCSS').addEventListener('click', exportCSS);
document.getElementById('copyCSS').addEventListener('click', copyCSS);
document.getElementById('resetAll').addEventListener('click', resetAll);

// Toggles in preview (just UI demo)
document.querySelectorAll('.toggle').forEach(t => {
  t.addEventListener('click', () => t.classList.toggle('active'));
});

/* ── INIT ── */
applyTheme();
updateRangeFills();
