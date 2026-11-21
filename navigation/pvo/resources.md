---
layout: pvo
title: Resource Hub
permalink: /resources/
search_exclude: true
show_reading_time: false
active_tab: resources
chatbot: true
pvo_script: /assets/js/pvo/resources.js
---
{%- comment -%} OCS card panels, OCS buttons (filters use primary/secondary for pressed/not), OCS .form-group search; Tailwind arrangement. Content: _data/pvo_resources.yml {%- endcomment -%}
{%- assign hub = site.data.pvo_resources -%}
<p class="max-w-3xl mb-6">Trusted places to turn for health care, benefits, housing, work, and family support. PVO is not affiliated with these organizations, but our volunteers are glad to help you get started.</p>

<section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4" aria-labelledby="crisis-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 m-0">24/7 confidential support</p>
    <h2 class="text-2xl font-bold mt-1 mb-2" id="crisis-title">{{ hub.crisis.title }}</h2>
    <p class="m-0">{{ hub.crisis.text }}</p>
  </div>
  <div class="flex flex-wrap gap-2 shrink-0" data-crisis-actions>
    {%- for action in hub.crisis.actions %}
    <a class="large {% if forloop.first %}filledTinted {% endif %}primary inline-flex items-center" href="{{ action.url }}"{% if action.url contains '://' %} target="_blank" rel="noopener"{% endif %}>{{ action.label }}{% if action.url contains '://' %}<span class="sr-only"> (opens in a new tab)</span>{% endif %}</a>
    {%- endfor %}
  </div>
</section>

<div class="mt-8 grid gap-4 lg:grid-cols-[20rem_1fr] lg:items-end">
  <div class="form-group m-0">
    <label for="resource-search">Search resources</label>
    <input id="resource-search" type="text" placeholder="Try housing, claim, or counseling" autocomplete="off" data-resource-search>
  </div>
  <div class="flex flex-wrap gap-2" role="group" aria-label="Show one category">
    <button class="small primary" type="button" aria-pressed="true" data-resource-filter="">All</button>
    {%- for group in hub.categories %}
    <button class="small secondary" type="button" aria-pressed="false" data-resource-filter="{{ group.name | slugify }}">{{ group.name }}</button>
    {%- endfor %}
  </div>
</div>
<p class="text-sm text-neutral-400 mt-2" aria-live="polite" data-resource-count></p>

{%- for group in hub.categories %}
{%- assign slug = group.name | slugify %}
<section class="mt-8" data-resource-group="{{ slug }}" aria-labelledby="resources-{{ slug }}">
  <h2 class="text-xl font-bold mb-3" id="resources-{{ slug }}">{{ group.name }}</h2>
  <ul class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3 p-0 m-0 list-none">
    {%- for item in group.items %}
    <li class="m-0 p-4 rounded-lg bg-neutral-800 border border-neutral-700" data-resource>
      <a class="font-bold" href="{{ item.url }}"{% if item.url contains '://' %} target="_blank" rel="noopener"{% endif %}>{{ item.title }}{% if item.url contains '://' %}<span class="sr-only"> (opens in a new tab)</span>{% endif %}</a>
      <p class="text-sm mt-1 mb-0">{{ item.text }}</p>
      {%- if item.phone %}
      <p class="text-sm mt-2 mb-0"><a href="tel:{{ item.phone | remove: '-' }}">{{ item.phone_label }}: {{ item.phone }}</a></p>
      {%- endif %}
    </li>
    {%- endfor %}
  </ul>
</section>
{%- endfor %}

<p class="mt-6" data-resource-empty hidden>No resources match that search. Try a different word, or <a href="{{ '/pvo-chatbot/' | relative_url }}" data-chat-open>ask the assistant</a>.</p>

<section class="mt-10 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700" aria-labelledby="resource-cta-title">
  <h2 class="text-xl font-bold m-0" id="resource-cta-title">Need hands-on help?</h2>
  <p class="my-3">PVO volunteers help veterans and their families in Poway, Ramona, and nearby with home repairs, vehicle repairs, and more.</p>
  <div class="flex flex-wrap gap-2">
    <a class="medium filledTinted primary inline-flex items-center" href="{{ '/prescreener' | relative_url }}">Request assistance</a>
    <a class="medium primary inline-flex items-center" href="{{ site.pvo_contact.phone_link }}">Call PVO at {{ site.pvo_contact.phone }}</a>
  </div>
</section>
