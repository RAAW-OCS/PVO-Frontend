---
layout: pvo
title: Employment Board
permalink: /jobs/
search_exclude: true
show_reading_time: false
active_tab: jobs
---
{%- comment -%} OCS card panels and buttons; Tailwind arrangement. Content: _data/pvo_jobs.yml {%- endcomment -%}
{%- assign board = site.data.pvo_jobs -%}
<p class="max-w-3xl mb-6">Openings from local employers who want to hire veterans, plus programs that help with training, careers, and federal hiring.</p>

<section class="mt-6" aria-labelledby="jobs-local-title">
  <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
    <h2 class="text-xl font-bold m-0" id="jobs-local-title">Local openings</h2>
    <small>{{ board.listings | size }} posted</small>
  </div>

  {%- if board.listings.size > 0 %}
  <ul class="grid gap-3 md:grid-cols-2 p-0 m-0 list-none">
    {%- assign listings = board.listings | sort: 'posted' | reverse %}
    {%- for job in listings %}
    <li class="m-0 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
      <p class="font-bold m-0">{{ job.title }}</p>
      <p class="text-sm text-neutral-400 m-0">{{ job.employer }} &middot; {{ job.location }}{% if job.type %} &middot; {{ job.type }}{% endif %}</p>
      {%- if job.text %}<p class="text-sm mt-2 mb-0">{{ job.text }}</p>{% endif %}
      <div class="flex flex-wrap items-center justify-between gap-2 mt-3">
        {%- if job.posted %}<small>Posted {{ job.posted | date: '%b %-d, %Y' }}</small>{% endif %}
        {%- if job.url %}<a class="small filledTinted primary inline-flex items-center" href="{{ job.url }}"{% if job.url contains '://' %} target="_blank" rel="noopener"{% endif %}>How to apply{% if job.url contains '://' %}<span class="sr-only"> (opens in a new tab)</span>{% endif %}</a>{% endif %}
      </div>
    </li>
    {%- endfor %}
  </ul>
  {%- else %}
  <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700" data-jobs-empty>
    <h3 class="text-lg font-bold m-0">No local openings are posted right now</h3>
    <p class="mb-0">New openings appear here as soon as local employers share them with PVO. In the meantime, the programs below list thousands of veteran-friendly jobs.</p>
  </div>
  {%- endif %}

  <div class="mt-4 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
    <h3 class="text-lg font-bold m-0">Hiring? Share your opening with local veterans</h3>
    <p class="my-3">Email PVO the job title, location, and how to apply, and we will post it here.</p>
    <a class="medium filledTinted primary inline-flex items-center" href="mailto:{{ site.pvo_contact.email }}?subject=Job%20opening%20for%20the%20PVO%20Employment%20Board">Email a job opening</a>
  </div>
</section>

<section class="mt-10" aria-labelledby="jobs-programs-title">
  <h2 class="text-xl font-bold mb-3" id="jobs-programs-title">Job programs for veterans</h2>
  <ul class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3 p-0 m-0 list-none">
    {%- for program in board.programs %}
    <li class="m-0 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
      <a class="font-bold" href="{{ program.url }}" target="_blank" rel="noopener">{{ program.title }}<span class="sr-only"> (opens in a new tab)</span></a>
      <p class="text-sm mt-1 mb-0">{{ program.text }}</p>
    </li>
    {%- endfor %}
  </ul>
</section>
