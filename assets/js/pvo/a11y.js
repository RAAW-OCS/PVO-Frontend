// Accessibility toolbar (_includes/pvo/a11y-panel.html): text size, colour theme, read aloud,
// and reading aids.
//  - Text size, colour theme and reading speed are OCS preferences: they are saved and applied
//    by window.SitePreferences (assets/js/user-preferences.js), the same settings as the
//    Accessibility page, so the two always agree.
//  - Reading aids are Tailwind classes on <body> (lists in a11y-boot.js, which applies the saved
//    ones before the page shows).
import { createReader } from './reader.js';

const AIDS = window.PVO_READING_AIDS || {};
const AIDS_KEY = window.PVO_READING_AIDS_KEY || 'pvoAccessibility';
const SIZES = [16, 18.4, 20.8, 24];
const RATES = [0.8, 1, 1.25];
// Settings saved by the earlier PVO toolbar, moved over to OCS preferences once
const OLD_SIZES = { lg: 18.4, xl: 20.8, xxl: 24 };
const OLD_THEMES = { light: 'Light', warm: 'Sepia', navy: 'Midnight', contrast: 'High Contrast' };

function loadAids() {
  try {
    return JSON.parse(window.localStorage.getItem(AIDS_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function saveAids(aids) {
  try {
    window.localStorage.setItem(AIDS_KEY, JSON.stringify(aids));
  } catch {
    // private browsing or storage turned off: the aids still apply for this visit
  }
}

function setAid(aid, on) {
  const classes = AIDS[aid] || [];
  if (on) document.body.classList.add(...classes);
  else document.body.classList.remove(...classes);
}

export function initA11y() {
  const holder = document.querySelector('[data-a11y-panel]');
  // the button in the top bar and the round button that is always on screen
  const openButtons = [...document.querySelectorAll('[data-a11y-open]')];
  if (!holder || !openButtons.length) return;
  const panel = holder.querySelector('section');
  const closeButton = panel.querySelector('[data-a11y-close]');
  const engine = window.SitePreferences;
  let opener = openButtons[0];

  const same = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();
  const ocsPrefs = () => engine?.getPreferences?.() || { ...(engine?.PRESETS?.['Site Default'] || {}) };
  const saveOcs = (changes) => engine?.savePreferences?.({ ...ocsPrefs(), ...changes });

  function currentTheme(prefs) {
    const presets = engine?.PRESETS || {};
    // each OCS preset has its own background colour
    return Object.keys(presets).find((name) => same(presets[name].bg, prefs.bg)) || '';
  }

  function migrateOldSettings() {
    const old = loadAids();
    const oldRate = Number(old.rate);
    if (!old.text && !old.theme && !old.rate) return;
    if (engine?.savePreferences && !engine.getPreferences()) {
      const changes = {};
      const preset = engine.PRESETS[OLD_THEMES[old.theme]];
      if (preset) Object.assign(changes, { bg: preset.bg, text: preset.text, font: preset.font, accent: preset.accent });
      if (OLD_SIZES[old.text]) changes.size = OLD_SIZES[old.text];
      // only settings that were changed from the defaults (normal size, default look, normal speed)
      if (RATES.includes(oldRate) && oldRate !== 1) changes.ttsRate = oldRate;
      if (Object.keys(changes).length) saveOcs(changes);
    }
    const { underline, spacing, motion } = old;
    saveAids({ underline: underline === true, spacing: spacing === true, motion: motion === true });
  }

  function render() {
    const prefs = engine?.getPreferences?.() || {};
    const pressed = {
      // nearest step, so a size saved by the whole-pixel slider on the Accessibility page (21) still shows as 130%
      size: String(SIZES.find((size) => Math.abs(size - (Number(prefs.size) || 16)) < 0.5) || ''),
      theme: prefs.bg ? currentTheme(prefs) : 'Site Default',
    };
    panel.querySelectorAll('[data-a11y-choice]').forEach((group) => {
      group.querySelectorAll('[data-value]').forEach((button) => {
        const on = button.dataset.value === pressed[group.dataset.a11yChoice];
        button.setAttribute('aria-pressed', String(on));
        // OCS button styles: the chosen one is primary
        button.classList.toggle('primary', on);
        button.classList.toggle('secondary', !on);
        const mark = button.querySelector('[data-check]');
        if (mark) mark.hidden = !on;
      });
    });
    const aids = loadAids();
    panel.querySelectorAll('[data-a11y-aid]').forEach((input) => {
      input.checked = aids[input.dataset.a11yAid] === true;
    });
    // a speed picked with the slider on the Accessibility page is shown as its own choice
    const rateSelect = panel.querySelector('[data-a11y-rate]');
    const rate = Number(prefs.ttsRate) || 1;
    const listed = RATES.find((r) => Math.abs(r - rate) < 0.01);
    rateSelect.querySelector('[data-custom-rate]')?.remove();
    if (!listed) {
      const option = new Option(`${rate}x (set on the Accessibility page)`, String(rate));
      option.dataset.customRate = '';
      rateSelect.add(option);
    }
    rateSelect.value = String(listed || rate);
  }

  function setOpen(open) {
    holder.hidden = !open;
    openButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    if (open) {
      render();
      closeButton.focus();
    }
  }

  function close() {
    setOpen(false);
    opener.focus();
  }

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      setOpen(holder.hidden);
    });
  });
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !holder.hidden) close();
  });
  document.addEventListener('click', (event) => {
    if (!holder.hidden && !panel.contains(event.target) && !openButtons.some((button) => button.contains(event.target))) {
      setOpen(false);
    }
  });

  // ---- text size and colour theme (OCS preferences) ----
  const choices = panel.querySelectorAll('[data-a11y-choice]');
  if (!engine?.savePreferences) {
    choices.forEach((group) => group.closest('fieldset').remove());
  }
  // each theme's colour dot shows that OCS preset's background
  panel.querySelectorAll('[data-a11y-choice="theme"] [data-value]').forEach((button) => {
    const bg = engine?.PRESETS?.[button.dataset.value]?.bg;
    if (bg) button.querySelector('[data-swatch]')?.setAttribute('fill', bg);
  });
  choices.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('[data-value]');
      if (!button) return;
      if (group.dataset.a11yChoice === 'size') {
        saveOcs({ size: Number(button.dataset.value) });
      } else {
        const preset = engine.PRESETS[button.dataset.value];
        if (!preset) return;
        // like the OCS preset buttons, but the chosen text size is kept
        const prefs = { ...ocsPrefs(), bg: preset.bg, text: preset.text, font: preset.font, accent: preset.accent };
        delete prefs.selectionColor;
        engine.savePreferences(prefs);
      }
      render();
    });
  });

  // ---- reading aids ----
  panel.querySelectorAll('[data-a11y-aid]').forEach((input) => {
    input.addEventListener('change', () => {
      const aids = { ...loadAids(), [input.dataset.a11yAid]: input.checked };
      saveAids(aids);
      setAid(input.dataset.a11yAid, input.checked);
    });
  });

  // ---- read aloud ----
  const reduceMotion = () => loadAids().motion === true || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reader = createReader({ getRate: () => Number(ocsPrefs().ttsRate) || 1, reduceMotion });
  panel.querySelector('[data-a11y-rate]').addEventListener('change', (event) => {
    saveOcs({ ttsRate: Number(event.target.value) });
  });

  const note = panel.querySelector('[data-read-note]');
  const readButtons = panel.querySelectorAll('[data-read]');
  const showNote = (text) => {
    note.innerHTML = text ? '<p class="overall-status partial text-sm mt-3 mb-0"></p>' : '';
    if (text) note.firstChild.textContent = text;
  };
  if (!reader.supported) {
    readButtons.forEach((button) => {
      button.disabled = true;
    });
    panel.querySelector('[data-a11y-rate]').disabled = true;
    showNote('Read aloud is not available in this browser.');
  }
  readButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showNote('');
      if (button.dataset.read === 'page') {
        setOpen(false);
        reader.readPage();
        return;
      }
      if (reader.readSelection()) setOpen(false);
      else showNote('Nothing is highlighted yet. Drag across some text on the page (or press and hold on a phone), then press Read selected text.');
    });
  });

  // ---- reset ----
  panel.querySelector('[data-a11y-reset]').addEventListener('click', () => {
    reader.stop();
    engine?.clearPreferences?.();
    Object.keys(AIDS).forEach((aid) => setAid(aid, false));
    saveAids({});
    showNote('');
    render();
  });

  migrateOldSettings();
  Object.entries(loadAids()).forEach(([aid, on]) => setAid(aid, on === true));
  render();
  holder.dataset.ready = 'true';
}
