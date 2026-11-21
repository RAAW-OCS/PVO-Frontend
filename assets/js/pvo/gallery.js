// Event recaps: photos and videos from past events (the events API, newest first).
// Used by the /gallery/ page and the "From recent events" section on the homepage.
// Tiles are OCS glowOnHover cards; clicking one opens the OCS modal.
import { escapeHtml, formatLongDate, loadEvents, mediaInfo } from './api.js';
import { eventDetailsHtml } from './calendar.js';
import { initModal, openModal } from './modal.js';

/** Past events that have a picture or video, newest first. */
export function recapEvents(events, now = new Date()) {
  return events
    .filter((event) => (event.end || event.start) < now && mediaInfo(event.image_url))
    .sort((a, b) => b.start - a.start);
}

function recapHtml(event) {
  const media = mediaInfo(event.image_url);
  const isVideo = media.type !== 'image';
  const picture = media.thumb
    ? `<img class="w-full h-full object-cover rounded-t-xl" src="${escapeHtml(media.thumb)}" alt="" loading="lazy">`
    : '';
  return `
    <li class="m-0">
      <button type="button" class="glowOnHover rounded-xl w-full h-full text-left flex flex-col" data-recap-id="${event.id}">
        <span class="relative block w-full aspect-video rounded-t-xl bg-neutral-900">
          ${picture}
          ${isVideo ? '<span class="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold bg-neutral-900 text-neutral-50">Video</span>' : ''}
        </span>
        <span class="block p-3">
          <span class="block font-bold">${escapeHtml(event.title)}</span>
          <span class="block text-sm text-neutral-400">${escapeHtml(formatLongDate(event.start))}</span>
        </span>
      </button>
    </li>`;
}

/** Fill a list with recap tiles. Returns how many were shown. */
export function renderRecaps(list, events, { limit = Infinity } = {}) {
  const recaps = recapEvents(events).slice(0, limit);
  list.innerHTML = recaps.map(recapHtml).join('');
  initModal();
  list.onclick = (clickEvent) => {
    const tile = clickEvent.target.closest('[data-recap-id]');
    const match = tile && recaps.find((item) => String(item.id) === tile.dataset.recapId);
    if (match) openModal(eventDetailsHtml(match));
  };
  return recaps.length;
}

async function initGalleryPage() {
  const list = document.querySelector('[data-recaps-page]');
  if (!list) return;
  const status = document.querySelector('[data-recaps-status]');
  const { ok, events } = await loadEvents();
  if (!ok) {
    status.textContent = 'Photos and videos could not be loaded right now. Please try again later.';
    return;
  }
  const shown = renderRecaps(list, events);
  status.textContent = shown
    ? `${shown} event${shown === 1 ? '' : 's'} with photos or video.`
    : 'No photos or videos yet. Pictures and clips from past events will appear here.';
}

initGalleryPage();
