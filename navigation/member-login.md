---
layout: pvo
title: Member Login
permalink: /member-login/
search_exclude: true
show_reading_time: false
active_tab: login
pvo_script: /assets/js/pvo/login.js
---
{%- comment -%} OCS login cards (.login-container, .login-card, .signup-card, .form-group, .submit-button), OCS buttons, Tailwind arrangement. {%- endcomment -%}
<p class="max-w-3xl mb-6">Sign in with your PVO username and password, or create an account. Members can build a veteran profile to meet others with shared interests.</p>

<div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700 max-w-3xl" data-show="signed-in" hidden>
  <h2 class="text-xl font-bold m-0">You are signed in as <span data-pvo-name>member</span></h2>
  <p class="my-3">Go to your profile, or log out if this is a shared computer.</p>
  <div class="flex flex-wrap gap-2">
    <a class="medium filledTinted primary inline-flex items-center" href="{{ '/member-profile/' | relative_url }}">My Profile</a>
    <a class="medium primary inline-flex items-center" href="{{ '/member-profile/' | relative_url }}#survey">Member Survey</a>
    <span data-show="staff" hidden><a class="medium primary inline-flex items-center" href="{{ '/admin/' | relative_url }}">Admin Tools</a></span>
    <button class="medium secondary" type="button" data-pvo-signout>Log out</button>
  </div>
</div>

<div data-show="signed-out">
  <div class="login-container">
    <section class="login-card" aria-labelledby="login-title">
      <h2 class="text-xl font-bold" id="login-title">Member Login</h2>
      <hr class="my-4 border-neutral-700">
      <form id="signin-form" novalidate>
        <div class="form-group">
          <label for="signin-uid">Username or email</label>
          <input id="signin-uid" name="uid" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" aria-describedby="signin-uid-hint" required>
          <small class="block mt-1" id="signin-uid-hint">The username you chose when you signed up (or the email on your account), not your full name.</small>
        </div>
        <div class="form-group">
          <label for="signin-password">Password</label>
          <input id="signin-password" name="password" type="password" autocomplete="current-password" required>
        </div>
        <button class="large primary submit-button" type="submit" disabled>Log in</button>
        <div role="status" aria-live="polite" id="signin-status"></div>
        <p class="text-sm mt-4">Forgot your username or password? Call <a href="{{ site.pvo_contact.phone_link }}">{{ site.pvo_contact.phone }}</a> or email <a href="mailto:{{ site.pvo_contact.email }}">{{ site.pvo_contact.email }}</a> and a PVO administrator will help.</p>
      </form>

      <hr class="my-4 border-neutral-700">
      <h3 class="text-lg font-bold mb-2" id="guest-title">Just looking around?</h3>
      <p class="my-3">Continue as a guest to try the profile survey without making an account. Guest sessions are temporary and are cleared after a week.</p>
      <button class="medium secondary" type="button" id="guest-button" disabled>Continue as guest</button>
      <div role="status" aria-live="polite" id="guest-status"></div>
    </section>

    <section class="signup-card" id="create" aria-labelledby="signup-title">
      <h2 class="text-xl font-bold" id="signup-title">Create an Account</h2>
      <hr class="my-4 border-neutral-700">
      <form id="signup-form" novalidate>
        <div class="form-group">
          <label for="signup-name">Full name</label>
          <input id="signup-name" name="name" type="text" autocomplete="name" minlength="2" required>
        </div>
        <div class="form-group">
          <label for="signup-uid">Choose a username</label>
          <input id="signup-uid" name="uid" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" minlength="2" maxlength="40" aria-describedby="signup-uid-hint" required>
          <small class="block mt-1" id="signup-uid-hint">Letters, numbers, dots, dashes, or underscores. You will log in with this, so pick one you will remember.</small>
        </div>
        <div class="form-group">
          <label for="signup-email">Email (optional)</label>
          <input id="signup-email" name="email" type="email" autocomplete="email">
        </div>
        <div class="form-group">
          <label for="signup-role">I am joining as</label>
          <select id="signup-role" name="role" aria-describedby="signup-role-hint">
            <option value="">Choose one (optional)</option>
            <option value="Veteran">A veteran or service member</option>
            <option value="Family">A family member of a veteran</option>
            <option value="Volunteer">A volunteer or supporter</option>
          </select>
          <small class="block mt-1" id="signup-role-hint">This is your member type, shown on your profile. You can change it later in your profile survey.</small>
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autocomplete="new-password" minlength="8" aria-describedby="signup-password-hint" required>
          <small class="block mt-1" id="signup-password-hint">At least 8 characters.</small>
        </div>
        <div class="form-group">
          <label for="signup-confirm">Confirm password</label>
          <input id="signup-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required>
        </div>
        <button class="large primary submit-button" type="submit" disabled>Create account</button>
        <div role="status" aria-live="polite" id="signup-status"></div>
      </form>
    </section>
  </div>
</div>

<p class="mt-6"><a href="{{ '/' | relative_url }}">Return to the PVO homepage</a></p>
