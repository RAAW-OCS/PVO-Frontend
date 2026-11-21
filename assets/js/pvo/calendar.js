// Homepage calendar: FullCalendar styled by OCS (calendar.scss), as on the OCS Calendar page.
// Events open in the OCS modal. FullCalendar itself is loaded by index.md from the same CDN
// version the OCS Calendar page uses.
import { escapeHtml, formatLongDate, formatTimeRange, mediaHtml, mediaInfo } from './api.js';
import { openModal } from './modal.js';

/** Event details for the OCS modal. */
export function eventDetailsHtml(event) {
  return `
    ${mediaHtml(mediaInfo(event.image_url), event.title)}
    <p class="text-sm text-neutral-400 m-0">${escapeHtml(formatLongDate(event.start))} &middot; ${escapeHtml(formatTimeRange(event.start, event.end))}</p>
    <h2 id="pvo-modal-title" class="text-2xl font-bold mt-2 mb-2">${escapeHtml(event.title)}</h2>
    ${event.location ? `<p class="m-0 mb-3"><span class="text-neutral-400">Where:</span> ${escapeHtml(event.location)}</p>` : ''}
    <p class="whitespace-pre-line">${escapeHtml(event.description)}</p>`;
}

export function openEvent(event) {
  openModal(eventDetailsHtml(event));
}

/** Make an event in the calendar reachable and usable with the keyboard. */
function makeKeyboardFriendly(info) {
  // list view: the link inside the title cell (one tab stop, no button role on a table cell)
  const target = info.el.querySelector('.fc-list-event-title a') || info.el;
  target.setAttribute('tabindex', '0');
  target.setAttribute('role', 'button');
  const end = info.event.end || null;
  target.setAttribute('aria-label', `${info.event.title}, ${formatLongDate(info.event.start)}, ${formatTimeRange(info.event.start, end)}`);
  target.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      keyEvent.preventDefault();
      target.click();
    }
  });
}

/**
 * Render the calendar into element. Phones start on the "Coming up" list, larger screens on the month.
 * Returns the FullCalendar instance, or null when FullCalendar could not be loaded.
 */
export function initCalendar(element, events, { ok = true } = {}) {
  if (!window.FullCalendar) {
    element.innerHTML = '<p class="overall-status partial">The calendar could not be shown. Please refresh the page.</p>';
    return null;
  }
  const narrow = window.matchMedia('(max-width: 639px)').matches;
  // "Coming up" starts at midnight, so on its current page it would still list events that ended
  // earlier today. Those are left out there (the month grid and earlier pages keep them).
  let viewType = narrow ? 'listUpcoming' : 'dayGridMonth';
  const eventsFor = ({ start, end }) => {
    const now = Date.now();
    const hideEnded = viewType === 'listUpcoming' && start.valueOf() <= now && now < end.valueOf();
    return events
      .filter((event) => !hideEnded || new Date(event.end || event.start).valueOf() >= now)
      .map((event) => ({ id: String(event.id), title: event.title, start: event.start, end: event.end || undefined }));
  };
  const calendar = new window.FullCalendar.Calendar(element, {
    initialView: viewType,
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listUpcoming' },
    buttonText: { today: 'Today' },
    views: {
      dayGridMonth: { buttonText: 'Month' },
      listUpcoming: { type: 'list', duration: { days: 120 }, buttonText: 'Coming up' },
    },
    height: 'auto',
    // a sticky day-name row gets FullCalendar's white "page" background and would sit under the fixed OCS top bar
    stickyHeaderDates: false,
    dayMaxEvents: 3,
    events: (range, success) => success(eventsFor(range)),
    // FullCalendar fetches for a new view before reporting it, so fetch again once the view has changed
    datesSet: (info) => {
      if (info.view.type === viewType) return;
      viewType = info.view.type;
      calendar.refetchEvents();
    },
    noEventsContent: ok
      ? 'No upcoming events are posted yet. New workdays and gatherings appear here as soon as they are scheduled.'
      : 'The calendar is temporarily unavailable. Please try again later.',
    eventClick: (info) => {
      info.jsEvent.preventDefault();
      const match = events.find((event) => String(event.id) === info.event.id);
      if (!match) return;
      // FullCalendar stops the browser focusing a clicked event, so focus it here:
      // the modal returns focus to whatever had it when it opened
      (info.el.querySelector('[role="button"]') || info.el).focus({ preventScroll: true });
      openEvent(match);
    },
    eventDidMount: makeKeyboardFriendly,
  });
  calendar.render();
  return calendar;
}
