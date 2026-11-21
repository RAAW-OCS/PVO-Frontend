---
layout: pvo
title: My Profile
permalink: /member-profile/
search_exclude: true
show_reading_time: false
active_tab: profile
pvo_script: /assets/js/pvo/profile.js
---
{%- comment -%} OCS card panels, OCS .form-group fields, OCS .switch toggles, OCS buttons and status boxes; Tailwind arrangement. {%- endcomment -%}
<p class="max-w-3xl mb-6">Build your veteran profile so PVO can connect you with veterans who share your interests. If you would like to help out, the volunteer survey is at the bottom of the page.</p>

<p data-profile-loading>Checking your account…</p>

<div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700 max-w-3xl" data-profile-gate hidden>
  <h2 class="text-xl font-bold m-0" data-gate-title>Log in to fill out your profile</h2>
  <p data-gate-text>Your profile and survey answers are saved to your PVO account. You can also continue as a guest.</p>
  <div class="flex flex-wrap gap-2" data-gate-actions>
    <a class="medium filledTinted primary inline-flex items-center" href="{{ '/member-login/' | relative_url }}?next={{ '/member-profile/' | relative_url | url_encode }}">Member Login</a>
    <a class="medium primary inline-flex items-center" href="{{ '/member-login/' | relative_url }}?next={{ '/member-profile/' | relative_url | url_encode }}#create">Create an account</a>
    <button class="medium secondary" type="button" data-gate-guest>Continue as guest</button>
  </div>
  <div role="status" aria-live="polite" data-gate-status></div>
</div>

<div data-profile hidden>
<div class="grid gap-6 xl:grid-cols-[18rem_1fr] items-start">
  <aside class="p-4 rounded-lg bg-neutral-800 border border-neutral-700 xl:sticky xl:top-20" aria-labelledby="profile-name">
    <span class="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center text-2xl font-bold" aria-hidden="true" data-profile-initials></span>
    <h2 class="text-xl font-bold mt-3 mb-0" id="profile-name" data-profile-name></h2>
    <small class="block" data-profile-uid></small>
    <span class="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold bg-neutral-700 text-neutral-50" data-profile-role></span>
    <dl class="mt-4 mb-0 space-y-2 text-sm" data-profile-facts></dl>
    <div data-show="guest" hidden>
      <p class="overall-status partial text-sm">You are using a temporary guest session. Answers are kept for about a week. <a href="{{ '/member-login/' | relative_url }}#create">Create an account</a> to keep them.</p>
    </div>
    <nav class="mt-4 pt-4 border-t border-neutral-700 flex flex-col gap-1" aria-label="On this page">
      <a href="#survey">Veteran profile</a>
      <a href="#volunteer-survey">Volunteer survey</a>
    </nav>
    <div class="mt-4 flex flex-col gap-2">
      <span data-show="staff" hidden><a class="medium primary inline-flex items-center justify-center w-full" href="{{ '/admin/' | relative_url }}">Admin Tools</a></span>
      <button class="medium secondary w-full" type="button" data-pvo-signout>Log out</button>
    </div>
  </aside>

  <div class="grid gap-6">
    <section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 scroll-mt-20" id="survey" aria-labelledby="survey-title">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="text-xl font-bold m-0" id="survey-title">Your veteran profile</h2>
        <small data-saved="profile"></small>
      </div>
      <p class="my-3">Tell us a little about yourself. PVO uses your profile to introduce you to veterans who share your interests and to plan meetups you will enjoy. Every question is optional, and your answers are never shown publicly.</p>

      <form id="survey-form" data-survey-form="profile" novalidate>
        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">Your service</legend>
          <div class="grid gap-x-4 sm:grid-cols-2">
            <div class="form-group">
              <label for="survey-affiliation">Your connection to the military</label>
              <select id="survey-affiliation" name="affiliation">
                <option value="">Choose one</option>
                {%- assign affiliations = "Veteran|Active duty|Guard or Reserve|Family member|Volunteer or supporter" | split: "|" %}
                {%- for option in affiliations %}
                <option value="{{ option }}">{{ option }}</option>
                {%- endfor %}
              </select>
              <div class="mt-1" id="survey-affiliation-hint" hidden data-member-type-hint><small>Your answer also sets the member type on your profile: Veteran, Family member, or Volunteer.</small></div>
            </div>
            <div class="form-group">
              <label for="survey-branch">Branch</label>
              <select id="survey-branch" name="branch">
                <option value="">Choose one</option>
                {%- for branch in site.data.pvo_branches %}
                <option value="{{ branch.name }}">{{ branch.name }}</option>
                {%- endfor %}
                <option value="Did not serve">Did not serve / not applicable</option>
              </select>
            </div>
            <div class="form-group">
              <label for="survey-era">When you served</label>
              <select id="survey-era" name="era">
                <option value="">Choose one</option>
                {%- assign eras = "World War II|Korea|Vietnam|Cold War|Gulf War (1990-1991)|Post-9/11 (Iraq, Afghanistan)|Peacetime service|Currently serving" | split: "|" %}
                {%- for option in eras %}
                <option value="{{ option }}">{{ option }}</option>
                {%- endfor %}
              </select>
            </div>
            <div class="form-group">
              <label for="survey-years">Years of service</label>
              <input id="survey-years" name="service_years" type="number" min="0" max="80" step="1" inputmode="numeric">
            </div>
          </div>
        </fieldset>

        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">What do you enjoy?</legend>
          <p class="text-sm mt-0">Pick anything you would like to do with other veterans.</p>
          {% include pvo/switch-list.html name="interests" options="Fishing|Hiking and the outdoors|Golf|Woodworking and building|Cars and motorcycles|Military history|Sports, watching or playing|Cards and board games|Coffee and conversation|Gardening|Faith and fellowship|Family activities" %}
        </fieldset>

        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">How would you like to meet up?</legend>
          {% include pvo/switch-list.html name="meetup" options="Coffee meetups|Group outings and day trips|Family-friendly events|Service projects together|Phone or text check-ins|Online video chats" %}
        </fieldset>

        <div class="form-group">
          <label for="survey-bio">About me</label>
          <textarea class="smallInput w-full" id="survey-bio" name="bio" maxlength="1000" aria-describedby="survey-bio-hint survey-bio-count"></textarea>
          <small class="block mt-1" id="survey-bio-hint">A few words other members would enjoy knowing: where you served, what you did, what you are into now.</small>
          <small class="block" id="survey-bio-count" data-bio-count>0 / 1000</small>
        </div>

        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">Is there anything that would make meetups easier for you?</legend>
          {% include pvo/switch-list.html name="accessibility_needs" options="Wheelchair or mobility access|Hearing assistance|Vision assistance|Transportation to events|Large-print materials" green=true %}
        </fieldset>

        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">Meeting other members</legend>
          <label class="switch">
            <span class="toggle">
              <input type="checkbox" name="connect_ok" data-boolean>
              <span class="slider green"></span>
            </span>
            <span class="label-text">Yes, PVO may introduce me to members who share my interests.</span>
          </label>
          <small class="block mt-2">A PVO coordinator makes the introduction. Your contact details are never shared without asking you first.</small>
        </fieldset>

        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <button class="large primary" type="submit">Save my profile</button>
          <div class="flex-1" role="status" aria-live="polite" data-form-status></div>
        </div>
      </form>
    </section>

    <section class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 scroll-mt-20" id="volunteer-survey" aria-labelledby="volunteer-survey-title">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="text-xl font-bold m-0" id="volunteer-survey-title">Volunteer survey</h2>
        <small data-saved="volunteer"></small>
      </div>
      <p class="my-3">Want to lend a hand? Tell us how you would like to help and when you are usually free, and a PVO coordinator will reach out. This is optional. For the full sign-up, use the <a href="{{ '/volunteer' | relative_url }}">volunteer form</a>.</p>

      <form id="volunteer-form" data-survey-form="volunteer" novalidate>
        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">How would you like to help?</legend>
          {% include pvo/switch-list.html name="volunteer" options="Home repairs|Vehicle repairs|Yard work and cleanup|Driving veterans to appointments|Events and fundraisers|Phone calls and check-ins|Office help" %}
        </fieldset>

        <fieldset class="border border-neutral-700 rounded-lg p-4 mb-4">
          <legend class="px-2 font-bold">When are you usually free?</legend>
          {% include pvo/switch-list.html name="volunteer_availability" options="Weekday mornings|Weekday afternoons|Weekday evenings|Weekends" %}
        </fieldset>

        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <button class="large primary" type="submit">Save volunteer answers</button>
          <div class="flex-1" role="status" aria-live="polite" data-form-status></div>
        </div>
      </form>
    </section>
  </div>
</div>
</div>
