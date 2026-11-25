// Runs on every PVO page: login state, log out, the accessibility toolbar, and the assistant.
// The page layout, sidebar menu and accessibility preferences come from OCS
// (_layouts/aesthetihawk.html and assets/js/user-preferences.js).
import { baseurl, canManageEvents, getSession, isAdmin, isGuest, roleLabel, signOut } from './api.js';
import { initA11y } from './a11y.js';
import { initChat } from './chat.js';

/**
 * Show or hide elements by their data-show attribute:
 * signed-in, signed-out, admin, not-admin (everyone except admins), non-admin (signed in, not admin),
 * staff (administrators and event organizers, who can open Admin Tools), not-staff,
 * guest, member (signed in, not a guest). Also fills in [data-pvo-name] and [data-pvo-role].
 */
export function applySession(session, root = document) {
  const signedIn = session.state === 'signed-in';
  const rules = {
    'signed-in': signedIn,
    'signed-out': !signedIn,
    admin: isAdmin(session),
    'not-admin': !isAdmin(session),
    'non-admin': signedIn && !isAdmin(session),
    staff: canManageEvents(session),
    'not-staff': !canManageEvents(session),
    guest: isGuest(session),
    member: signedIn && !isGuest(session),
  };
  root.querySelectorAll('[data-show]').forEach((element) => {
    element.hidden = !rules[element.dataset.show];
  });
  root.querySelectorAll('[data-pvo-name]').forEach((element) => {
    element.textContent = signedIn ? session.user.name : '';
  });
  root.querySelectorAll('[data-pvo-role]').forEach((element) => {
    element.textContent = signedIn ? roleLabel(session.user.role).toLowerCase() : '';
  });
}

/** Re-check the login with the backend and update the page. */
export async function refreshSession() {
  const session = await getSession({ refresh: true });
  applySession(session);
  return session;
}

function initLogOut() {
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-pvo-signout]');
    if (!button) return;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'Logging out…';
    const result = await signOut();
    if (result.ok) {
      window.location.assign(`${baseurl}/`);
      return;
    }
    button.disabled = false;
    button.textContent = label;
    window.alert(result.message);
  });
}

initLogOut();
initA11y();
initChat();
getSession().then((session) => applySession(session));

// Like the old homepage: re-check the login when the page is shown again
// (back/forward navigation) or the tab becomes visible.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) refreshSession();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') refreshSession();
});
