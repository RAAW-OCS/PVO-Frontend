---
layout: pvo
title: Admin Tools
permalink: /admin/
search_exclude: true
show_reading_time: false
active_tab: admin
pvo_script: /assets/js/pvo/admin.js
---
{%- comment -%} OCS card panels, OCS .form-group fields, OCS buttons as tabs, OCS status boxes; Tailwind arrangement. {%- endcomment -%}
<p class="max-w-3xl mb-6">Post events to the public calendar. Administrators can also give members their roles.</p>

<p data-admin-loading>Checking your account…</p>

<div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700 max-w-3xl" data-admin-gate hidden>
  <h2 class="text-xl font-bold m-0" data-gate-title>Administrators and event organizers only</h2>
  <p data-gate-text>Log in with an administrator or event organizer account to post events.</p>
  <div class="flex flex-wrap gap-2" data-gate-actions>
    <a class="medium filledTinted primary inline-flex items-center" href="{{ '/member-login/' | relative_url }}?next={{ '/admin/' | relative_url | url_encode }}">Member Login</a>
    <a class="medium primary inline-flex items-center" href="{{ '/' | relative_url }}">Back to the homepage</a>
  </div>
</div>

<div data-admin hidden>
  <div class="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Admin sections" data-admin-tabs>
    <button class="medium primary" type="button" role="tab" id="tab-events" aria-controls="panel-events" aria-selected="true" data-admin-tab>Events</button>
    <button class="medium secondary" type="button" role="tab" id="tab-people" aria-controls="panel-people" aria-selected="false" tabindex="-1" data-admin-tab>People &amp; Roles</button>
  </div>

  <div role="tabpanel" id="panel-events" aria-labelledby="tab-events">
    <div class="grid gap-6 2xl:grid-cols-2 items-start">
      <section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700" aria-labelledby="event-form-title">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 class="text-xl font-bold m-0" id="event-form-title" data-event-form-title>Post an event</h2>
          <span data-cancel-edit-wrap hidden><button class="small secondary" type="button" data-cancel-edit>Cancel editing</button></span>
        </div>
        <form id="event-form" novalidate>
          <div class="form-group">
            <label for="event-title">Event title</label>
            <input id="event-title" name="title" type="text" maxlength="160" required>
          </div>

          <div class="grid gap-x-4 sm:grid-cols-3">
            <div class="form-group">
              <label for="event-date">Date</label>
              <input id="event-date" name="date" type="date" required>
            </div>
            <div class="form-group">
              <label for="event-start">Start time</label>
              <input id="event-start" name="start" type="time" required>
            </div>
            <div class="form-group">
              <label for="event-end">End time (optional)</label>
              <input id="event-end" name="end" type="time">
            </div>
          </div>

          <div class="form-group">
            <label for="event-location">Location (optional)</label>
            <input id="event-location" name="location" type="text" maxlength="255" placeholder="e.g. Poway Community Park, 13094 Civic Center Dr">
          </div>

          <div class="form-group">
            <label for="event-description">Description</label>
            <textarea class="smallInput w-full" id="event-description" name="description" maxlength="2000" required></textarea>
          </div>

          <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
            <legend class="px-2 font-bold">Picture or video (optional)</legend>
            <div class="grid gap-4 sm:grid-cols-[12rem_1fr]">
              <div class="relative w-full aspect-video rounded-lg bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center" data-picture-preview>
                <span class="text-sm text-neutral-400">No picture yet</span>
              </div>
              <div>
                <label class="medium primary inline-flex items-center cursor-pointer" for="event-picture">Choose a photo…</label>
                <input class="sr-only" id="event-picture" name="picture" type="file" accept="image/jpeg,image/png,image/gif,image/webp">
                <small class="block mt-2">JPEG, PNG, GIF, or WebP. Large photos are resized before uploading. Events whose date has passed show their picture or video on the Photos &amp; Videos page.</small>
                <div class="form-group mt-3">
                  <label for="event-image-url">Or paste a link to an image or video (YouTube or .mp4)</label>
                  <input id="event-image-url" name="image_url" type="url" placeholder="https://">
                </div>
                <span data-remove-picture-wrap hidden><button class="small secondary" type="button" data-remove-picture>Remove picture</button></span>
              </div>
            </div>
          </fieldset>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <button class="large primary" type="submit" data-event-submit>Publish event</button>
            <div class="flex-1" role="status" aria-live="polite" id="event-status"></div>
          </div>
        </form>
      </section>

      <section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700" aria-labelledby="event-list-title">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h2 class="text-xl font-bold m-0" id="event-list-title">On the calendar</h2>
          <small data-event-count></small>
        </div>
        <p data-event-empty hidden>No events yet. Anything you publish shows up on the homepage calendar right away.</p>
        <ol class="p-0 m-0 list-none divide-y divide-neutral-700" data-event-list></ol>
      </section>
    </div>
  </div>

  <div role="tabpanel" id="panel-people" aria-labelledby="tab-people" hidden>
    <section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700" aria-labelledby="people-title">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-bold m-0" id="people-title">People &amp; Roles</h2>
        <label class="switch">
          <span class="toggle">
            <input type="checkbox" data-show-guests>
            <span class="slider"></span>
          </span>
          <span class="label-text">Show guest sessions</span>
        </label>
      </div>
      <ul class="p-0 my-4 list-none space-y-2" aria-label="What each role can do" data-role-guide>
        <li class="m-0"><strong>Administrator:</strong> posts and edits events, and gives people their roles.</li>
        <li class="m-0"><strong>Event organizer:</strong> posts and edits events, but cannot change roles.</li>
        <li class="m-0"><strong>Veteran, Family member, Volunteer, Member:</strong> member accounts with a profile. People choose one when they sign up or in their profile survey, and you can correct it here.</li>
        <li class="m-0"><strong>Guest:</strong> temporary sessions, cleared after a week. They cannot be given a role.</li>
      </ul>
      <small class="block">You cannot change your own role. Ask another administrator.</small>
      <div role="status" aria-live="polite" id="people-status"></div>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-neutral-700 text-neutral-100"><th scope="col" class="py-2 pr-4 text-neutral-100">Name</th><th scope="col" class="py-2 pr-4 text-neutral-100">Username</th><th scope="col" class="py-2 pr-4 text-neutral-100">Email</th><th scope="col" class="py-2 text-neutral-100">Role</th></tr>
          </thead>
          <tbody class="divide-y divide-neutral-700" data-people></tbody>
        </table>
      </div>
    </section>
  </div>
</div>
