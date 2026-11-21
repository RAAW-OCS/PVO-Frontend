---
layout: pvo
title: Photos & Videos
permalink: /gallery/
search_exclude: true
show_reading_time: false
active_tab: gallery
pvo_script: /assets/js/pvo/gallery.js
---
{%- comment -%} OCS glowOnHover tiles and the OCS modal; Tailwind arrangement. Tiles come from past events with a picture or video. {%- endcomment -%}
<p class="max-w-3xl mb-6">Photos and videos from past PVO workdays, fundraisers, and get-togethers.</p>

<ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 p-0 m-0 list-none" data-recaps data-recaps-page aria-live="polite"></ul>
<p class="mt-4" data-recaps-status>Loading photos and videos…</p>
<div class="mt-4" data-show="staff" hidden>
  <p class="overall-status partial">Administrators and event organizers: to add photos here, open <a href="{{ '/admin/' | relative_url }}">Admin Tools</a>, then post or edit an event whose date has passed and give it a photo, a YouTube link, or an .mp4 link.</p>
</div>

{% include pvo/modal.html %}
