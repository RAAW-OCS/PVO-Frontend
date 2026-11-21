---
layout: pvo
title: Application Assist
permalink: /pvo-application-assist
hide: true
search_exclude: true
show_reading_time: false
active_tab: prescreener
---
{%- comment -%} Built from OCS pieces only: OCS card panels, buttons, .form-group fields and status boxes; Tailwind arrangement. {%- endcomment -%}
<div class="max-w-5xl">
  <div class="sticky top-[60px] z-30 mb-6 p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 font-bold"><span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-700">PVO</span><span>Application Assist Module</span></div>
        <div class="text-sm text-neutral-400 max-w-xl">Follow 4 steps: upload ID, review info, upload proof, open the PVO form.</div>
      </div>
      <a class="medium primary inline-flex items-center justify-center" href="/prescreener">Back to prescreener</a>
    </div>
    <div class="grid gap-1">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Module progress</div>
      <div class="font-bold" id="progress-title">Start application</div>
      <div class="text-sm text-neutral-400" id="progress-note">Next: upload a driver's license or state ID.</div>
    </div>
    <progress class="appearance-none w-full h-3 block rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-indigo-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:bg-indigo-500 [&::-moz-progress-bar]:rounded-full mt-3" id="progress-fill" max="100" value="0" aria-label="Application progress"></progress>
    <div class="flex flex-wrap items-center justify-between gap-3 mt-3">
      <div class="text-sm" id="progress-step">Step 1 of 4</div>
      <div class="flex gap-2" id="progress-dots"></div>
    </div>
  </div>
  <div id="app"></div>
</div>

<script>
const PRESCREENER_KEY = 'pvo_prescreener_context_v1';
const DRAFT_KEY = 'pvo_application_draft_v1';
const STEP_TOTAL = 4;
const BRANCH_OPTIONS = ['Army','Navy','Air Force','Marine Corps','Coast Guard','Space Force'];
const GENERAL_NEEDS = ['Home repairs','Medical','Counseling','Legal','Transportation','Family','Meals/food','Veterans Administration Services','Other'];
const PVO_NEED_MAP = {
  rent:'Other',utility:'Other',food:'Meals/food',transport:'Transportation',home_repair:'Home repairs',
  medical:'Medical',counseling:'Counseling',legal:'Legal',vehicle_reg:'Transportation',moving:'Other',
  storage:'Other',mental_health:'Counseling'
};
const NEED_TEXT = {
  rent:'rent or housing support',utility:'utility bill support',food:'food assistance',transport:'transportation support',
  home_repair:'home repair assistance',medical:'medical cost support',counseling:'counseling support',
  legal:'legal or VA benefits guidance',vehicle_reg:'vehicle registration help',moving:'moving or relocation help',
  storage:'storage fee assistance',mental_health:'PTSD / TBI support'
};
const EMPLOYMENT_TEXT = {
  employed:'currently working',unemployed:'currently between jobs',disabled:'currently disabled or unable to work'
};
const BACKEND_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:8426'
  : 'https://pvoteam-api.opencodingsociety.com';

let currentStep = 1;
let prescreenerContext = null;
let draft = null;

function escapeHtml(value=''){
  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function titleCase(value){
  return String(value || '')
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function splitName(fullName=''){
  const cleaned = fullName.replace(/\s+/g,' ').trim();
  if(!cleaned) return {firstName:'',lastName:''};
  const parts = cleaned.split(' ');
  return {firstName:parts.shift() || '', lastName:parts.join(' ') || ''};
}

function formatPhone(value){
  const digits = String(value || '').replace(/\D/g,'').slice(-10);
  if(digits.length !== 10) return value || '';
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function getPreviewValue(value, fallback='Not filled yet'){
  return escapeHtml(value && String(value).trim() ? value : fallback);
}

function fileToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function saveDraft(){
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadData(){
  try { prescreenerContext = JSON.parse(localStorage.getItem(PRESCREENER_KEY) || 'null'); } catch { prescreenerContext = null; }
  try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { draft = null; }
  if(!draft && prescreenerContext) draft = createDraftFromContext(prescreenerContext);
  if(draft?.specificNeed?.startsWith('Applicant is requesting') && prescreenerContext){
    draft.specificNeed = createDraftFromContext(prescreenerContext).specificNeed;
  }
}

function createDraftFromContext(ctx){
  const zip = ctx.user_zip || '';
  const generalNeed = PVO_NEED_MAP[ctx.need_type] || 'Other';
  const specificNeed = `Need: ${NEED_TEXT[ctx.need_type] || 'support'}. Work: ${EMPLOYMENT_TEXT[ctx.employment] || 'unknown'}. Household: ${ctx.household_sz || 1}. Housing: ${ctx.housing_risk ? 'at risk' : 'stable'}. VA: ${ctx.has_va_care ? 'connected' : 'not connected'}.`;
  return {
    firstName:'',lastName:'',street:'',city:'',state:'CA',zip,
    homePhone:'',cellPhone:'',email:'',branch:'',
    generalNeed,specificNeed,
    primaryDocName:'',primaryDocPreview:'',primaryDocText:'',
    proofDocName:'',proofDocPreview:'',
    ocrStatus:'idle',ocrMessage:'Upload ID to start.'
  };
}

function setStep(step, title, note){
  currentStep = step;
  document.getElementById('progress-title').textContent = title;
  document.getElementById('progress-note').textContent = note;
  document.getElementById('progress-step').textContent = `Step ${step} of ${STEP_TOTAL}`;
  document.getElementById('progress-fill').value = Math.round((step / STEP_TOTAL) * 100);
  document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
    dot.classList.toggle('complete', idx < step - 1);
    dot.classList.toggle('active', idx === step - 1);
  });
}

function initDots(){
  const dots = document.getElementById('progress-dots');
  dots.innerHTML = Array.from({length: STEP_TOTAL}, () => '<span class="w-2.5 h-2.5 rounded-full border border-neutral-600 [&.complete]:border-transparent [&.complete]:bg-[var(--text-muted)] [&.active]:border-indigo-500 [&.active]:bg-indigo-500 progress-dot"></span>').join('');
}

function parseDocumentText(rawText=''){
  const text = String(rawText || '').replace(/\r/g,'\n');
  const normalizedText = text
    .replace(/[|]/g,'I')
    .replace(/[“”]/g,'"')
    .replace(/[‘’]/g,"'")
    .replace(/[^\S\n]+/g,' ')
    .replace(/\n{2,}/g,'\n');
  const lines = normalizedText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  const parsed = {};

  const labelMap = {
    firstName: /(?:\bDAC\b|\bFN\b|\bFIRST\b|\bGIVEN\b|\bPR\b)[\s:;-]+([A-Z][A-Z' -]{1,})/i,
    lastName: /(?:\bDCS\b|\bLN\b|\bLAST\b|\bSURNAME\b|\bNO\b)[\s:;-]+([A-Z][A-Z' -]{1,})/i,
    street: /(?:\bDAG\b|\bADDR(?:ESS)?\b)[\s:;-]+([0-9A-Z.#' -]{5,})/i,
    city: /(?:\bDAI\b|\bCITY\b)[\s:;-]+([A-Z][A-Z' -]{1,})/i,
    state: /(?:\bDAJ\b|\bSTATE\b)[\s:;-]+([A-Z]{2}|CALIFORNIA)/i,
    zip: /(?:\bDAK\b|\bZIP\b)[\s:;-]+(\d{5})(?:-\d{4})?/i,
  };

  Object.entries(labelMap).forEach(([key, pattern]) => {
    const match = normalizedText.match(pattern);
    if(!match) return;
    if(key === 'zip') parsed[key] = match[1];
    else if(key === 'state') parsed[key] = match[1].length > 2 ? 'CA' : match[1].toUpperCase();
    else parsed[key] = titleCase(match[1]);
  });

  const email = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if(email) parsed.email = email[0];

  const phones = [...normalizedText.matchAll(/(?:\+?1[\s.-]*)?(?:\(?(\d{3})\)?[\s.-]*)?(\d{3})[\s.-]*(\d{4})/g)]
    .map(match => formatPhone(`${match[1] || ''}${match[2]}${match[3]}`))
    .filter(Boolean);
  if(phones[0]) parsed.homePhone = phones[0];
  if(phones[1]) parsed.cellPhone = phones[1];
  else if(phones[0]) parsed.cellPhone = phones[0];

  const branch = BRANCH_OPTIONS.find(option => new RegExp(`\\b${option.replace(/\s+/g,'\\s+')}\\b`, 'i').test(normalizedText));
  if(branch) parsed.branch = branch;

  const address = normalizedText.match(/\b\d{1,6}\s+[A-Za-z0-9.#'\- ]+\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl|Circle|Cir|Trail|Trl|Highway|Hwy)\b[^\n,]*/i);
  if(address) parsed.street = address[0].replace(/\s+/g,' ').trim();

  const cityStateZip = normalizedText.match(/([A-Za-z .'-]+),?\s+(CA|California|[A-Z]{2})\s+(\d{5})(?:-\d{4})?/i);
  if(cityStateZip){
    parsed.city = titleCase(cityStateZip[1]);
    parsed.state = cityStateZip[2].length > 2 ? 'CA' : cityStateZip[2].toUpperCase();
    parsed.zip = cityStateZip[3];
  }

  const cityLineIndex = lines.findIndex(line => /(?:^|\s)(CA|CALIFORNIA|[A-Z]{2})\s+\d{5}(?:-\d{4})?$/.test(line));
  if(cityLineIndex >= 0){
    const line = lines[cityLineIndex];
    const match = line.match(/([A-Z][A-Z .'-]+?)\s+(CA|CALIFORNIA|[A-Z]{2})\s+(\d{5})(?:-\d{4})?$/i);
    if(match){
      if(!parsed.city) parsed.city = titleCase(match[1]);
      if(!parsed.state) parsed.state = match[2].length > 2 ? 'CA' : match[2].toUpperCase();
      if(!parsed.zip) parsed.zip = match[3];
    }
    if(!parsed.street && cityLineIndex > 0){
      const prev = lines[cityLineIndex - 1];
      if(/^\d{1,6}\s+[A-Z0-9.#' -]+$/i.test(prev)) parsed.street = titleCase(prev);
    }
  }

  const labelledName = normalizedText.match(/(?:name|member name|patient name|recipient|customer)[:\s]+([A-Z][A-Za-z' -]+(?:\s+[A-Z][A-Za-z' -]+)+)/i);
  const allCapsName = normalizedText.match(/^([A-Z][A-Z' -]+,\s*[A-Z][A-Z' -]+)$/m);
  const plainName = normalizedText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})$/m);
  let fullName = '';
  if(labelledName) fullName = labelledName[1];
  else if(allCapsName) fullName = allCapsName[1].split(',').reverse().join(' ');
  else if(plainName) fullName = plainName[1];
  if(!fullName){
    const ignoreTokens = ['DRIVER','LICENSE','CALIFORNIA','IDENTIFICATION','CARD','CLASS','SEX','HEIGHT','WEIGHT','EYES','HAIR','DOB','EXP','ISS','DONOR','VETERAN','ORGAN'];
    const candidate = lines.slice(0, 10).find(line =>
      !/\d/.test(line) &&
      /^[A-Z][A-Z' -]{3,}$/.test(line) &&
      line.split(/\s+/).length >= 2 &&
      !ignoreTokens.some(token => line.includes(token))
    );
    if(candidate) fullName = candidate;
  }
  if(fullName){
    const split = splitName(titleCase(fullName.replace(',', ' ')));
    parsed.firstName = split.firstName;
    parsed.lastName = split.lastName;
  }

  if(!parsed.street){
    const streetLine = lines.find(line => /^\d{1,6}\s+[A-Z0-9.#' -]{4,}$/.test(line) && !/DOB|EXP|ISS|DL|LIC/i.test(line));
    if(streetLine) parsed.street = titleCase(streetLine);
  }

  return parsed;
}

function applyParsedFields(parsed){
  Object.entries(parsed).forEach(([key, value]) => {
    if(value && !draft[key]) draft[key] = value;
  });
  saveDraft();
}

function getMissingFields(){
  const missing = [];
  if(!draft.firstName) missing.push('First name');
  if(!draft.lastName) missing.push('Last name');
  if(!draft.street) missing.push('Street address');
  if(!draft.city) missing.push('City');
  if(!draft.state) missing.push('State');
  if(!draft.zip) missing.push('ZIP code');
  if(!draft.homePhone && !draft.cellPhone) missing.push('Phone number');
  if(!draft.email) missing.push('Email');
  if(!draft.branch) missing.push('Branch of service');
  if(!draft.generalNeed) missing.push('General need');
  if(!draft.specificNeed) missing.push('Specific need');
  if(!draft.proofDocName) missing.push('Proof of service file');
  return missing;
}

function updatePrimaryPreview(){
  const nameEl = document.getElementById('primary-doc-name');
  const previewEl = document.getElementById('primary-doc-preview');
  const statusEl = document.getElementById('ocr-state');
  if(nameEl) nameEl.textContent = draft.primaryDocName || 'No ID selected';
  if(previewEl){
    previewEl.innerHTML = draft.primaryDocPreview
      ? `<img class="block w-full h-full object-cover" src="${draft.primaryDocPreview}" alt="Primary document preview">`
      : '<div class="p-4 text-center text-sm text-neutral-400">ID preview appears here.</div>';
  }
  if(statusEl) statusEl.textContent = draft.ocrMessage;
}

function applyGeminiExtraction(extracted = {}){
  const fieldMap = {
    first_name: 'firstName',
    last_name: 'lastName',
    street: 'street',
    city: 'city',
    state: 'state',
    zip: 'zip',
    home_phone: 'homePhone',
    cell_phone: 'cellPhone',
    email: 'email',
    branch: 'branch',
    raw_visible_text: 'primaryDocText',
  };

  Object.entries(fieldMap).forEach(([sourceKey, targetKey]) => {
    const value = extracted[sourceKey];
    if(value && !draft[targetKey]) draft[targetKey] = value;
  });

  if(extracted.address && !draft.street){
    draft.street = extracted.address;
  }
  if(extracted.phone && !draft.cellPhone && !draft.homePhone){
    draft.cellPhone = extracted.phone;
  }
  saveDraft();
}

function updateProofPreview(){
  const nameEl = document.getElementById('proof-doc-name');
  const previewEl = document.getElementById('proof-doc-preview');
  if(nameEl) nameEl.textContent = draft.proofDocName || 'No proof selected';
  if(previewEl){
    previewEl.innerHTML = draft.proofDocPreview
      ? `<img class="block w-full h-full object-cover" src="${draft.proofDocPreview}" alt="Proof document preview">`
      : '<div class="p-4 text-center text-sm text-neutral-400">Proof preview appears here.</div>';
  }
}

async function handlePrimaryDoc(event){
  const file = event.target.files && event.target.files[0];
  draft.primaryDocName = file ? file.name : '';
  draft.primaryDocPreview = '';
  draft.primaryDocText = '';
  draft.ocrStatus = 'idle';
  draft.ocrMessage = file ? 'Reading document...' : 'Upload ID to start.';
  saveDraft();
  updatePrimaryPreview();

  if(file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onload = () => {
      draft.primaryDocPreview = reader.result;
      saveDraft();
      updatePrimaryPreview();
    };
    reader.readAsDataURL(file);
  }

  if(!file || !file.type.startsWith('image/')){
    draft.ocrMessage = file ? 'File saved. Review details next.' : draft.ocrMessage;
    saveDraft();
    updatePrimaryPreview();
    return;
  }

  try{
    draft.ocrStatus = 'running';
    draft.ocrMessage = 'Reading ID...';
    saveDraft();
    updatePrimaryPreview();
    const base64 = await fileToBase64(file);
    const response = await fetch(`${BACKEND_BASE}/api/pvo/extract-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType: 'drivers_license',
        mimeType: file.type || 'image/jpeg',
        imageBase64: base64,
      }),
    });

    const data = await response.json();
    if(!response.ok) throw new Error(data?.error || 'Gemini extraction failed');

    const extracted = data?.extracted || {};
    draft.primaryDocText = extracted.raw_visible_text || '';
    draft.ocrStatus = 'done';
    draft.ocrMessage = extracted.confidence_summary
      ? `Done: ${extracted.confidence_summary}`
      : 'Done. Review the fields next.';
    applyGeminiExtraction(extracted);
    applyParsedFields(parseDocumentText(draft.primaryDocText));
  }catch(error){
    draft.ocrStatus = 'error';
    draft.ocrMessage = 'Could not read ID. Review fields.';
    saveDraft();
  }

  renderCapture();
}

function handlePrimaryText(value){
  draft.primaryDocText = value;
  draft.ocrMessage = value.trim()
    ? 'Text saved.'
    : draft.ocrMessage;
  saveDraft();
}

function syncField(key, value){
  draft[key] = value;
  saveDraft();
}

function handleProofDoc(event){
  const file = event.target.files && event.target.files[0];
  draft.proofDocName = file ? file.name : '';
  draft.proofDocPreview = '';
  saveDraft();
  updateProofPreview();

  if(file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onload = () => {
      draft.proofDocPreview = reader.result;
      saveDraft();
      updateProofPreview();
    };
    reader.readAsDataURL(file);
  }
}

function prepareVerification(){
  if(draft.ocrStatus === 'running') return;
  applyParsedFields(parseDocumentText(draft.primaryDocText || ''));
  renderVerify();
}

function renderNoContext(){
  setStep(1, 'Start application', 'Start with the prescreener first.');
  document.getElementById('app').innerHTML = `<div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
    <div class="text-2xl font-bold">Start with the prescreener</div>
    <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-sm">Answer the quick eligibility questions first. Then come back here to build the application draft.</div>
    <div class="flex flex-wrap gap-3">
      <a class="large filledTinted primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" href="/prescreener">Open prescreener →</a>
    </div>
  </div>`;
}

function renderCapture(){
  setStep(1, 'Step 1: Upload ID', 'Take a clear photo of a driver license or state ID.');
  const ocrRunning = draft.ocrStatus === 'running';
  document.getElementById('app').innerHTML = `<div class="grid gap-4">
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="text-2xl font-bold">Upload your ID</div>
      <div class="text-sm">Use a driver license or state ID. We will pull name and address, then you review it.</div>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Step 1</div>
        <div class="font-bold my-1">Upload ID</div>
        <div class="text-sm">Name and address.</div>
      </div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Step 2</div>
        <div class="font-bold my-1">Review info</div>
        <div class="text-sm">Fix anything wrong.</div>
      </div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Step 3</div>
        <div class="font-bold my-1">Upload proof</div>
        <div class="text-sm">Military ID or DD-214.</div>
      </div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Step 4</div>
        <div class="font-bold my-1">Open form</div>
        <div class="text-sm">Use the final draft.</div>
      </div>
    </div>
    <div class="grid gap-3 md:grid-cols-2">
      <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
        <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
          <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Do this now</div>
          <div class="font-bold my-1">Choose ID photo</div>
          <div class="text-sm">Driver license or state ID.</div>
        </div>
        <label class="block p-4 rounded-lg border border-dashed border-neutral-600 cursor-pointer hover:border-indigo-500">
          <input type="file" accept="image/*,.pdf" capture="environment" class="sr-only" onchange="handlePrimaryDoc(event)">
          <div class="font-bold my-1">Upload ID</div>
          <div class="text-sm">Clear photo works best.</div>
        </label>
        <div class="text-xs text-neutral-400" id="primary-doc-name">${escapeHtml(draft.primaryDocName || 'No ID selected')}</div>
        <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-sm" id="ocr-state">${escapeHtml(draft.ocrMessage || '')}</div>
        <details class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
          <summary class="font-bold my-1">Upload not working?</summary>
          <div class="form-group">
            <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Paste ID text</label>
            <textarea class="smallInput w-full min-h-[8rem]" placeholder="Paste text from the ID here." oninput="handlePrimaryText(this.value)">${escapeHtml(draft.primaryDocText || '')}</textarea>
          </div>
        </details>
      </div>
      <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
        <div class="font-bold my-1">Preview</div>
        <div class="rounded-lg bg-neutral-900 border border-neutral-700 min-h-[15rem] flex items-center justify-center overflow-hidden" id="primary-doc-preview"></div>
      </div>
    </div>
    <div class="flex flex-wrap gap-3">
      <a class="large primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" href="/prescreener">Back to prescreener</a>
      <button class="large primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed${ocrRunning ? ' is-disabled' : ''}" ${ocrRunning ? 'disabled' : ''} onclick="prepareVerification()">${ocrRunning ? 'Reading ID...' : 'Next: review info →'}</button>
    </div>
  </div>`;
  updatePrimaryPreview();
}

function renderVerify(){
  setStep(2, 'Step 2: Review info', 'Check each field. Fix anything wrong.');
  const hasRawText = !!(draft.primaryDocText && draft.primaryDocText.trim());
  const rawTextPanel = hasRawText
    ? `<details class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4"><summary class="font-bold my-1">Show ID text</summary><div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-auto">${escapeHtml(draft.primaryDocText)}</div></details>`
    : '';
  document.getElementById('app').innerHTML = `<div class="grid gap-4">
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Do this now</div>
      <div class="text-2xl font-bold">Review the information</div>
      <div class="text-sm">Check the fields below. Edit anything that is missing or wrong.</div>
    </div>
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-x-4 md:grid-cols-2">
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">First name</label>
        <input class="w-full" value="${escapeHtml(draft.firstName || '')}" oninput="syncField('firstName', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Last name</label>
        <input class="w-full" value="${escapeHtml(draft.lastName || '')}" oninput="syncField('lastName', this.value)">
      </div>
      <div class="form-group md:col-span-2">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Street address</label>
        <input class="w-full" value="${escapeHtml(draft.street || '')}" oninput="syncField('street', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">City</label>
        <input class="w-full" value="${escapeHtml(draft.city || '')}" oninput="syncField('city', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">State</label>
        <input class="w-full" value="${escapeHtml(draft.state || '')}" oninput="syncField('state', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">ZIP code</label>
        <input class="w-full" value="${escapeHtml(draft.zip || '')}" oninput="syncField('zip', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Home phone</label>
        <input class="w-full" value="${escapeHtml(draft.homePhone || '')}" oninput="syncField('homePhone', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Cell phone</label>
        <input class="w-full" value="${escapeHtml(draft.cellPhone || '')}" oninput="syncField('cellPhone', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</label>
        <input class="w-full" value="${escapeHtml(draft.email || '')}" oninput="syncField('email', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Branch of service</label>
        <select class="w-full" onchange="syncField('branch', this.value)">
          <option value="">Select branch</option>
          ${BRANCH_OPTIONS.map(option => `<option value="${option}" ${draft.branch===option?'selected':''}>${option}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">General need</label>
        <select class="w-full" onchange="syncField('generalNeed', this.value)">
          ${GENERAL_NEEDS.map(option => `<option value="${option}" ${draft.generalNeed===option?'selected':''}>${option}</option>`).join('')}
        </select>
      </div>
      <div class="form-group md:col-span-2">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Specific need</label>
        <textarea class="smallInput w-full min-h-[8rem]" oninput="syncField('specificNeed', this.value)">${escapeHtml(draft.specificNeed || '')}</textarea>
      </div>
    </div>
    ${rawTextPanel}
    <div class="flex flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderCapture()">Back</button>
      <button class="large primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderProof()">Next: upload proof →</button>
    </div>
  </div>`;
}

function renderProof(){
  setStep(3, 'Step 3: Upload proof', 'Upload military ID, DD-214, or other proof of service.');
  document.getElementById('app').innerHTML = `<div class="grid gap-4">
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Do this now</div>
      <div class="text-2xl font-bold">Upload proof of service</div>
      <div class="text-sm">Use a military ID, DD-214, or another service document.</div>
    </div>
    <div class="grid gap-3 md:grid-cols-2">
      <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
        <label class="block p-4 rounded-lg border border-dashed border-neutral-600 cursor-pointer hover:border-indigo-500">
          <input type="file" accept="image/*,.pdf,.doc,.txt" capture="environment" class="sr-only" onchange="handleProofDoc(event)">
          <div class="font-bold my-1">Upload proof of service</div>
          <div class="text-sm">Photo, PDF, or document.</div>
        </label>
        <div class="text-xs text-neutral-400" id="proof-doc-name">${escapeHtml(draft.proofDocName || 'No proof selected')}</div>
        <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex justify-between items-start gap-3">
          <div>
            <strong>Draft fields</strong>
            <div class="text-sm">Info reviewed.</div>
          </div>
          <div class="text-xs font-bold rounded-full px-2 py-0.5 mt-0 whitespace-nowrap overall-status success">Ready</div>
        </div>
        <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex justify-between items-start gap-3">
          <div>
            <strong>Proof file</strong>
            <div class="text-sm">${escapeHtml(draft.proofDocName || 'Upload needed')}</div>
          </div>
          <div class="text-xs font-bold rounded-full px-2 py-0.5 mt-0 whitespace-nowrap ${draft.proofDocName ? 'overall-status success' : 'overall-status error'}">${draft.proofDocName ? 'Uploaded' : 'Missing'}</div>
        </div>
      </div>
      <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
        <div class="font-bold my-1">Proof preview</div>
        <div class="rounded-lg bg-neutral-900 border border-neutral-700 min-h-[15rem] flex items-center justify-center overflow-hidden" id="proof-doc-preview"></div>
      </div>
    </div>
    <div class="flex flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderVerify()">Back</button>
      <button class="large primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderFinal()">Next: final review →</button>
    </div>
  </div>`;
  updateProofPreview();
}

function renderFinal(){
  setStep(4, 'Step 4: Open form', 'Review missing items, then open the PVO form.');
  const missing = getMissingFields();
  document.getElementById('app').innerHTML = `<div class="grid gap-4">
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Do this now</div>
      <div class="text-2xl font-bold">Final review</div>
      <div class="text-sm">Check the draft. Then open the official PVO form.</div>
    </div>
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-3">
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(`${draft.firstName} ${draft.lastName}`.trim())}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Address</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue([draft.street,draft.city,draft.state,draft.zip].filter(Boolean).join(', '))}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Home phone</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.homePhone)}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Cell phone</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.cellPhone)}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.email)}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Branch</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.branch)}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">General need</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.generalNeed)}</div></div>
      <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Specific need</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.specificNeed)}</div></div>
    </div>
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="font-bold my-1">Documents</div>
      <div class="flex flex-wrap gap-2">
        <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs">DL / ID: ${escapeHtml(draft.primaryDocName || 'Not uploaded yet')}</div>
        <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs">Proof of service: ${escapeHtml(draft.proofDocName || 'Not uploaded yet')}</div>
      </div>
    </div>
    <div class="p-4 sm:p-5 rounded-lg bg-neutral-800 border border-neutral-700 grid gap-4">
      <div class="font-bold my-1">Missing items</div>
      ${missing.length
        ? `<div class="grid gap-1 text-sm">${missing.map(item => `<div>• ${escapeHtml(item)}</div>`).join('')}</div>`
        : `<div class="overall-status partial flex gap-3 items-start text-left"><div class="font-bold shrink-0">✓</div><div class="text-sm">Ready to open the PVO form.</div></div>`}
    </div>
    <div class="flex flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderProof()">Back</button>
      <button class="large secondary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" onclick="renderVerify()">Edit draft</button>
      <a class="large filledTinted primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed [&.is-disabled]:opacity-50 [&.is-disabled]:cursor-not-allowed" href="https://powayveterans.org/request-assistance/" target="_blank">Open live PVO form →</a>
    </div>
  </div>`;
}

function init(){
  initDots();
  loadData();
  if(!prescreenerContext){
    renderNoContext();
    return;
  }
  if(!draft) draft = createDraftFromContext(prescreenerContext);
  saveDraft();
  renderCapture();
}

init();
</script>
