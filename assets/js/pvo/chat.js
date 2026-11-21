// Floating PVO assistant in the OCS chat window (.msger, .msg, .msg-bubble, .msg-text from
// chatbot.scss). Only active on pages whose front matter sets `chatbot: true`.
import { apiFetch, baseurl, escapeHtml } from './api.js';

const FALLBACK = 'Sorry, I could not answer that right now. You can email '
  + '<a href="mailto:contact@powayveterans.org">contact@powayveterans.org</a> or call '
  + '<a href="tel:+18582068854">(858) 206-8854</a>.';

const STARTERS = ['How do I request help?', 'Upcoming events', 'How can I volunteer?', 'How do I donate?'];

function formatReply(text) {
  const html = escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const lines = html.split('\n');
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) out.push(`<ul class="list-disc pl-5 my-1">${list.map((item) => `<li>${item}</li>`).join('')}</ul>`);
    list = [];
  };
  lines.forEach((line) => {
    const bullet = line.match(/^\s*[-•*]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
    } else {
      flush();
      if (line.trim()) out.push(`<p class="my-1">${line}</p>`);
    }
  });
  flush();
  return out.join('');
}

export function initChat() {
  const panel = document.querySelector('[data-chat]');
  const launch = document.querySelector('[data-chat-launch]');
  const inline = panel?.hasAttribute('data-chat-inline'); // the /pvo-chatbot/ page: always open
  if (!panel || (!launch && !inline)) return;

  const log = panel.querySelector('[data-chat-log]');
  const form = panel.querySelector('[data-chat-form]');
  const input = panel.querySelector('[data-chat-input]');
  const send = panel.querySelector('[data-chat-send]');
  const history = [];
  let busy = false;
  let greeted = false;

  function addMessage(role, html, chips = []) {
    const mine = role === 'user';
    const message = document.createElement('div');
    message.className = `msg ${mine ? 'right-msg' : 'left-msg'} mb-3`;
    message.dataset.role = role;
    message.innerHTML = `
      <div class="msg-bubble ${mine ? 'bg-neutral-600' : 'bg-neutral-800'} text-neutral-100 border border-neutral-700">
        <div class="msg-info"><div class="msg-info-name text-xs text-neutral-300">${mine ? 'You' : 'PVO Assistant'}</div></div>
        <div class="msg-text text-neutral-100">${html}</div>
      </div>`;
    if (chips.length) {
      const row = document.createElement('div');
      row.className = 'flex flex-wrap gap-2 mt-2';
      chips.forEach((label) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'small secondary'; // OCS button (passes contrast on <button>)
        chip.textContent = label;
        chip.addEventListener('click', () => ask(label));
        row.append(chip);
      });
      message.querySelector('.msg-bubble').append(row);
    }
    log.append(message);
    log.scrollTop = log.scrollHeight;
    return message;
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMessage('bot', '<p class="my-1">Hi, and thank you for stopping by. I can help with assistance requests, volunteering, donations, events, and how to reach PVO.</p>'
      + `<p class="my-1">Need help with a repair? <a href="${baseurl}/prescreener">Start a request</a>.</p>`, STARTERS);
  }

  function setOpen(open) {
    panel.classList.toggle('hidden', !open);
    panel.classList.toggle('flex', open);
    launch.setAttribute('aria-expanded', String(open));
    launch.classList.toggle('hidden', open);
    if (open) {
      greet();
      input.focus();
    } else {
      launch.focus();
    }
  }

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    busy = true;
    send.disabled = true;
    input.value = '';
    addMessage('user', escapeHtml(question));
    history.push({ role: 'user', content: question });
    const typing = addMessage('bot', '<span class="text-neutral-300">Typing…</span>');

    const result = await apiFetch('/api/chat', { method: 'POST', body: { messages: history }, timeout: 45000 });
    typing.remove();
    const reply = result.ok ? result.data?.content?.[0]?.text : null;
    if (reply) {
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', formatReply(reply));
    } else {
      history.pop();
      addMessage('bot', `<p class="my-1">${FALLBACK}</p>`);
    }
    busy = false;
    send.disabled = false;
    input.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });
  if (inline) {
    greet();
    panel.dataset.ready = 'true';
    return;
  }
  launch.addEventListener('click', () => setOpen(true));
  panel.querySelector('[data-chat-close]').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.classList.contains('hidden')) setOpen(false);
  });
  // Links to the stand-alone assistant page open the panel instead when it is available
  document.querySelectorAll('a[href$="/pvo-chatbot/"], [data-chat-open]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setOpen(true);
    });
  });
  panel.dataset.ready = 'true'; // the launcher works from now on
}
