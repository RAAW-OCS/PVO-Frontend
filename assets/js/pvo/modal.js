// The OCS modal (calendar.scss: .modal, .modal-content, .close) used for event details and
// photos/videos. Markup: _includes/pvo/modal.html. OCS hides .modal; adding the Tailwind
// `block` class shows it.

let opener = null;

function modalElement() {
  return document.querySelector('[data-modal]');
}

function focusable(modal) {
  return [...modal.querySelectorAll('a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])')];
}

export function closeModal() {
  const modal = modalElement();
  if (!modal || !modal.classList.contains('block')) return;
  modal.classList.remove('block');
  modal.querySelector('[data-modal-body]').innerHTML = ''; // stops any video that was playing
  document.body.classList.remove('overflow-hidden');
  if (opener && document.contains(opener)) opener.focus();
  opener = null;
}

/** Show html in the modal. The content should contain an element with id="pvo-modal-title". */
export function openModal(html) {
  const modal = modalElement();
  if (!modal) return;
  opener = document.activeElement;
  modal.querySelector('[data-modal-body]').innerHTML = html;
  modal.classList.add('block');
  document.body.classList.add('overflow-hidden');
  modal.querySelector('[data-modal-close]').focus();
}

export function initModal() {
  const modal = modalElement();
  if (!modal || modal.dataset.ready) return;
  modal.dataset.ready = 'true';
  modal.querySelector('[data-modal-close]').addEventListener('click', closeModal);
  // a click on the dark overlay (outside the content) closes it
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('block')) return;
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    // keep keyboard focus inside the modal while it is open
    const items = focusable(modal);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
