// Homepage: member login bar, "next event" card, recent photos, and the community calendar.
import { escapeHtml, formatLongDate, formatTimeRange, loadEvents } from './api.js';
import { enableWhenReady, logIn, setStatus, startGuest, whileBusy } from './auth.js';
import { initCalendar, openEvent } from './calendar.js';
import { renderRecaps } from './gallery.js';
import { initModal } from './modal.js';
import { refreshSession } from './site.js';

function initMemberBar() {
  const form = document.querySelector('[data-quick-login]');
  const status = document.querySelector('[data-quick-status]');
  const guestButton = document.querySelector('[data-quick-guest]');
  if (!form) return;

  const signedIn = async (name) => {
    form.reset();
    setStatus(status, '');
    await refreshSession(); // the bar switches to "Welcome back, <name>"
    document.querySelector('[data-welcome-title]')?.focus();
    return name;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus(status, '');
    const uid = form.uid.value.trim();
    const button = form.querySelector('[type="submit"]');
    const result = await whileBusy(button, 'Logging in…', () => logIn(uid, form.password.value));
    if (!result.ok) {
      setStatus(status, result.message);
      (uid ? form.password : form.uid).focus();
      return;
    }
    await signedIn(result.name);
  });

  guestButton?.addEventListener('click', async () => {
    setStatus(status, '');
    const result = await whileBusy(guestButton, 'Starting…', startGuest);
    if (!result.ok) {
      setStatus(status, result.message);
      return;
    }
    await signedIn(result.name);
  });
  enableWhenReady(form.querySelector('[type="submit"]'), guestButton);
}

function renderNextEvent(slot, events, ok) {
  if (!slot) return;
  if (!ok) {
    slot.innerHTML = '<p class="m-0">The calendar could not be loaded right now. Please check back soon.</p>';
    return;
  }
  const now = new Date();
  const next = events.find((event) => (event.end || event.start) >= now);
  if (!next) {
    slot.innerHTML = '<p class="m-0">Nothing is scheduled yet. New workdays, fundraisers, and get-togethers are posted here first.</p>';
    return;
  }
  slot.innerHTML = `
    <button type="button" class="w-full text-left" data-next-id="${next.id}">
      <span class="block text-lg font-bold" data-next-title>${escapeHtml(next.title)}</span>
      <span class="block text-sm text-neutral-400">${escapeHtml(formatLongDate(next.start))} &middot; ${escapeHtml(formatTimeRange(next.start, next.end))}</span>
      ${next.location ? `<span class="block text-sm text-neutral-400">${escapeHtml(next.location)}</span>` : ''}
    </button>`;
  slot.querySelector('[data-next-id]').addEventListener('click', () => openEvent(next));
}

async function init() {
  initMemberBar();
  initModal();
  const { ok, events } = await loadEvents();
  renderNextEvent(document.querySelector('[data-next-event]'), events, ok);
  const recaps = document.querySelector('[data-home-recaps]');
  if (recaps && ok && renderRecaps(recaps.querySelector('[data-recaps]'), events, { limit: 3 }) > 0) {
    recaps.hidden = false;
  }
  const calendar = document.querySelector('[data-pvo-calendar]');
  if (calendar) {
    initCalendar(calendar, events, { ok });
    if (!ok) {
      setStatus(document.querySelector('[data-calendar-status]'), 'The calendar is temporarily unavailable. Please try again later.', 'info');
    }
  }
}

init();
