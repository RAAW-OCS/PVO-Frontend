---
layout: pvo
title: Poway Veterans Organization
description: Local veterans helping veterans and their families in Poway, Ramona, and the surrounding area.
permalink: /
hide_title: true
active_tab: home
chatbot: true
pvo_script: /assets/js/pvo/home.js
---
{%- comment -%}
  Homepage. Built only from Open Coding Society pieces: OCS buttons (small/medium/large +
  primary/secondary/filledHighlight/filledTinted), OCS card panels (bg-neutral-800 + border, recoloured
  by OCS themes), OCS glowOnHover tiles, the OCS calendar (FullCalendar + calendar.scss), the OCS
  modal, and Tailwind classes for arrangement.
{%- endcomment -%}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js"></script>

{% include pvo/member-bar.html %}

<section class="grid gap-8 xl:grid-cols-2 items-start mt-8" aria-labelledby="pvo-hero-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Poway &middot; Ramona &middot; Since 2014</p>
    <h1 id="pvo-hero-title" class="!block text-3xl md:text-5xl font-bold leading-tight mt-2 mb-4">Veterans helping veterans, right here at home.</h1>
    <p class="text-lg my-3">We are a group of Poway-area veterans who help local veterans and their families with home repairs, vehicle repairs, and the everyday jobs that are hard to manage alone. There is no paid staff. More than 95% of what we raise goes straight to veterans.</p>
    <div class="flex flex-wrap gap-3 mt-6" data-hero-actions>
      <a class="large filledTinted primary inline-flex items-center" href="{{ '/prescreener' | relative_url }}">Request assistance</a>
      <a class="large primary inline-flex items-center" href="{{ '/volunteer' | relative_url }}">Volunteer with us</a>
      <a class="large primary inline-flex items-center" href="{{ '/gallery/' | relative_url }}">Photos &amp; videos</a>
    </div>
  </div>

  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700" aria-labelledby="pvo-branches-title">
    <h2 id="pvo-branches-title" class="text-xl font-bold m-0">Every branch. Every era.</h2>
    <p class="text-neutral-400 mt-1 mb-4">Whether you wore the uniform in 1968 or last year, this is your community.</p>
    <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-0 m-0 list-none" data-branches>
      {%- for branch in site.data.pvo_branches %}
      <li class="m-0">
        <a class="glowOnHover rounded-xl flex flex-col items-center text-center gap-1 p-3 h-full" href="{{ branch.url }}" target="_blank" rel="noopener">
          {%- if branch.image %}
          <img class="w-14 h-14" src="{{ branch.image | relative_url }}" alt="">
          {%- else %}
          {% include pvo/emblem.html name=branch.key color=branch.color %}
          {%- endif %}
          <span class="font-bold leading-tight" data-branch-name>{{ branch.name }}</span>
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Est. {{ branch.established }}</span>
          <span class="text-xs italic text-neutral-400">{{ branch.motto }}</span>
          <span class="sr-only">(official site, opens in a new tab)</span>
        </a>
      </li>
      {%- endfor %}
    </ul>
  </div>
</section>

<section class="mt-8 p-4 rounded-lg bg-neutral-800 border border-neutral-700 flex flex-col md:flex-row md:items-center gap-4" aria-labelledby="pvo-next-label">
  <h2 id="pvo-next-label" class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0 md:w-40 shrink-0">Next on the calendar</h2>
  <div class="flex-1" data-next-event aria-live="polite"><p class="m-0">Loading the calendar…</p></div>
  <a class="medium filledTinted primary inline-flex items-center justify-center shrink-0" href="#calendar">See the full calendar</a>
</section>

<section id="services" class="mt-12" aria-labelledby="pvo-hub-title">
  <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Start here</p>
  <h2 id="pvo-hub-title" class="text-2xl font-bold mt-1 mb-4">What you can do on this site</h2>
  {%- capture hub_tiles -%}
  hammer|/prescreener|Request assistance|Answer a few short questions about what you need. We will tell you whether PVO can take it on or point you to someone who can.|Start a request|
  book|/resources/|Resource Hub|Trusted help for health care, benefits, housing, work, and family, including the 24/7 Veterans Crisis Line.|Find resources|
  hands|/volunteer|Volunteer|Help repair a home, work a booth at a fundraiser, or give a neighbor a ride. Every skill level is useful.|Sign up to help|
  chat|/pvo-chatbot/|Ask a question|Our assistant answers common questions about services, events, and how to reach us, any time of day.|Open the assistant|chat
  clipboard|/member-profile/#survey|Veteran profile|Share your service and interests so we can introduce you to veterans who enjoy the same things. Volunteers can sign up there too.|Take the survey|
  briefcase|/jobs/|Employment Board|Local openings from employers who want to hire veterans, plus programs for training and federal jobs.|See the job board|
  image|/gallery/|Photos &amp; videos|Photos and videos from past workdays, fundraisers, and get-togethers.|See the photos|
  heart|https://powayveterans.org/donate/|Donate|Donations pay for materials and parts on assistance projects and support other veteran service organizations.|Give to PVO|
  {%- endcapture -%}
  <ul class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3 p-0 m-0 list-none" data-hub>
    {%- assign tiles = hub_tiles | strip | newline_to_br | split: '<br />' %}
    {%- for tile in tiles %}
    {%- assign t = tile | strip | split: '|' %}
    {%- assign external = t[1] | slice: 0, 4 %}
    <li class="m-0">
      <a class="glowOnHover rounded-xl flex flex-col gap-2 p-5 h-full" href="{% if external == 'http' %}{{ t[1] }}{% else %}{{ t[1] | relative_url }}{% endif %}"{% if external == 'http' %} target="_blank" rel="noopener"{% endif %}{% if t[5] == 'chat' %} data-chat-open{% endif %}>
        {%- assign icon_name = t[0] %}
        <span class="flex items-center gap-3">{% include aesthetihawk/icon.html name=icon_name class="w-7 h-7" %}<span class="text-lg font-bold" data-hub-name>{{ t[2] }}</span></span>
        <span class="text-sm text-neutral-300">{{ t[3] }}</span>
        <span class="text-sm font-bold mt-auto">{{ t[4] }} &rarr;{% if external == 'http' %}<span class="sr-only"> (opens in a new tab)</span>{% endif %}</span>
      </a>
    </li>
    {%- endfor %}
    <li class="m-0" data-show="not-staff">
      <a class="glowOnHover rounded-xl flex flex-col gap-2 p-5 h-full" href="#calendar">
        <span class="flex items-center gap-3">{% include aesthetihawk/icon.html name="calendar" class="w-7 h-7" %}<span class="text-lg font-bold" data-hub-name>Events</span></span>
        <span class="text-sm text-neutral-300">Workdays, fundraisers, meetings, and get-togethers, all in one calendar.</span>
        <span class="text-sm font-bold mt-auto">See the calendar &rarr;</span>
      </a>
    </li>
    <li class="m-0" data-show="staff" hidden>
      <a class="glowOnHover rounded-xl flex flex-col gap-2 p-5 h-full" href="{{ '/admin/' | relative_url }}">
        <span class="flex items-center gap-3">{% include aesthetihawk/icon.html name="key" class="w-7 h-7" %}<span class="text-lg font-bold" data-hub-name>Admin tools</span></span>
        <span class="text-sm text-neutral-300">Post events with a picture and keep the calendar up to date. Administrators also manage member roles.</span>
        <span class="text-sm font-bold mt-auto">Open admin &rarr;</span>
      </a>
    </li>
  </ul>
</section>

<section id="calendar" class="mt-12 scroll-mt-20" aria-labelledby="pvo-calendar-title">
  <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Calendar</p>
  <h2 id="pvo-calendar-title" class="text-2xl font-bold mt-1 mb-2">Events &amp; gatherings</h2>
  <p class="text-neutral-400 mb-4">Workdays, fundraisers, meetings, and get-togethers. Choose an event for details, or switch to <strong>Coming up</strong> for a list.</p>
  <div class="p-2 sm:p-4 rounded-lg bg-neutral-800 border border-neutral-700">
    <div data-pvo-calendar></div>
    <div role="status" aria-live="polite" data-calendar-status></div>
  </div>
</section>

<section class="mt-12" aria-labelledby="pvo-recaps-title" hidden data-home-recaps>
  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
    <div>
      <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">Photos &amp; videos</p>
      <h2 id="pvo-recaps-title" class="text-2xl font-bold mt-1 m-0">From recent events</h2>
    </div>
    <a class="medium filledTinted primary inline-flex items-center justify-center" href="{{ '/gallery/' | relative_url }}">See all photos &amp; videos</a>
  </div>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-0 m-0 list-none" data-recaps></ul>
</section>

<section id="about" class="mt-12 grid gap-8 xl:grid-cols-[2fr_1fr] scroll-mt-20" aria-labelledby="pvo-about-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">About PVO</p>
    <h2 id="pvo-about-title" class="text-2xl font-bold mt-1 mb-4">Local veterans, looking out for each other</h2>
    <p class="my-3">We are a group of veterans from the Poway area who started this organization in 2014. Our mission is to provide assistance to veterans and their families living in Poway, Ramona, and the surrounding areas: to reach the veterans who need help, and do what we can to meet that need.</p>
    <p class="my-3">Most of our work is hands-on. We help with home repairs and upkeep, repairs on personal vehicles, and similar jobs requested by the veterans and families who apply for assistance.</p>
    <p class="my-3">PVO has no paid staff and no buildings or equipment to maintain. Our only overhead is volunteer liability insurance, our website and phone line, and required state and federal fees. That lets us put more than 95% of our funds into veteran assistance projects and into donations to other veteran service organizations, such as the Disabled American Veterans.</p>
  </div>
  <dl class="grid grid-cols-2 gap-3 m-0 content-start">
    <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">2014</dt><dd class="m-0 text-sm text-neutral-400">Founded by Poway-area veterans</dd></div>
    <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">0</dt><dd class="m-0 text-sm text-neutral-400">Paid staff. Everyone is a volunteer</dd></div>
    <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">95%+</dt><dd class="m-0 text-sm text-neutral-400">Of funds go to veteran assistance</dd></div>
    <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700"><dt class="text-2xl font-bold">501(c)(3)</dt><dd class="m-0 text-sm text-neutral-400">Registered nonprofit organization</dd></div>
  </dl>
</section>

<section class="mt-12 p-6 rounded-lg bg-neutral-800 border border-neutral-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" aria-labelledby="pvo-donate-title">
  <div>
    <h2 id="pvo-donate-title" class="text-2xl font-bold m-0">Help us help our veterans</h2>
    <p class="mb-0">Your donation buys lumber, parts, and supplies for veterans in our community. Every contribution goes to work locally.</p>
  </div>
  <div class="flex flex-wrap gap-3 shrink-0">
    <a class="large filledTinted primary inline-flex items-center" href="https://powayveterans.org/donate/" target="_blank" rel="noopener">Donate to PVO<span class="sr-only"> (opens in a new tab)</span></a>
    <a class="large primary inline-flex items-center" href="{{ '/volunteer' | relative_url }}">Give your time</a>
  </div>
</section>

{% include pvo/modal.html %}
