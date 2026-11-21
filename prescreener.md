---
layout: pvo
title: Request assistance
permalink: /prescreener
hide: true
search_exclude: true
show_reading_time: false
active_tab: prescreener
---
{%- comment -%} Built from OCS pieces only: OCS card panels, buttons, .form-group fields and status boxes; Tailwind arrangement. {%- endcomment -%}
<div class="max-w-4xl">

  <div class="sticky top-[60px] z-30 mb-6 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
    <!-- Top bar -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2 font-bold">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-700">PVO</span>
            Poway Veterans Organization
          </div>
        </div>
        <div class="text-sm text-neutral-400 max-w-md">Fast prescreener for veterans and family members. Clear path, fewer questions, better handoff.</div>
      </div>
    </div>

    <!-- Progress section -->
    <div class="grid gap-3">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div class="grid gap-1">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Progress</span>
          <span class="font-bold" id="prog-label">Let's find your support</span>
          <span class="text-sm text-neutral-400" id="prog-note">Start with your ZIP code so we can confirm the right service area.</span>
        </div>
        <div class="grid gap-0.5 sm:text-right">
          <span class="text-2xl font-bold" id="prog-pct">0%</span>
          <span class="text-xs font-bold text-neutral-400" id="prog-step">Step 0 of 7</span>
        </div>
      </div>
      <progress class="appearance-none w-full h-3 block rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-indigo-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:bg-indigo-500 [&::-moz-progress-bar]:rounded-full" id="prog-bar" max="100" value="0" aria-label="Prescreener progress"></progress>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="text-sm" id="prog-caption">About 2 minutes total.</span>
        <div class="flex gap-2" id="prog-dots"></div>
      </div>
      <div class="overall-status success flex items-center justify-center gap-2 hidden" id="time-saved">
        <div class="shrink-0">
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-2.5 h-2.5"><polyline points="2,5 4.2,7.2 8,3"/></svg>
        </div>
        <span class="text-sm font-bold">You've saved&nbsp;<span class="font-bold" id="time-num">0 sec</span>&nbsp;by using our prescreener</span>
      </div>
    </div>
  </div>

  <!-- Summary chips -->
  <div class="flex flex-wrap gap-2 max-w-4xl mb-5" id="summary-bar"></div>

  <!-- Main stage -->
  <div class="max-w-4xl flex flex-col items-center" id="stage"></div>
</div>

<!-- Toast -->
<div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 text-sm font-bold whitespace-nowrap opacity-0 pointer-events-none transition-opacity [&.show]:opacity-100" id="toast">
  <span class="font-bold">★</span>
  <span id="toast-msg">Great answer!</span>
</div>

<!-- Milestone burst -->
<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-lg bg-neutral-800 border border-neutral-700 text-center scale-0 transition-transform [&.show]:scale-100" id="burst">
  <span class="block text-4xl mb-2" id="burst-emoji">🎖️</span>
  <div class="font-bold" id="burst-title">Halfway there!</div>
  <div class="text-sm text-neutral-400" id="burst-sub">Keep going — just 3 more questions.</div>
</div>

<script>
const VETERAN_API_BASE = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? 'http://localhost:8426'
  : 'https://pvoteam-api.opencodingsociety.com';

// ── Zip code data ─────────────────────────────────────────────────────────────
const SERVED_ZIPS = {
  // Poway
  '92064':['Poway','poway'],'92074':['Poway','poway'],
  // Ramona
  '92065':['Ramona','ramona'],
  // Escondido
  '92025':['Escondido','escondido'],'92026':['Escondido','escondido'],'92027':['Escondido','escondido'],'92029':['Escondido','escondido'],
  // Vista
  '92081':['Vista','vista'],'92083':['Vista','vista'],'92084':['Vista','vista'],
  // Santee
  '92071':['Santee','santee'],
  // San Marcos
  '92069':['San Marcos','san_marcos'],'92078':['San Marcos','san_marcos'],
  // Spring Valley
  '91977':['Spring Valley','spring_valley'],'91978':['Spring Valley','spring_valley'],
  // Mira Mesa / Scripps Ranch (San Diego)
  '92126':['Mira Mesa','mira_mesa'],'92131':['Scripps Ranch','san_diego'],
  // San Diego broader
  '92037':['La Jolla','san_diego'],'92103':['Mission Hills','san_diego'],
  '92101':['Downtown SD','san_diego'],'92104':['North Park','san_diego'],
  '92105':['City Heights','san_diego'],'92106':['Point Loma','san_diego'],
  '92107':['Ocean Beach','san_diego'],'92108':['Mission Valley','san_diego'],
  '92109':['Pacific Beach','san_diego'],'92110':['Old Town','san_diego'],
  '92111':['Linda Vista','san_diego'],'92113':['Logan Heights','san_diego'],
  '92114':['Encanto','san_diego'],'92115':['College Area','san_diego'],
  '92116':['Normal Heights','san_diego'],'92117':['Clairemont','san_diego'],
  '92119':['San Carlos','san_diego'],'92120':['Allied Gardens','san_diego'],
  '92121':['Torrey Pines','san_diego'],'92122':['University City','san_diego'],
  '92123':['Serra Mesa','san_diego'],'92124':['Tierrasanta','san_diego'],
  '92127':['Rancho Bernardo','san_diego'],'92128':['Rancho Bernardo','san_diego'],
  '92129':['Rancho Penasquitos','san_diego'],'92130':['Carmel Valley','san_diego'],
  '92145':['Miramar','san_diego'],
  // Carlsbad
  '92008':['Carlsbad','carlsbad'],'92009':['Carlsbad','carlsbad'],'92010':['Carlsbad','carlsbad'],'92011':['Carlsbad','carlsbad'],
  // Imperial Beach
  '91932':['Imperial Beach','imperial_beach'],
  // Chula Vista
  '91910':['Chula Vista','chula_vista'],'91911':['Chula Vista','chula_vista'],'91913':['Chula Vista','chula_vista'],'91914':['Chula Vista','chula_vista'],
  // Fallbrook
  '92028':['Fallbrook','fallbrook'],
  // Pacific Beach
  '92109':['Pacific Beach','pacific_beach'],
};

// ── Questions ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {id:'vet_status',tag:'Who you are',text:'Are you a veteran or a family member?',sub:'PVO supports veterans and their dependents across the Poway–Ramona area.',type:'tiles',cols:2,
    options:[{v:'veteran',icon:'🎖️',label:'I served',sub:'Active duty or veteran'},{v:'dependent',icon:'👨‍👩‍👧',label:"I'm family",sub:'Dependent or surviving spouse'}]},
  {id:'need_type',tag:'What you need',text:"What's your primary need right now?",sub:'Pick the one that feels most urgent.',type:'tiles',cols:2,
    options:[{v:'rent',icon:'🏠',label:'Rent / housing'},{v:'utility',icon:'💡',label:'Utility bills'},{v:'food',icon:'🛒',label:'Food assistance'},{v:'transport',icon:'🚗',label:'Transportation'},{v:'home_repair',icon:'🔧',label:'Home repairs'},{v:'medical',icon:'⚕️',label:'Medical costs'},{v:'counseling',icon:'🧠',label:'Counseling'},{v:'legal',icon:'⚖️',label:'Legal / VA benefits'},{v:'vehicle_reg',icon:'📋',label:'Vehicle registration'},{v:'moving',icon:'📦',label:'Moving / relocation'},{v:'storage',icon:'🗄️',label:'Storage fees'},{v:'mental_health',icon:'💙',label:'PTSD / TBI support'}]},
  {id:'employment',tag:'Your situation',text:"What's your current work status?",type:'tiles',cols:1,
    options:[{v:'employed',icon:'💼',label:'Working',sub:'Full or part time'},{v:'unemployed',icon:'🔍',label:'Between jobs',sub:'Actively looking or laid off'},{v:'disabled',icon:'🛡️',label:'Disabled / unable to work',sub:'Service-connected or medical'}]},
  {id:'household_sz',tag:'Your household',text:'How many people are in your household?',sub:'Including yourself.',type:'stepper',min:1,max:12,def:1},
  {id:'housing_risk',tag:'Housing safety',text:'Is your housing currently at risk?',sub:'This helps us flag urgency to our review committee.',type:'tiles',cols:1,
    options:[{v:1,icon:'🚨',label:"Yes — I'm behind on rent, facing eviction, or currently unhoused"},{v:0,icon:'✅',label:'No — my housing is stable right now'}]},
  {id:'has_va_care',tag:'VA connection',text:'Are you connected to VA services?',sub:'VA healthcare, disability claims, or a VA counselor.',type:'tiles',cols:1,
    options:[{v:1,icon:'🏥',label:"Yes — I'm in the VA system"},{v:0,icon:'❌',label:"No — I'm not currently connected"}]},
];

const TOTAL_STEPS = QUESTIONS.length + 1; // +1 for zip
let currentQ = -1; // -1 = zip screen
let stepperVal = 1;
const answers = {};
let savedSeconds = 0;
let zipLocation = null;
let smartDraft = null;
let livePrediction = null;

// ── Chip labels ───────────────────────────────────────────────────────────────
const CHIP_LABELS = {
  vet_status:{veteran:'🎖️ Veteran',dependent:'👨‍👩‍👧 Family'},
  need_type:{rent:'🏠 Rent',utility:'💡 Utilities',food:'🛒 Food',transport:'🚗 Transport',home_repair:'🔧 Home repair',medical:'⚕️ Medical',counseling:'🧠 Counseling',legal:'⚖️ Legal',vehicle_reg:'📋 Vehicle reg',moving:'📦 Moving',storage:'🗄️ Storage',mental_health:'💙 Mental health'},
  employment:{employed:'💼 Working',unemployed:'🔍 Job seeking',disabled:'🛡️ Disabled'},
  household_sz:(v)=>`👥 ${v} person${v>1?'s':''}`,
  housing_risk:{0:'✅ Stable housing',1:'🚨 Housing at risk'},
  has_va_care:{0:'❌ Not VA connected',1:'🏥 VA connected'},
};

const TOASTS = [
  "You're off to a great start!",
  "Got it — nice work.",
  "Perfect, noted!",
  "Halfway there — keep going!",
  "Almost done!",
  "One more question!",
];

const PVO_NEED_MAP = {
  rent:'Other',
  utility:'Other',
  food:'Meals/food',
  transport:'Transportation',
  home_repair:'Home repairs',
  medical:'Medical',
  counseling:'Counseling',
  legal:'Legal',
  vehicle_reg:'Transportation',
  moving:'Other',
  storage:'Other',
  mental_health:'Counseling',
};

const NEED_TEXT = {
  rent:'rent or housing support',
  utility:'utility bill support',
  food:'food assistance',
  transport:'transportation support',
  home_repair:'home repair assistance',
  medical:'medical cost support',
  counseling:'counseling support',
  legal:'legal or VA benefits guidance',
  vehicle_reg:'vehicle registration help',
  moving:'moving or relocation help',
  storage:'storage fee assistance',
  mental_health:'PTSD / TBI support',
};

const EMPLOYMENT_TEXT = {
  employed:'currently working',
  unemployed:'currently between jobs',
  disabled:'currently disabled or unable to work',
};

const BRANCH_OPTIONS = ['Army','Navy','Air Force','Marine Corps','Coast Guard','Space Force'];
const SMART_REQUIRED_FIELDS = ['firstName','lastName','street','city','state','zip','cellPhone','email','branch','generalNeed','specificNeed','proofDocName'];

// ── Utilities ─────────────────────────────────────────────────────────────────
const PROGRESS_NOTES = [
  'Start with your ZIP code so we can confirm the right service area.',
  'We only ask what helps route your support request.',
  'Pick the need that feels most urgent right now.',
  'This helps us understand your current situation.',
  'Household size helps us gauge support fit.',
  'Housing stability helps us flag urgency.',
  'VA connection helps us coordinate next steps.',
  'Your routing summary is ready.'
];

function initProgressDots(){
  const dots = document.getElementById('prog-dots');
  if(!dots) return;
  dots.innerHTML = Array.from({length: TOTAL_STEPS}, (_, idx) => `<span class="w-2.5 h-2.5 rounded-full border border-neutral-600 [&.complete]:border-transparent [&.complete]:bg-[var(--text-muted)] [&.active]:border-indigo-500 [&.active]:bg-indigo-500 progress-dot" data-step="${idx}"></span>`).join('');
}

function updateProgress(){
  const step = currentQ + 1; // 0 = zip, 1..N = questions
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  document.getElementById('prog-bar').value = pct;
  document.getElementById('prog-pct').textContent = pct+'%';
  document.getElementById('prog-step').textContent = `Step ${step} of ${TOTAL_STEPS}`;
  const labels=[
    'Let\'s find your support',
    'Tell us who needs help',
    'Choose your main need',
    'Tell us your work status',
    'Confirm household size',
    'Flag housing urgency',
    'Check VA connection',
    'Review your result'
  ];
  const captions=[
    'About 2 minutes total.',
    '1 of 6 quick questions complete.',
    '2 of 6 quick questions complete.',
    '3 of 6 quick questions complete.',
    '4 of 6 quick questions complete.',
    '5 of 6 quick questions complete.',
    'Last question before results.',
    'Done. Review the best next step.'
  ];
  document.getElementById('prog-label').textContent = labels[Math.min(step,labels.length-1)] || 'Almost done!';
  document.getElementById('prog-note').textContent = PROGRESS_NOTES[Math.min(step,PROGRESS_NOTES.length-1)] || PROGRESS_NOTES.at(-1);
  document.getElementById('prog-caption').textContent = captions[Math.min(step,captions.length-1)] || 'Done. Review the best next step.';
  document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
    dot.classList.toggle('complete', idx < step);
    dot.classList.toggle('active', idx === step && step < TOTAL_STEPS);
  });
}

function addTimeSaved(seconds){
  savedSeconds += seconds;
  const el = document.getElementById('time-saved');
  const numEl = document.getElementById('time-num');
  el.classList.remove('hidden');
  const mins = Math.floor(savedSeconds/60);
  numEl.textContent = mins>0?`${mins} min ${savedSeconds%60} sec`:`${savedSeconds} sec`;
}

function addChip(id, val){
  const bar = document.getElementById('summary-bar');
  let label = '';
  if(typeof CHIP_LABELS[id] === 'function') label = CHIP_LABELS[id](val);
  else if(CHIP_LABELS[id]) label = CHIP_LABELS[id][val] || val;
  else if(id==='zip') label = `📍 ${val}`;
  if(!label) return;
  const old = document.getElementById('chip-'+id);
  if(old) old.remove();
  const chip = document.createElement('div');
  chip.className = 'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs';
  chip.id = 'chip-'+id;
  chip.textContent = label;
  bar.appendChild(chip);
}

function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
}

function showMilestone(emoji,title,sub){
  const b = document.getElementById('burst');
  document.getElementById('burst-emoji').textContent = emoji;
  document.getElementById('burst-title').textContent = title;
  document.getElementById('burst-sub').textContent = sub;
  b.classList.add('show');
  setTimeout(()=>b.classList.remove('show'),2200);
}

function confetti(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors=['bg-indigo-500','bg-neutral-50','bg-neutral-400'];
  const sizes=['w-1 h-1.5','w-1.5 h-2','w-2 h-2.5','w-2.5 h-1.5'];
  for(let i=0;i<55;i++){
    const c=document.createElement('div');
    const x=`${Math.round(Math.random()*100)}vw`;
    c.className=`fixed left-0 -top-2 pointer-events-none z-[1000] rounded-sm ${colors[i%colors.length]} ${sizes[i%sizes.length]}`;
    document.body.appendChild(c);
    c.animate([{opacity:1,transform:`translate(${x},-10px) rotate(0deg)`},{opacity:0,transform:`translate(${x},100vh) rotate(540deg)`}],
      {duration:(1.6+Math.random()*2)*1000, delay:Math.random()*700, easing:'linear', fill:'forwards'});
    setTimeout(()=>c.remove(),4500);
  }
}

function setApplicationHeader(label,note,caption){
  document.getElementById('prog-bar').value = 100;
  document.getElementById('prog-pct').textContent='100%';
  document.getElementById('prog-label').textContent=label;
  document.getElementById('prog-step').textContent='PVO application prep';
  document.getElementById('prog-note').textContent=note;
  document.getElementById('prog-caption').textContent=caption;
  document.querySelectorAll('.progress-dot').forEach(dot => {
    dot.classList.remove('active');
    dot.classList.add('complete');
  });
}

function formatPhone(value){
  const digits = String(value || '').replace(/\D/g,'').slice(-10);
  if(digits.length !== 10) return value || '';
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function titleCase(value){
  return String(value || '')
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value=''){
  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function splitName(fullName=''){
  const cleaned = fullName.replace(/\s+/g,' ').trim();
  if(!cleaned) return {firstName:'',lastName:''};
  const parts = cleaned.split(' ');
  return {firstName:parts.shift() || '', lastName:parts.join(' ') || ''};
}

function mapGeneralNeed(){
  return PVO_NEED_MAP[answers.need_type] || 'Other';
}

function buildSpecificNeedSummary(){
  const need = NEED_TEXT[answers.need_type] || 'support';
  const work = EMPLOYMENT_TEXT[answers.employment] || 'current employment information not provided';
  const household = answers.household_sz || 1;
  const housing = answers.housing_risk ? 'housing is currently at risk' : 'housing is currently stable';
  const va = answers.has_va_care ? 'already connected to VA services' : 'not yet connected to VA services';
  const area = answers.user_zip && SERVED_ZIPS[answers.user_zip] ? `${SERVED_ZIPS[answers.user_zip][0]} (${answers.user_zip})` : 'service area confirmed';
  return `Applicant is requesting ${need}. They report being ${work}, a household size of ${household}, and that ${housing}. Applicant is ${va}. Intake started from ${area}.`;
}

function createSmartDraft(){
  return {
    firstName:'',
    lastName:'',
    street:'',
    city:'',
    state:'CA',
    zip:answers.user_zip || '',
    homePhone:'',
    cellPhone:'',
    email:'',
    branch:'',
    generalNeed:mapGeneralNeed(),
    specificNeed:buildSpecificNeedSummary(),
    primaryDocName:'',
    primaryDocPreview:'',
    primaryDocText:'',
    proofDocName:'',
    proofDocPreview:'',
  };
}

function ensureSmartDraft(){
  if(!smartDraft) smartDraft = createSmartDraft();
  if(!smartDraft.generalNeed) smartDraft.generalNeed = mapGeneralNeed();
  if(!smartDraft.specificNeed) smartDraft.specificNeed = buildSpecificNeedSummary();
  if(!smartDraft.zip && answers.user_zip) smartDraft.zip = answers.user_zip;
  return smartDraft;
}

function parseDocumentText(rawText=''){
  const text = String(rawText || '').replace(/\r/g,'\n');
  const parsed = {};

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if(email) parsed.email = email[0];

  const phones = [...text.matchAll(/(?:\+?1[\s.-]*)?(?:\(?(\d{3})\)?[\s.-]*)?(\d{3})[\s.-]*(\d{4})/g)]
    .map(match => formatPhone(`${match[1] || ''}${match[2]}${match[3]}`))
    .filter(Boolean);
  if(phones[0]) parsed.homePhone = phones[0];
  if(phones[1]) parsed.cellPhone = phones[1];
  else if(phones[0] && !parsed.cellPhone) parsed.cellPhone = phones[0];

  const branch = BRANCH_OPTIONS.find(option => new RegExp(`\\b${option.replace(/\s+/g,'\\s+')}\\b`, 'i').test(text));
  if(branch) parsed.branch = branch;

  const address = text.match(/\b\d{1,6}\s+[A-Za-z0-9.#'\- ]+\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl|Circle|Cir|Trail|Trl|Highway|Hwy)\b[^\n,]*/i);
  if(address) parsed.street = address[0].replace(/\s+/g,' ').trim();

  const cityStateZip = text.match(/([A-Za-z .'-]+),\s*(CA|California|[A-Z]{2})\s+(\d{5})(?:-\d{4})?/i);
  if(cityStateZip){
    parsed.city = titleCase(cityStateZip[1]);
    parsed.state = cityStateZip[2].length > 2 ? 'CA' : cityStateZip[2].toUpperCase();
    parsed.zip = cityStateZip[3];
  }

  const labelledName = text.match(/(?:name|member name|patient name|recipient)[:\s]+([A-Z][A-Za-z' -]+(?:\s+[A-Z][A-Za-z' -]+)+)/i);
  const allCapsName = text.match(/^([A-Z][A-Z' -]+,\s*[A-Z][A-Z' -]+)$/m);
  const plainName = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})$/m);
  let fullName = '';
  if(labelledName) fullName = labelledName[1];
  else if(allCapsName) fullName = allCapsName[1].split(',').reverse().join(' ');
  else if(plainName) fullName = plainName[1];
  if(fullName){
    const split = splitName(titleCase(fullName.replace(',', ' ')));
    parsed.firstName = split.firstName;
    parsed.lastName = split.lastName;
  }

  return parsed;
}

function getMissingSmartFields(){
  const draft = ensureSmartDraft();
  const missing = [];
  if(!draft.firstName) missing.push('First name');
  if(!draft.lastName) missing.push('Last name');
  if(!draft.street) missing.push('Street address');
  if(!draft.city) missing.push('City');
  if(!draft.state) missing.push('State');
  if(!draft.zip) missing.push('ZIP code');
  if(!draft.cellPhone && !draft.homePhone) missing.push('Phone number');
  if(!draft.email) missing.push('Email');
  if(!draft.branch) missing.push('Branch of service');
  if(!draft.generalNeed) missing.push('General need');
  if(!draft.specificNeed) missing.push('Specific need details');
  if(!draft.proofDocName) missing.push('Proof of service upload');
  return missing;
}

function getPreviewValue(value, fallback='Not filled yet'){
  return escapeHtml(value && String(value).trim() ? value : fallback);
}

function updateUploadPreview(kind){
  const draft = ensureSmartDraft();
  const nameKey = kind === 'primary' ? 'primaryDocName' : 'proofDocName';
  const previewKey = kind === 'primary' ? 'primaryDocPreview' : 'proofDocPreview';
  const fileNameEl = document.getElementById(`${kind}-doc-name`);
  const previewEl = document.getElementById(`${kind}-doc-preview`);
  if(fileNameEl) fileNameEl.textContent = draft[nameKey] || 'No file selected yet';
  if(previewEl){
    previewEl.innerHTML = draft[previewKey]
      ? `<img class="block w-full h-full object-cover" src="${draft[previewKey]}" alt="${kind} document preview" />`
      : `<div class="p-4 text-center text-sm text-neutral-400">${kind === 'primary' ? 'Upload or capture a document for name, address, contact details, and service clues.' : 'Upload DD-214, military ID, or another proof-of-service file.'}</div>`;
  }
}

function handlePrimaryDoc(event){
  const draft = ensureSmartDraft();
  const file = event.target.files && event.target.files[0];
  draft.primaryDocName = file ? file.name : '';
  draft.primaryDocPreview = '';
  updateUploadPreview('primary');
  if(file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onload = () => {
      draft.primaryDocPreview = reader.result;
      updateUploadPreview('primary');
    };
    reader.readAsDataURL(file);
  }
}

function handleProofDoc(event){
  const draft = ensureSmartDraft();
  const file = event.target.files && event.target.files[0];
  draft.proofDocName = file ? file.name : '';
  draft.proofDocPreview = '';
  updateUploadPreview('proof');
  if(file && file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onload = () => {
      draft.proofDocPreview = reader.result;
      updateUploadPreview('proof');
    };
    reader.readAsDataURL(file);
  }
}

function handlePrimaryDocText(value){
  ensureSmartDraft().primaryDocText = value;
}

function syncDraftField(key, value){
  ensureSmartDraft()[key] = value;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(){
  if(currentQ === -1) renderZip();
  else renderQuestion(currentQ);
  updateProgress();
}

function renderZip(){
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 w-full transition-all duration-300 [&.exit]:opacity-0 [&.exit]:-translate-y-4" id="q-card">
    <div class="flex items-center gap-2 mb-4"><span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-bold uppercase tracking-wider">Start here</span></div>
    <div class="text-2xl sm:text-3xl font-bold leading-tight mb-2">What's your ZIP code?</div>
    <div class="text-sm mb-6">We'll confirm you're in PVO's service area before collecting your information — no wasted time.</div>
    <input class="w-full text-center text-3xl sm:text-4xl font-bold tracking-widest" id="zip-in" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="5" placeholder="92064" autocomplete="postal-code" />
    <div class="text-center text-sm min-h-[1.5rem]" id="zip-fb"></div>
    <button class="large primary w-full inline-flex items-center justify-center gap-2 mt-5 invisible opacity-0 transition-opacity [&.show]:visible [&.show]:opacity-100" id="cont-btn" onclick="submitZip()">Check my area <span class="transition-transform">→</span></button>
  </div>`;
  const inp = document.getElementById('zip-in');
  inp.addEventListener('input',onZipInput);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')submitZip()});
  setTimeout(()=>inp.focus(),100);
}

function onZipInput(e){
  const val = e.target.value.replace(/\D/g,'').slice(0,5);
  e.target.value = val;
  const btn = document.getElementById('cont-btn');
  const fb = document.getElementById('zip-fb');
  e.target.removeAttribute('aria-invalid');
  fb.className = 'text-center text-sm min-h-[1.5rem]';
  fb.textContent = '';
  btn.classList.remove('show');
  if(val.length === 5){
    if(SERVED_ZIPS[val]){
            fb.className = 'text-center text-sm min-h-[1.5rem] overall-status success';
      fb.textContent = `✓ ${SERVED_ZIPS[val][0]} — PVO serves your area!`;
      btn.classList.add('show');
      zipLocation = SERVED_ZIPS[val][1];
    } else {
      e.target.setAttribute('aria-invalid','true');
      fb.className = 'text-center text-sm min-h-[1.5rem] overall-status error';
      fb.textContent = `ZIP ${val} is outside PVO's current service area.`;
      btn.classList.remove('show');
      // show wall after brief delay
      setTimeout(()=>showOutOfArea(val),600);
    }
  }
}

function submitZip(){
  const val = document.getElementById('zip-in').value;
  if(!SERVED_ZIPS[val]) return;
  answers['location'] = zipLocation;
  answers['user_zip'] = val;
  addChip('zip', val+' — '+SERVED_ZIPS[val][0]);
  addTimeSaved(45);
  advanceToFirst();
}

function showOutOfArea(zip){
  const stage = document.getElementById('stage');
  stage.innerHTML=`<div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 w-full text-center" id="q-card">
    <div class="w-16 h-16 rounded-full bg-neutral-700 mx-auto mb-4 flex items-center justify-center text-3xl">📍</div>
    <div class="text-2xl font-bold mb-2">Outside PVO's service area</div>
    <div class="text-sm max-w-sm mx-auto mb-8">ZIP code <strong>${zip}</strong> is outside the Poway–Ramona–North San Diego area PVO currently serves. But you're not out of options — here are trusted veterans orgs that cover your area:</div>
    <div class="grid gap-2 mb-7">
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center gap-3 text-left"><div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></div><div><div class="text-sm font-bold">DAV (Disabled American Veterans)</div><div class="text-xs text-neutral-400">Statewide — transportation, benefits, claims assistance</div></div></div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center gap-3 text-left"><div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></div><div><div class="text-sm font-bold">Veterans Village of San Diego</div><div class="text-xs text-neutral-400">4141 Pacific Hwy, San Diego — housing, services</div></div></div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center gap-3 text-left"><div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></div><div><div class="text-sm font-bold">211 San Diego</div><div class="text-xs text-neutral-400">Call 2-1-1 — connects you to local veterans resources</div></div></div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center gap-3 text-left"><div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></div><div><div class="text-sm font-bold">VA San Diego Healthcare System</div><div class="text-xs text-neutral-400">(858) 552-8585 — medical, mental health, housing</div></div></div>
    </div>
    <a class="large filledTinted primary w-full inline-flex items-center justify-center gap-2" href="https://powayveterans.org/request-assistance/" target="_blank">Apply to PVO anyway (they may still help) →</a>
    <button class="w-full mt-3 text-sm underline text-neutral-400 hover:text-neutral-50" onclick="restartFlow()">Try a different ZIP code</button>
  </div>`;
}

function advanceToFirst(){
  const card = document.getElementById('q-card');
  if(card) card.classList.add('exit');
  setTimeout(()=>{currentQ=0;render();},280);
}

function renderQuestion(idx){
  const q = QUESTIONS[idx];
  const stage = document.getElementById('stage');
  let body = '';

  if(q.type==='tiles'){
    const gc = q.cols===2?'sm:grid-cols-2':'grid-cols-1';
    body = `<div class="grid gap-2 mb-1 ${gc}">` +
      q.options.map(o=>`<button type="button" aria-pressed="false" class="group relative w-full flex items-center gap-3 p-4 text-left rounded-lg bg-neutral-900 border border-neutral-700 cursor-pointer transition hover:border-indigo-500 [&.selected]:border-indigo-500 [&.selected]:bg-neutral-700 tile" data-val="${o.v}" onclick="pickTile(this,'${q.id}','${String(o.v).replace(/'/g,"\\'")}')">`+
        `<span class="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 group-[.selected]:bg-neutral-600" aria-hidden="true">${o.icon}</span>`+
        `<span class="block flex-1 min-w-0"><span class="block font-bold leading-tight">${o.label}</span>${o.sub?`<span class="block text-xs text-neutral-400 mt-0.5">${o.sub}</span>`:''}</span>`+
        `<span class="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 opacity-0 scale-50 transition group-[.selected]:opacity-100 group-[.selected]:scale-100" aria-hidden="true"><svg class="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1,4 3.5,6.5 9,1"/></svg></span>`+
        `</button>`).join('')+
      `</div>`;
  } else {
    stepperVal = q.def;
    body = `<div class="flex items-center justify-center gap-4 my-2"><button class="secondary w-14 h-14 rounded-full text-2xl inline-flex items-center justify-center" onclick="stepChg(-1)">−</button><div class="text-5xl font-bold min-w-[6.5rem] text-center px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-700" id="sv">${q.def}</div><button class="secondary w-14 h-14 rounded-full text-2xl inline-flex items-center justify-center" onclick="stepChg(1)">+</button></div>
    <div class="text-sm text-neutral-400 text-center mt-1 mb-4">people in your household</div>`;
  }

  const isLast = idx === QUESTIONS.length-1;
  const btnLabel = isLast ? 'See my results' : 'Continue';
  const contShow = q.type==='stepper'?' show':'';

  stage.innerHTML = `<div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 w-full transition-all duration-300 [&.exit]:opacity-0 [&.exit]:-translate-y-4" id="q-card">
    <div class="flex items-center gap-2 mb-4"><span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-bold uppercase tracking-wider">${q.tag}</span></div>
    <div class="text-2xl sm:text-3xl font-bold leading-tight mb-2">${q.text}</div>
    ${q.sub?`<div class="text-sm mb-6">${q.sub}</div>`:''}
    ${body}
    <button type="button" class="large primary w-full inline-flex items-center justify-center gap-2 mt-5 invisible opacity-0 transition-opacity [&.show]:visible [&.show]:opacity-100${contShow}" id="cont-btn" onclick="advance()">${btnLabel} <span class="transition-transform">→</span></button>
  </div>`;
}

function pickTile(el, qId, val){
  document.querySelectorAll('.tile').forEach(t=>{t.classList.remove('selected');t.setAttribute('aria-pressed','false');});
  el.classList.add('selected');
  el.setAttribute('aria-pressed','true');
  const parsed = (val==='0'||val==='1') ? Number(val) : (isNaN(Number(val))?val:Number(val));
  answers[qId] = parsed;
  const btn = document.getElementById('cont-btn');
  if(btn) btn.classList.add('show');
  const q = QUESTIONS[currentQ];
  if(q.cols===1 || (q.options&&q.options.length<=2)){
    setTimeout(()=>advance(),360);
  }
}

function stepChg(d){
  const q = QUESTIONS[currentQ];
  stepperVal = Math.max(q.min,Math.min(q.max,stepperVal+d));
  document.getElementById('sv').textContent = stepperVal;
  answers[q.id] = stepperVal;
}

function advance(){
  const q = QUESTIONS[currentQ];
  if(q.type!=='stepper' && answers[q.id]===undefined) return;
  if(q.type==='stepper') answers[q.id]=stepperVal;

  // Add chip
  addChip(q.id, answers[q.id]);
  // Add time saved
  addTimeSaved(q.type==='stepper'?18:12);
  // Toast
  const toastIdx = Math.min(currentQ, TOASTS.length-1);
  showToast(TOASTS[toastIdx]);
  // Milestone at question 3 (halfway)
  if(currentQ===2) showMilestone('🏅','Halfway there!','Just 3 more quick questions.');
  if(currentQ===QUESTIONS.length-2) showMilestone('🎯','Almost done!','One last question.');

  const card = document.getElementById('q-card');
  if(card) card.classList.add('exit');
  setTimeout(()=>{
    currentQ++;
    if(currentQ>=QUESTIONS.length) showResult();
    else render();
  },280);
}

function showResult(liveResult = null){
  setApplicationHeader('Complete!','Your prescreener is complete. Review the best next step below.','Routing summary ready.');

  const res = liveResult || simulate(answers);
  livePrediction = liveResult;
  const isPVO = res.pvo_direct >= 0.5;
  if(isPVO && !liveResult) confetti();

  const pvoPct = Math.round(res.pvo_direct*100);
  const refPct = Math.round(res.refer_out*100);
  const confLabel = {high:'High confidence',medium:'Medium confidence',low:'Lower confidence'};

  const steps = isPVO
    ?[{t:'Gather proof of service',b:'DD-214 or military ID, plus documentation of your need (bill, lease, medical records).'},
      {t:'Submit the application',b:'Takes ~5 min at powayveterans.org — a PVO volunteer reviews it personally.'},
      {t:'Expect a callback',b:"PVO's review committee contacts you directly before the application goes to the board."}]
    :[{t:'Apply anyway — PVO will connect you',b:'Even referrals start here. PVO personally routes you to the right partner organization.'},
      {t:'Call or email PVO directly',b:'(858) 206-8854 · contact@powayveterans.org · Response within 1 business day.'},
      {t:'Know your partner network',b:'PVO works with DAV, STEP, Wounded Warrior Homes, WAVE Academy, and VA San Diego.'}];

  const stage = document.getElementById('stage');
  stage.innerHTML=`<div class="w-full">
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 text-center mb-4">
      <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-neutral-700 ${isPVO?'yes':'ref'}">${isPVO?'✓':'→'}</div>
      <div class="text-2xl font-bold mb-2 ${isPVO?'yes':'ref'}">${liveResult ? (isPVO?'PVO Can Help You Directly':'We\'ll Connect You to the Right Support') : (isPVO?'Demo estimate: PVO may help directly':'Demo estimate: partner support may fit best')}</div>
      <p class="text-sm max-w-md mx-auto">${liveResult ? (isPVO?'Based on your answers, PVO has directly assisted veterans in similar situations. Here\'s what to do next.':'Your need may be best served through a specialized partner — but PVO will personally make that connection for you.') : 'This example estimate runs in your browser until the live PVO service responds. Confirm eligibility directly with PVO.'}</p>
      <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-2 bg-neutral-700 ${res.confidence}">${confLabel[res.confidence]}</div>
    </div>
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 mb-4">
      <p id="live-api-status" role="status" aria-live="polite">${liveResult ? `Live model result saved as submission #${liveResult.submission_id}.` : 'Connecting to the live PVO eligibility service…'}</p>
      <div class="mb-3 last:mb-0">
        <div class="flex justify-between items-center mb-1"><span class="text-sm font-bold">PVO handles directly</span><span class="text-lg font-bold" id="p1">0%</span></div>
        <progress class="appearance-none w-full h-2 block rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-indigo-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-1000 [&::-moz-progress-bar]:bg-indigo-500 [&::-moz-progress-bar]:rounded-full" id="pb1" max="100" value="0" aria-label="PVO handles directly"></progress>
      </div>
      <div class="mb-3 last:mb-0">
        <div class="flex justify-between items-center mb-1"><span class="text-sm font-bold">Referred to partner org</span><span class="text-lg font-bold" id="p2">0%</span></div>
        <progress class="appearance-none w-full h-2 block rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-indigo-500 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-1000 [&::-moz-progress-bar]:bg-indigo-500 [&::-moz-progress-bar]:rounded-full" id="pb2" max="100" value="0" aria-label="Referred to partner org"></progress>
      </div>
    </div>
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 mb-4">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Your next steps</div>
      ${steps.map((s,i)=>`<div class="flex gap-3 items-start pb-3 mb-3 border-b border-neutral-700 last:border-0 last:pb-0 last:mb-0"><div class="w-7 h-7 rounded-lg bg-neutral-700 text-xs font-bold flex items-center justify-center shrink-0">${i+1}</div><div><div class="text-sm font-bold">${s.t}</div><div class="text-sm">${s.b}</div></div></div>`).join('')}
    </div>
    ${isPVO ? `<button class="large primary w-full inline-flex items-center justify-center gap-2 mb-3" onclick="startSmartApplication()">Start application →</button>` : ''}
    <button class="w-full mt-3 text-sm underline text-neutral-400 hover:text-neutral-50" onclick="restartFlow()">Start over with different answers</button>
  </div>`;

  document.getElementById('pb1').value = pvoPct;
  document.getElementById('p1').textContent=pvoPct+'%';
  document.getElementById('pb2').value = refPct;
  document.getElementById('p2').textContent=refPct+'%';

  if(!liveResult){
    fetch(`${VETERAN_API_BASE}/api/veteran/predict`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(answers)
    }).then(async response=>{
      const result = await response.json();
      if(!response.ok) throw new Error(result.detail || result.error || `Request failed (${response.status})`);
      if(!Number.isFinite(result.pvo_direct) || !Number.isFinite(result.refer_out) || !Number.isInteger(result.submission_id)){
        throw new Error('The API returned an unexpected prediction response.');
      }
      showResult(result);
    }).catch(error=>{
      const status = document.getElementById('live-api-status');
      if(status) status.textContent = `Live prediction unavailable: ${error.message}. The displayed demo estimate is not an eligibility decision; please confirm with PVO.`;
    });
  }
}

function startSmartApplication(){
  const res = livePrediction || simulate(answers);
  const payload = {
    ...answers,
    pvo_direct: res.pvo_direct,
    refer_out: res.refer_out,
    confidence: res.confidence,
    generated_at: new Date().toISOString(),
  };
  localStorage.setItem('pvo_prescreener_context_v1', JSON.stringify(payload));
  localStorage.removeItem('pvo_application_draft_v1');
  window.location.href = '/pvo-application-assist';
}

function renderSmartCapture(){
  const draft = ensureSmartDraft();
  setApplicationHeader('Build your PVO application','Upload one intake document, then review the fields before proof-of-service upload.','Capture with your camera or upload an image/PDF.');
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="w-full grid gap-4">
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700 text-left mb-4">
      <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Smart Application Builder</div>
      <div class="text-2xl font-bold mb-2">Start with one document we can learn from</div>
      <p class="text-sm m-0">There usually is not one document that fills every PVO field. The best combination is: an ID or address document for contact details, then DD-214 or military ID for proof of service.</p>
    </div>
    <div class="grid gap-3 md:grid-cols-3">
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Best for name + address</div>
        <div class="text-sm font-bold mb-1">Driver's license or state ID</div>
        <div class="text-sm">Usually gives the cleanest name and mailing address for the application draft.</div>
      </div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Best for branch clues</div>
        <div class="text-sm font-bold mb-1">VA letter or veteran ID</div>
        <div class="text-sm">Helpful when you want branch-of-service details to prefill before review.</div>
      </div>
      <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700">
        <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Required later</div>
        <div class="text-sm font-bold mb-1">DD-214 or military ID</div>
        <div class="text-sm">PVO asks for proof of service. You will upload that in the final step.</div>
      </div>
    </div>
    <div class="overall-status partial flex gap-3 items-start text-left">
      <div class="font-bold shrink-0">i</div>
      <div class="text-sm">Current version: the prescreener already pre-fills need-related answers. For contact details, upload a photo and paste any visible text from the document if you want the draft to pull more fields automatically before review.</div>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-3 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
        <div>
          <div class="font-bold mb-1">1. Capture a primary document</div>
          <div class="text-sm">Use your camera or upload a file with the applicant's name and address. If you can copy text from the document, paste it below for best autofill.</div>
        </div>
        <label class="block p-4 rounded-lg border border-dashed border-neutral-600 cursor-pointer hover:border-indigo-500">
          <input type="file" accept="image/*,.pdf" capture="environment" class="sr-only" onchange="handlePrimaryDoc(event)">
          <div class="font-bold mb-1">Upload or take a photo</div>
          <div class="text-sm">Accepted here for drafting: ID card, utility bill, VA letter, or similar intake document.</div>
        </label>
        <div class="text-xs text-neutral-400" id="primary-doc-name">${escapeHtml(draft.primaryDocName || 'No file selected yet')}</div>
        <div class="form-group">
          <label class="text-xs font-bold uppercase tracking-wider text-neutral-400" for="smart-ocr-text">Optional text from the document</label>
          <textarea id="smart-ocr-text" class="smallInput w-full min-h-[8rem]" placeholder="Paste any text you can copy from the photo or scanned document. We will use it to prefill name, address, phone, email, and branch when possible." oninput="handlePrimaryDocText(this.value)">${escapeHtml(draft.primaryDocText || '')}</textarea>
          <div class="text-xs text-neutral-400">This keeps the workflow reliable even before a full OCR service is connected.</div>
        </div>
      </div>
      <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
        <div class="font-bold mb-1">Document preview</div>
        <div class="text-sm mb-3">Preview is optional for PDFs. Image uploads show here immediately.</div>
        <div class="rounded-lg bg-neutral-900 border border-neutral-700 min-h-[14rem] flex items-center justify-center overflow-hidden" id="primary-doc-preview"></div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center gap-2" onclick="showResult()">Back to results</button>
      <button class="large primary w-full inline-flex items-center justify-center gap-2" onclick="prepareSmartReview()">Review extracted info →</button>
    </div>
  </div>`;
  updateUploadPreview('primary');
}

function prepareSmartReview(){
  const draft = ensureSmartDraft();
  const parsed = parseDocumentText(draft.primaryDocText || '');
  Object.entries(parsed).forEach(([key, value]) => {
    if(value && !draft[key]) draft[key] = value;
  });
  if(!draft.generalNeed) draft.generalNeed = mapGeneralNeed();
  if(!draft.specificNeed) draft.specificNeed = buildSpecificNeedSummary();
  renderSmartReview();
}

function renderSmartReview(){
  const draft = ensureSmartDraft();
  setApplicationHeader('Review your draft','Check every field before moving to proof of service.','Edit anything that looks off.');
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="w-full grid gap-4">
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="font-bold mb-1">2. Review the PVO draft</div>
      <div class="text-sm">These fields mirror the PVO assistance form. The prescreener has already filled the need-related sections; your document can help fill the rest.</div>
    </div>
    <div class="grid gap-x-4 md:grid-cols-2 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">First name</label>
        <input class="w-full" value="${escapeHtml(draft.firstName || '')}" oninput="syncDraftField('firstName', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Last name</label>
        <input class="w-full" value="${escapeHtml(draft.lastName || '')}" oninput="syncDraftField('lastName', this.value)">
      </div>
      <div class="form-group md:col-span-2">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Street address</label>
        <input class="w-full" value="${escapeHtml(draft.street || '')}" oninput="syncDraftField('street', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">City</label>
        <input class="w-full" value="${escapeHtml(draft.city || '')}" oninput="syncDraftField('city', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">State</label>
        <input class="w-full" value="${escapeHtml(draft.state || '')}" oninput="syncDraftField('state', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">ZIP code</label>
        <input class="w-full" value="${escapeHtml(draft.zip || '')}" oninput="syncDraftField('zip', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Home phone</label>
        <input class="w-full" value="${escapeHtml(draft.homePhone || '')}" oninput="syncDraftField('homePhone', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Cell phone</label>
        <input class="w-full" value="${escapeHtml(draft.cellPhone || '')}" oninput="syncDraftField('cellPhone', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</label>
        <input class="w-full" value="${escapeHtml(draft.email || '')}" oninput="syncDraftField('email', this.value)">
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Branch of service</label>
        <select class="w-full" onchange="syncDraftField('branch', this.value)">
          <option value="">Select branch</option>
          ${BRANCH_OPTIONS.map(option => `<option value="${option}" ${draft.branch===option?'selected':''}>${option}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">General need(s)</label>
        <select class="w-full" onchange="syncDraftField('generalNeed', this.value)">
          ${['Home repairs','Medical','Counseling','Legal','Transportation','Family','Meals/food','Veterans Administration Services','Other'].map(option => `<option value="${option}" ${draft.generalNeed===option?'selected':''}>${option}</option>`).join('')}
        </select>
      </div>
      <div class="form-group md:col-span-2">
        <label class="text-xs font-bold uppercase tracking-wider text-neutral-400">Specific need(s)</label>
        <textarea class="smallInput w-full min-h-[8rem]" oninput="syncDraftField('specificNeed', this.value)">${escapeHtml(draft.specificNeed || '')}</textarea>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center gap-2" onclick="renderSmartCapture()">Back to document step</button>
      <button class="large primary w-full inline-flex items-center justify-center gap-2" onclick="renderSmartProof()">Continue to proof of service →</button>
    </div>
  </div>`;
}

function renderSmartProof(){
  const draft = ensureSmartDraft();
  setApplicationHeader('Add proof of service','PVO asks for proof of military service with the request.','Upload DD-214, military ID, or another acceptable proof document.');
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="w-full grid gap-4">
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="font-bold mb-1">3. Add proof of service</div>
      <div class="text-sm">PVO lists DD-214 or a military ID as accepted examples. This step keeps that attachment paired with the draft before you open the live form.</div>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="grid gap-3 p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
        <label class="block p-4 rounded-lg border border-dashed border-neutral-600 cursor-pointer hover:border-indigo-500">
          <input type="file" accept="image/*,.pdf,.doc,.txt" capture="environment" class="sr-only" onchange="handleProofDoc(event)">
          <div class="font-bold mb-1">Upload proof of service</div>
          <div class="text-sm">Examples: DD-214, military ID, or another file that clearly proves service status.</div>
        </label>
        <div class="text-xs text-neutral-400" id="proof-doc-name">${escapeHtml(draft.proofDocName || 'No proof document selected yet')}</div>
        <div class="grid gap-2">
          <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex justify-between items-start gap-3 [&_strong]:block [&_strong]:text-sm [&_span]:block [&_span]:text-xs [&_span]:mt-1">
            <div><strong>Primary document</strong><span>${escapeHtml(draft.primaryDocName || 'Not uploaded yet')}</span></div>
            <div class="text-xs font-bold rounded-full px-2 py-0.5 mt-0 whitespace-nowrap ${draft.primaryDocName ? 'overall-status success' : 'overall-status error'}">${draft.primaryDocName ? 'Ready' : 'Missing'}</div>
          </div>
          <div class="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex justify-between items-start gap-3 [&_strong]:block [&_strong]:text-sm [&_span]:block [&_span]:text-xs [&_span]:mt-1">
            <div><strong>Proof of service</strong><span>${escapeHtml(draft.proofDocName || 'Upload required for a complete packet')}</span></div>
            <div class="text-xs font-bold rounded-full px-2 py-0.5 mt-0 whitespace-nowrap ${draft.proofDocName ? 'overall-status success' : 'overall-status error'}">${draft.proofDocName ? 'Ready' : 'Needed'}</div>
          </div>
        </div>
      </div>
      <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
        <div class="font-bold mb-1">Proof preview</div>
        <div class="text-sm mb-3">Image files preview here. PDFs and docs will still be tracked by file name.</div>
        <div class="rounded-lg bg-neutral-900 border border-neutral-700 min-h-[14rem] flex items-center justify-center overflow-hidden" id="proof-doc-preview"></div>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center gap-2" onclick="renderSmartReview()">Back to review</button>
      <button class="large primary w-full inline-flex items-center justify-center gap-2" onclick="renderSmartFinal()">Show submission-ready form →</button>
    </div>
  </div>`;
  updateUploadPreview('proof');
}

function renderSmartFinal(){
  const draft = ensureSmartDraft();
  setApplicationHeader('Submission-ready preview','This is the PVO packet as currently prepared. Review any missing items before opening the live form.','Ready to transfer into the official PVO assistance form.');
  const missing = getMissingSmartFields();
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="w-full grid gap-4">
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="font-bold mb-1">4. Submission-ready PVO preview</div>
      <div class="text-sm">This mirrors the live PVO assistance form at <code>powayveterans.org/request-assistance/</code> and shows what is already prepared.</div>
    </div>
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="grid gap-3">
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(`${draft.firstName} ${draft.lastName}`.trim())}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Address</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue([draft.street,draft.city,draft.state,draft.zip].filter(Boolean).join(', '))}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Home phone</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.homePhone)}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Cell phone</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.cellPhone)}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.email)}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Branch of service</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.branch)}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">General need(s)</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.generalNeed)}</div></div>
        <div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-3 border-b border-neutral-700 last:border-0 last:pb-0"><div class="text-xs font-bold uppercase tracking-wider text-neutral-400">Specific need(s)</div><div class="text-sm sm:text-right sm:max-w-[60%]">${getPreviewValue(draft.specificNeed)}</div></div>
      </div>
    </div>
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="font-bold mb-1">Attached files</div>
      <div class="flex flex-wrap gap-2">
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs">Primary intake: ${escapeHtml(draft.primaryDocName || 'Not added yet')}</span>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs">Proof of service: ${escapeHtml(draft.proofDocName || 'Not added yet')}</span>
      </div>
    </div>
    <div class="p-4 sm:p-6 rounded-lg bg-neutral-800 border border-neutral-700">
      <div class="font-bold mb-1">Readiness check</div>
      ${missing.length ? `<div class="grid gap-1 text-sm">${missing.map(item => `<div>• ${item}</div>`).join('')}</div>` : `<div class="overall-status partial flex gap-3 items-start text-left"><div class="font-bold shrink-0">✓</div><div class="text-sm">All major PVO fields in this draft are filled. Final step is transferring this packet into the live PVO form for submission.</div></div>`}
    </div>
    <div class="flex flex-col sm:flex-row flex-wrap gap-3">
      <button class="large secondary inline-flex items-center justify-center gap-2" onclick="renderSmartProof()">Back to proof step</button>
      <button class="large secondary inline-flex items-center justify-center gap-2" onclick="renderSmartReview()">Edit draft fields</button>
      <a class="large filledTinted primary w-full inline-flex items-center justify-center gap-2" href="https://powayveterans.org/request-assistance/" target="_blank">Open live PVO form →</a>
    </div>
  </div>`;
}

function simulate(a){
  const direct=['rent','utility','food','transport','home_repair','vehicle_reg','medical','storage','moving'];
  const refer=['counseling','legal','mental_health'];
  const inArea=['poway','ramona','escondido','vista','santee','san_marcos','spring_valley','mira_mesa','carlsbad','imperial_beach','pacific_beach','chula_vista','fallbrook','san_diego'];
  let s=0.5;
  if(direct.includes(a.need_type))s+=0.22;
  if(refer.includes(a.need_type))s-=0.30;
  if(inArea.includes(a.location))s+=0.18;
  if(a.location==='outside_area')s-=0.28;
  if(a.employment==='disabled')s+=0.08;
  if(a.housing_risk)s+=0.05;
  s=Math.max(0.06,Math.min(0.94,s));
  return{pvo_direct:parseFloat(s.toFixed(4)),refer_out:parseFloat((1-s).toFixed(4)),confidence:s>0.75?'high':s>0.58?'medium':'low'};
}

function restartFlow(){
  Object.keys(answers).forEach(k=>delete answers[k]);
  currentQ=-1; stepperVal=1; zipLocation=null; savedSeconds=0; smartDraft=null;
  document.getElementById('summary-bar').innerHTML='';
  const ts=document.getElementById('time-saved');ts.classList.add('hidden');
  render();
}

initProgressDots();
render();
</script>
