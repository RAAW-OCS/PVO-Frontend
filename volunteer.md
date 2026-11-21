---
layout: pvo
title: Volunteer with PVO
permalink: /volunteer
hide_title: true
active_tab: volunteer
chatbot: true
---
{%- comment -%}
  Volunteer sign-up. Built from OCS pieces only: OCS card panels, buttons, .form-group fields, .switch
  toggles and status boxes; Tailwind arrangement. Sends the form to POST /api/volunteers.
{%- endcomment -%}
<section aria-labelledby="volunteer-title">
  <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Join the mission</p>
  <h1 id="volunteer-title" class="!block text-3xl md:text-5xl font-bold leading-tight mt-2 mb-4">Give your time. Change a veteran's life.</h1>
  <p class="text-lg max-w-3xl mb-6">PVO volunteers are the reason area veterans have roofs over their heads, wheels under them, and someone in their corner. Find your role below, then sign up in minutes.</p>
  <div class="flex flex-wrap gap-3 mt-6">
    <a href="#volunteer-roles" class="large filledTinted primary inline-flex items-center">Find my role</a>
    <a href="#volunteer-form" class="large primary inline-flex items-center">Go to the sign-up form</a>
  </div>
</section>

<dl class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 m-0">
  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">340+</dt><dd class="m-0 text-sm text-neutral-400">Veterans served</dd></div>
  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">6</dt><dd class="m-0 text-sm text-neutral-400">Volunteer teams</dd></div>
  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">8,200+</dt><dd class="m-0 text-sm text-neutral-400">Volunteer hours logged</dd></div>
  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">100%</dt><dd class="m-0 text-sm text-neutral-400">Volunteer-driven</dd></div>
</dl>

<section id="volunteer-roles" class="mt-12 scroll-mt-20" aria-labelledby="roles-title">
  <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Where you fit in</p>
  <h2 id="roles-title" class="text-2xl font-bold mt-1 mb-2">Six teams. One mission.</h2>
  <p class="max-w-3xl mb-6">Every volunteer is matched to a team based on skills, availability, and interest. Open a team to read more, which also ticks it in the sign-up form below.</p>
  {%- capture teams -%}
  hammer|Home Repair|Home repair|Carpentry, drywall, painting, and general handyman work at veterans' homes. Our most active and impactful team.|4–8 hrs/project;Any skill level
  flag|Events|Events &amp; fundraising|Support the annual golf tournament and other PVO events: setup, registration, logistics, and community outreach.|Seasonal / event-based;No experience needed
  chat|Outreach|Community outreach|Connect with veteran service organizations, attend community events, and help spread awareness of PVO's programs.|2–4 hrs/month;Communication skills
  clipboard|Admin|Admin &amp; coordination|Scheduling, record-keeping, donor acknowledgment letters, and volunteer coordination support from home or on-site.|Flexible hours;Organized, detail-oriented
  car|Transport|Transport|Drive veterans to medical appointments, help haul materials to project sites, and assist with equipment pickup and delivery.|As-needed scheduling;Valid CA driver's license
  gear|Skilled Trades|Skilled trades|Licensed plumbers, electricians, welders, and mechanics. Tackle complex repairs that need professional-level expertise.|Project-based;Licensed or certified;High demand
  {%- endcapture -%}
  <ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-0 m-0 list-none">
    {%- assign team_rows = teams | strip | newline_to_br | split: '<br />' %}
    {%- for row in team_rows %}
    {%- assign t = row | strip | split: '|' %}
    {%- assign team_icon = t[0] %}
    {%- assign tags = t[4] | split: ';' %}
    <li class="m-0 group role-card p-4 rounded-lg bg-neutral-800 border border-neutral-700 [&.open]:border-indigo-500">
      <button type="button" class="w-full flex items-center gap-3 text-left" aria-expanded="false" aria-controls="team-{{ forloop.index }}" onclick="toggleRole(this.closest('.role-card'), '{{ t[1] }}')">
        {% include aesthetihawk/icon.html name=team_icon class="w-7 h-7" %}
        <span class="flex-1 text-lg font-bold">{{ t[2] }}</span>
        {% include aesthetihawk/icon.html name="chevron-down" class="w-5 h-5 transition-transform group-[.open]:rotate-180" %}
      </button>
      <div class="hidden group-[.open]:block mt-3" id="team-{{ forloop.index }}">
        <p class="text-sm mt-0">{{ t[3] }}</p>
        <div class="flex flex-wrap gap-2">
          {%- for tag in tags %}
          <span class="px-2 py-0.5 rounded-full text-xs bg-neutral-700">{{ tag }}</span>
          {%- endfor %}
        </div>
      </div>
    </li>
    {%- endfor %}
  </ul>
</section>

<section class="mt-12 grid gap-6 lg:grid-cols-[3fr_2fr]" aria-labelledby="groups-title">
  <div>
    <h2 id="groups-title" class="text-2xl font-bold mt-0 mb-2">Group and corporate volunteering</h2>
    <p class="my-3">Bring your team. PVO welcomes corporate volunteer days, service club projects, and faith community groups. We'll coordinate a meaningful half-day or full-day experience for groups of any size.</p>
    <ul class="list-disc pl-6">
      <li>Dedicated project coordinator for your group</li>
      <li>All materials and tools provided on-site</li>
      <li>Certificate of service for company CSR reporting</li>
      <li>Tax-deductible materials donations welcome</li>
      <li>Opportunity for ongoing community partnership</li>
    </ul>
  </div>
  <div class="p-6 rounded-lg bg-neutral-800 border border-neutral-700 self-start">
    <h3 class="text-lg font-bold mt-0 mb-2">Schedule a group day</h3>
    <p class="my-3">Contact us to plan your team's volunteer experience. We accommodate groups of 5 to 40+.</p>
    <p class="m-0">Phone: <a href="{{ site.pvo_contact.phone_link }}">{{ site.pvo_contact.phone }}</a></p>
    <p class="m-0">Email: <a href="mailto:{{ site.pvo_contact.email }}">{{ site.pvo_contact.email }}</a></p>
  </div>
</section>

<section id="volunteer-form" class="mt-12 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 max-w-4xl scroll-mt-20" aria-labelledby="signup-title">
  <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Sign up</p>
  <h2 id="signup-title" class="text-2xl font-bold mt-1 mb-2">Join the PVO volunteer team</h2>
  <p class="my-3">Fill out the form and a team manager will reach out within 3 business days to match you with your first project.</p>

  <div class="grid gap-x-4 md:grid-cols-2">
    <div class="form-group">
      <label for="first_name">First name *</label>
      <input type="text" id="first_name" autocomplete="given-name" placeholder="First">
    </div>
    <div class="form-group">
      <label for="last_name">Last name *</label>
      <input type="text" id="last_name" autocomplete="family-name" placeholder="Last">
    </div>
    <div class="form-group">
      <label for="phone">Phone *</label>
      <input type="tel" id="phone" autocomplete="tel" placeholder="(858) 555-0000">
    </div>
    <div class="form-group">
      <label for="email">Email *</label>
      <input type="email" id="email" autocomplete="email" placeholder="you@email.com">
    </div>
    <div class="form-group md:col-span-2">
      <label for="city_zip">City / ZIP *</label>
      <input type="text" id="city_zip" autocomplete="postal-code" placeholder="Poway, CA 92064">
    </div>
  </div>

  <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
    <legend class="px-2 font-bold">Volunteer teams (choose all that interest you)</legend>
    <div class="grid gap-3 sm:grid-cols-2" id="role-selector">
      {%- assign team_values = "Home Repair|Events|Outreach|Admin|Transport|Skilled Trades" | split: "|" %}
      {%- for value in team_values %}
      <label class="switch">
        <span class="toggle">
          <input type="checkbox" value="{{ value }}">
          <span class="slider"></span>
        </span>
        <span class="label-text">{{ value }}</span>
      </label>
      {%- endfor %}
    </div>
  </fieldset>

  <div class="form-group">
    <label for="skills">Skills and experience</label>
    <textarea class="smallInput w-full" id="skills" placeholder="Briefly describe relevant skills (e.g. carpentry, welding, project management, driving, administrative work)…"></textarea>
  </div>
  <div class="grid gap-x-4 md:grid-cols-2">
    <div class="form-group">
      <label for="availability">Availability</label>
      <select id="availability">
        <option value="">Any restrictions?</option>
        <option>Weekdays only</option>
        <option>Weekends only</option>
        <option>Weekday mornings</option>
        <option>Flexible — most days</option>
        <option>Event-based only</option>
      </select>
    </div>
    <div class="form-group">
      <label for="best_time">Best time to reach you</label>
      <select id="best_time">
        <option value="">Select…</option>
        <option>Morning (8am–12pm)</option>
        <option>Afternoon (12pm–5pm)</option>
        <option>Evening (5pm–8pm)</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="organization">Group or organization (optional)</label>
    <input type="text" id="organization" autocomplete="organization" placeholder="Company, faith community, service club, etc.">
  </div>

  <div class="flex flex-col sm:flex-row sm:items-center gap-3">
    <button type="button" class="large primary form-submit">Submit volunteer application</button>
    <div class="flex-1" role="status" aria-live="polite" id="volunteer-status"></div>
  </div>
  <p class="text-sm mt-3 mb-0">Your info is used only for volunteer coordination and is never shared or sold.</p>
</section>

<script>
  // Open a team card; opening it also ticks that team in the sign-up form.
  function toggleRole(card, role) {
    card.classList.toggle('open');
    const open = card.classList.contains('open');
    card.querySelector('[aria-expanded]').setAttribute('aria-expanded', String(open));
    document.querySelectorAll('#role-selector input[type="checkbox"]').forEach(cb => {
      if (cb.value === role) cb.checked = open;
    });
  }

  // Messages appear as OCS status boxes (.overall-status) in the status region.
  function showStatus(text, kind) {
    const region = document.getElementById('volunteer-status');
    region.replaceChildren();
    const message = document.createElement('p');
    message.className = `overall-status ${kind}`;
    message.textContent = text;
    region.append(message);
  }

  document.querySelector('.form-submit').addEventListener('click', async () => {
    const roles = [...document.querySelectorAll('#role-selector input:checked')]
      .map(cb => cb.value).join(', ');

    const payload = {
      first_name:   document.getElementById('first_name').value.trim(),
      last_name:    document.getElementById('last_name').value.trim(),
      phone:        document.getElementById('phone').value.trim(),
      email:        document.getElementById('email').value.trim(),
      city_zip:     document.getElementById('city_zip').value.trim(),
      roles,
      skills:       document.getElementById('skills').value.trim(),
      availability: document.getElementById('availability').value,
      best_time:    document.getElementById('best_time').value,
      organization: document.getElementById('organization').value.trim(),
    };

    if (!payload.first_name || !payload.last_name || !payload.email) {
      showStatus('Please fill in your first name, last name, and email.', 'error');
      return;
    }

    try {
      const apiBase = ['localhost', '127.0.0.1'].includes(location.hostname)
        ? 'http://localhost:8426'
        : 'https://pvoteam-api.opencodingsociety.com';
      const res = await fetch(`${apiBase}/api/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showStatus("Application submitted! We'll be in touch within 3 business days.", 'success');
      } else {
        showStatus('Your application could not be sent: ' + (data.error || data.message || 'please try again.'), 'error');
      }
    } catch (err) {
      showStatus('Could not reach the server. Please try again.', 'error');
    }
  });
</script>
