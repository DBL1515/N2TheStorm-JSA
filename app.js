// N2TheStorm JSA App - Enhanced
// Client-side only — data stored in localStorage

const STORAGE_KEY = 'n2thestorm_jsas';
const LOTO_KEY = 'n2thestorm_loto';
const JOURNEY_KEY = 'n2thestorm_journey';
const TRAILER_KEY = 'n2thestorm_trailer';

// Hazard library with default risk and controls
const HAZARDS = [
  { id: 'lifting', name: 'Lifting & Manual Material Handling', defaultRisk: 'High', hazards: 'Back strain, spinal disc compression, shoulder/muscle tears from heavy, awkward, or repetitive lifting.', controls: 'Use mechanical lifting aids (cranes, hoists, forklifts, rigging) whenever loads exceed 50 lbs. Keep loads close to the body, lift with the legs, and use multi-person team lifts for long or awkward items.' },
  { id: 'fall', name: 'Fall Potential (Work at Height & Slip/Trip/Fall)', defaultRisk: 'High', hazards: 'Catastrophic falls from elevated platforms, ladders, or scaffold decks; slipping on oil/slick surfaces; tripping over hoses, cables, and debris.', controls: '100% tie-off using a full-body harness and shock-absorbing lanyard when working above 6 feet. Inspect 3-point contact on ladders. Keep walkways clear of tools, cables, and fluid spills.' },
  { id: 'electrical', name: 'Electrical Shock & Arc Flash', defaultRisk: 'High', hazards: 'Contact with energized circuits, capacitive discharge, improper grounding, static electricity, or arc flash/blast.', controls: 'Apply Lockout/Tagout (LOTO) and perform zero-energy verification (Test-Before-Touch) using a calibrated meter. Use voltage-rated insulated hand tools, NFPA 70E rated Arc Flash PPE, GFCI protection on temporary power, and proper earth grounding/bonding.' },
  { id: 'chemical', name: 'Skin Irritants & Chemical Exposure', defaultRisk: 'Medium', hazards: 'Chemical burns, contact dermatitis, systemic toxicity, or absorption through the skin from acids, biocides, solvents, or petroleum products.', controls: 'Review the Safety Data Sheet (SDS) before handling. Wear chemical-resistant gloves (nitrile, neoprene, or butyl), face shields, aprons, or Tyvek suits. Stage operating safety showers and eyewash stations within 10 seconds of the work area.' },
  { id: 'confined', name: 'Confined Spaces', defaultRisk: 'High', hazards: 'Oxygen-deficient or oxygen-enriched atmospheres, toxic gas accumulation (H2S, CO), flammable vapor concentration, or physical engulfment inside tanks, vessels, or pits.', controls: 'Issue a Confined Space Entry Permit. Conduct continuous atmospheric gas monitoring at top, middle, and bottom levels. Establish forced-air mechanical ventilation and assign a dedicated, trained Confined Space Attendant outside the portal.' },
  { id: 'overhead', name: 'Elevated Loads & Overhead Work', defaultRisk: 'High', hazards: 'Rigging failure, dropped objects, or shifting loads striking personnel working beneath elevated equipment or crane booms.', controls: 'Establish clear Red Zone barricades and drop-zone signage beneath overhead work. Never position any part of the body under a suspended load. Use taglines to guide loads from a safe distance. Inspect all slings, shackles, and rigging before use.' },
  { id: 'sse', name: 'Short Service Employees (SSE)', defaultRisk: 'Medium', hazards: 'Lack of site-specific familiarity, unfamiliarity with emergency procedures, unrecognized hazards, or reluctance to ask questions due to inexperience (< 6 months on site/role).', controls: 'Visually identify SSE personnel (e.g., green hard hat or SSE sticker). Assign an experienced mentor to work alongside the SSE directly. Conduct a pre-job safety brief ensuring the SSE understands their specific role, Stop Work Authority (SWA), and evacuation routes.' },
  { id: 'energy', name: 'Potential Release of Energy (Stored Energy / Line Breaking)', defaultRisk: 'High', hazards: 'Sudden release of hydraulic, pneumatic, mechanical spring tension, chemical pressure, or thermal energy during equipment teardown.', controls: 'Apply LOTO to energy isolation points. Bleed down trapped line pressure, vent trapped gases to zero PSI, block/pin mechanical components, and verify zero energy before cracking flanges or opening lines.' },
  { id: 'fire', name: 'Fire & Explosion Potential', defaultRisk: 'High', hazards: 'Ignition of flammable vapors, gases, or combustible dust by hot work, non-rated electrical equipment, static discharge, or internal combustion engines.', controls: 'Issue a Hot Work Permit. Conduct continuous LEL gas monitoring. Maintain a 35-foot fire-safe radius cleared of combustibles with a dedicated Fire Watch present during and 30 minutes post-work. Use explosion-proof/intrinsically safe tools and establish ground/bond connections on fluid lines.' },
  { id: 'noise', name: 'High Noise Levels', defaultRisk: 'Medium', hazards: 'Noise-induced hearing loss (NIHL), tinnitus, or inability to hear critical safety alarms and verbal communications near high-horsepower machinery.', controls: 'Enforce single hearing protection (earplugs or earmuffs) above 85 dBA. Require double hearing protection (earplugs PLUS earmuffs) in high-noise zones exceeding 100 dBA. Use visual signaling or radio headsets.' },
  { id: 'pinch', name: 'Pinch, Crush, or Striking Hazards', defaultRisk: 'High', hazards: 'Hands, arms, or body getting caught in moving gears, rotating shafts, closing valves, heavy iron connections, or maneuvering machinery.', controls: 'Keep all factory guards, interlocks, and covers in place. Maintain a "Hands-Off" policy using push-sticks, taglines, or placement tools when handling iron, pipe, or rigging. Identify pinch points during pre-job walk-throughs.' },
  { id: 'sharp', name: 'Sharp Edges or Hot/Cold Surfaces', defaultRisk: 'Medium', hazards: 'Lacerations from sheet metal/cables/wire rope; severe thermal burns or frostbite from hot exhaust lines, steam lines, or cryogenic liquid/refrigerant lines.', controls: 'Wear cut-resistant gloves (ANSI Level A4 or higher) when handling wire rope or sheet metal. Install insulation covers or physical guards over hot exhaust manifolds and pipes. Wear thermal-insulated work gloves when handling extreme temperature components.' },
  { id: 'human', name: 'Participant Hazards (Human Factors / Ergonomics)', defaultRisk: 'Medium', hazards: 'Fatigue, heat stress, hypothermia, distraction, complacency, dehydration, or rushing, leading to impaired judgment and elevated error rates.', controls: 'Mandate work-rest rotations and enforce maximum shift-length guidelines. Provide climate-controlled break areas, hydration stations (water/electrolytes), and cold-weather gear. Empower all team members with Stop Work Authority (SWA) if fatigue or distraction is observed.' },
  { id: 'gen-gas', name: 'Hazardous Gas Leakage (Generator)', defaultRisk: 'High', hazards: 'Residual or leaking natural gas accumulating in the generator enclosure during maintenance, creating a fire or explosion hazard.', controls: 'Perform multi-gas monitor bump check and continuously monitor for LEL. Isolate and lock out main fuel supply valve. Depressurize and vent trapped natural gas to a safe outdoor area before servicing.' },
  { id: 'gen-crank', name: 'Accidental Engine Crank & High-Voltage Backfeed', defaultRisk: 'High', hazards: 'Generator automatically starting via remote signal during mechanical service, or voltage backfeeding.', controls: 'Switch engine controller to OFF/MANUAL and engage E-Stop. Disconnect negative battery cable. Apply LOTO to main output breaker and fuel shutoff. Verify zero voltage and zero fuel pressure.' },
  { id: 'gen-thermal', name: 'Thermal Burns & Pressurized Hot Coolant', defaultRisk: 'High', hazards: 'Contact with hot exhaust manifolds, turbochargers, or scalding coolant under pressure.', controls: 'Allow engine to cool below 120°F before loosening caps. Wear thermal-resistant gloves, safety glasses, and face shield. Use pressure relief tool or slowly release residual pressure.' },
  { id: 'gen-oil', name: 'High-Pressure Oil / Fuel Injection & Fluid Spills', defaultRisk: 'High', hazards: 'High-pressure lines spraying fluids onto hot surfaces or causing skin injection injuries; environmental contamination.', controls: 'Wrap fittings with shop rags when cracking connections. Position containment basins under drains. Keep oil-spill kit staged adjacent to the generator.' },
  { id: 'gen-entangle', name: 'Mechanical Entanglement with Rotating Parts', defaultRisk: 'High', hazards: 'Hands, loose clothing, or hair getting caught in belts, fans, or driveshafts.', controls: 'Verify all guards and covers are reinstalled before clearing LOTO. Tuck in clothing, remove jewelry, secure hair. Maintain safe distance from rotating assemblies during live checks.' }
];

let currentJsaId = null;
let selectedHazards = []; // array of hazard objects with residual risk
let participants = [];
let trailerItems = [];

// DOM refs
const listView = document.getElementById('listView');
const formView = document.getElementById('formView');
const previewView = document.getElementById('previewView');
const lotoView = document.getElementById('lotoView');
const journeyView = document.getElementById('journeyView');
const trailerView = document.getElementById('trailerView');
const feedbackView = document.getElementById('feedbackView');
const jsaList = document.getElementById('jsaList');
const form = document.getElementById('jsaForm');

document.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  renderHazardCheckboxes();
  renderList();
  renderLotoList();
  renderJourneyList();
  setupEventListeners();
  registerServiceWorker();
  addParticipant(); // start with one
});

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  const jobDate = document.getElementById('jobDate');
  const signDate = document.getElementById('signDate');
  if (jobDate) jobDate.value = today;
  if (signDate) signDate.value = today;
}

function setupEventListeners() {
  document.getElementById('newJsaBtn').onclick = startNew;
  document.getElementById('startNewBtn').onclick = startNew;
  document.getElementById('savedBtn').onclick = () => showView('list');
  document.getElementById('saveDraftBtn').onclick = saveDraft;
  document.getElementById('previewBtn').onclick = showPreview;
  document.getElementById('printBtn').onclick = () => window.print();
  document.getElementById('backToFormBtn').onclick = () => showView('form');
  document.getElementById('forceUpdateBtn').onclick = forceUpdate;
  form.onsubmit = (e) => { e.preventDefault(); completeAndExport(); };

  // Feedback form
  document.getElementById('feedbackForm').onsubmit = (e) => {
    e.preventDefault();
    sendFeedback();
  };
  document.getElementById('feedbackAgainBtn').onclick = () => {
    document.getElementById('feedbackForm').classList.remove('hidden');
    document.getElementById('feedbackThanks').classList.add('hidden');
    document.getElementById('feedbackForm').reset();
  };

  document.getElementById('addParticipantBtn').onclick = () => addParticipant();
  document.getElementById('getLocationBtn').onclick = getLocation;
  document.getElementById('findHospitalBtn').onclick = findHospital;
  document.getElementById('saveLotoBtn').onclick = saveLoto;
  document.getElementById('saveJourneyBtn').onclick = saveJourney;
  document.getElementById('addTrailerItemBtn').onclick = addTrailerItem;
  document.getElementById('saveTrailerBtn').onclick = saveTrailer;

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showView(btn.dataset.view);
    };
  });
}

function showView(view) {
  [listView, formView, previewView, lotoView, journeyView, trailerView, feedbackView].forEach(v => v && v.classList.add('hidden'));
  if (view === 'list') listView.classList.remove('hidden');
  if (view === 'form') formView.classList.remove('hidden');
  if (view === 'preview') previewView.classList.remove('hidden');
  if (view === 'loto') lotoView.classList.remove('hidden');
  if (view === 'journey') journeyView.classList.remove('hidden');
  if (view === 'trailer') trailerView.classList.remove('hidden');
  if (view === 'feedback') feedbackView.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function startNew() {
  currentJsaId = null;
  form.reset();
  setDefaultDates();
  selectedHazards = [];
  participants = [];
  participantsContainer.innerHTML = '';
  addParticipant();
  document.getElementById('selectedHazardsContainer').innerHTML = '';
  document.querySelectorAll('#hazardCheckboxes input').forEach(cb => cb.checked = false);
  showView('form');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-view="form"]').classList.add('active');
}

function renderHazardCheckboxes() {
  const container = document.getElementById('hazardCheckboxes');
  container.innerHTML = HAZARDS.map(h => `
    <label class="hazard-item">
      <input type="checkbox" value="${h.id}" onchange="toggleHazard('${h.id}')">
      ${h.name}
    </label>
  `).join('');
}

function toggleHazard(id) {
  const haz = HAZARDS.find(h => h.id === id);
  const checked = document.querySelector(`#hazardCheckboxes input[value="${id}"]`).checked;
  if (checked) {
    if (!selectedHazards.find(s => s.id === id)) {
      selectedHazards.push({ ...haz, residualRisk: haz.defaultRisk });
    }
  } else {
    selectedHazards = selectedHazards.filter(s => s.id !== id);
  }
  renderSelectedHazards();
}

function renderSelectedHazards() {
  const container = document.getElementById('selectedHazardsContainer');
  container.innerHTML = selectedHazards.map((h, i) => `
    <div class="hazard-card">
      <h4>${h.name} <span class="risk-badge risk-${h.defaultRisk.toLowerCase()}">Initial: ${h.defaultRisk}</span></h4>
      <p><strong>Hazards:</strong> ${h.hazards}</p>
      <p><strong>Controls:</strong> ${h.controls}</p>
      <div class="field">
        <label>Residual Risk After Controls</label>
        <div class="risk-select">
          <label><input type="radio" name="residual_${h.id}" value="Low" ${h.residualRisk==='Low'?'checked':''} onchange="updateResidual('${h.id}','Low')"> Low</label>
          <label><input type="radio" name="residual_${h.id}" value="Medium" ${h.residualRisk==='Medium'?'checked':''} onchange="updateResidual('${h.id}','Medium')"> Medium</label>
          <label><input type="radio" name="residual_${h.id}" value="High" ${h.residualRisk==='High'?'checked':''} onchange="updateResidual('${h.id}','High')"> High</label>
        </div>
      </div>
    </div>
  `).join('');
}

function updateResidual(id, risk) {
  const h = selectedHazards.find(s => s.id === id);
  if (h) h.residualRisk = risk;
}

function addParticipant(name = '', role = '') {
  const id = Date.now() + Math.random();
  participants.push({ id, name, role });
  const div = document.createElement('div');
  div.className = 'participant-row field-row';
  div.innerHTML = `
    <input type="text" placeholder="Name" value="${name}" data-id="${id}" data-field="name">
    <input type="text" placeholder="Role / Company" value="${role}" data-id="${id}" data-field="role">
    <button type="button" class="btn small secondary" onclick="removeParticipant('${id}')">✕</button>
  `;
  document.getElementById('participantsContainer').appendChild(div);
  div.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', updateParticipants);
  });
}

function updateParticipants() {
  participants = Array.from(document.querySelectorAll('.participant-row')).map(row => ({
    id: row.querySelector('input').dataset.id,
    name: row.querySelector('[data-field="name"]').value,
    role: row.querySelector('[data-field="role"]').value
  })).filter(p => p.name.trim());
}

function removeParticipant(id) {
  document.querySelector(`.participant-row input[data-id="${id}"]`).closest('.participant-row').remove();
  updateParticipants();
}

function getLocation() {
  const status = document.getElementById('locationStatus');
  status.textContent = 'Getting location...';
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation not supported by this browser.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      document.getElementById('latitude').value = pos.coords.latitude.toFixed(6);
      document.getElementById('longitude').value = pos.coords.longitude.toFixed(6);
      status.textContent = 'Location captured.';
    },
    err => { status.textContent = 'Location error: ' + err.message; },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function findHospital() {
  const lat = document.getElementById('latitude').value;
  const lon = document.getElementById('longitude').value;
  if (!lat || !lon) {
    alert('Get location first.');
    return;
  }
  // Open Google Maps search for nearest hospital
  const url = `https://www.google.com/maps/search/hospital/@${lat},${lon},15z`;
  window.open(url, '_blank');
  document.getElementById('nearestHospital').placeholder = 'Search opened in Maps — enter hospital name here';
}

function getFormData() {
  updateParticipants();
  const ppeChecked = Array.from(document.querySelectorAll('#ppeGrid input:checked')).map(el => el.value);
  const otherPpe = document.getElementById('otherPpe').value.trim();
  if (otherPpe) ppeChecked.push(otherPpe);

  return {
    id: currentJsaId || Date.now().toString(),
    jobName: document.getElementById('jobName').value.trim(),
    location: document.getElementById('location').value.trim(),
    jobDate: document.getElementById('jobDate').value,
    preparedBy: document.getElementById('preparedBy').value.trim(),
    supervisor: document.getElementById('supervisor').value.trim(),
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    nearestHospital: document.getElementById('nearestHospital').value.trim(),
    participants: [...participants],
    ppe: ppeChecked,
    hazards: selectedHazards.map(h => ({ id: h.id, name: h.name, residualRisk: h.residualRisk })),
    notes: document.getElementById('notes').value.trim(),
    workerSign: document.getElementById('workerSign').value.trim(),
    signDate: document.getElementById('signDate').value,
    createdAt: new Date().toISOString(),
    status: 'draft'
  };
}

function saveDraft() {
  const data = getFormData();
  if (!data.jobName) { alert('Please enter a Job / Task Name before saving.'); return; }
  const all = getAllJsas();
  const idx = all.findIndex(j => j.id === data.id);
  if (idx >= 0) all[idx] = data; else all.unshift(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  currentJsaId = data.id;
  alert('Draft saved!');
  renderList();
}

function completeAndExport() {
  const data = getFormData();
  if (!data.jobName || !data.preparedBy) {
    alert('Please complete Job Name and Prepared By.');
    return;
  }
  data.status = 'Complete';
  const all = getAllJsas();
  const idx = all.findIndex(j => j.id === data.id);
  if (idx >= 0) all[idx] = data; else all.unshift(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  currentJsaId = data.id;
  renderList();          // <-- refresh the list so completed JSAs appear
  showPreview();
}

function showPreview() {
  const data = getFormData();
  if (!data.jobName) { alert('Please enter a Job / Task Name.'); return; }
  renderReport(data);
  showView('preview');
}

function renderReport(data) {
  const ppeHtml = data.ppe.length ? data.ppe.map(p => `<span class="ppe-badge">${escapeHtml(p)}</span>`).join('') : '<em>None</em>';
  const partHtml = data.participants.length ? data.participants.map(p => `${escapeHtml(p.name)} (${escapeHtml(p.role||'—')})`).join('<br>') : '—';
  const hazHtml = data.hazards.map(h => {
    const full = HAZARDS.find(x => x.id === h.id) || {};
    return `<tr>
      <td>${escapeHtml(h.name)}</td>
      <td class="risk-${(full.defaultRisk||'').toLowerCase()}">${full.defaultRisk||'—'}</td>
      <td>${escapeHtml(full.controls||'')}</td>
      <td class="risk-${(h.residualRisk||'').toLowerCase()}">${h.residualRisk||'—'}</td>
    </tr>`;
  }).join('');

  document.getElementById('reportContent').innerHTML = `
    <div class="report-header">
      <div class="company">N2THESTORM / INTO THE STORM SERVICES</div>
      <h1>JOB SAFETY ANALYSIS</h1>
      <p>Status: <strong>${data.status || 'Draft'}</strong> • Generated ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="report-meta">
      <div><strong>Job / Task</strong>${escapeHtml(data.jobName)}</div>
      <div><strong>Location</strong>${escapeHtml(data.location)||'—'}</div>
      <div><strong>Date</strong>${data.jobDate||'—'}</div>
      <div><strong>Prepared By</strong>${escapeHtml(data.preparedBy)}</div>
      <div><strong>Supervisor</strong>${escapeHtml(data.supervisor)||'—'}</div>
      <div><strong>GPS</strong>${data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : '—'}</div>
      <div><strong>Nearest Hospital</strong>${escapeHtml(data.nearestHospital)||'—'}</div>
    </div>
    <h3>Participants</h3>
    <p>${partHtml}</p>
    <h3>PPE</h3>
    <div class="ppe-list">${ppeHtml}</div>
    <h3>Hazards & Controls</h3>
    <table class="steps-table">
      <thead><tr><th>Hazard</th><th>Initial Risk</th><th>Controls</th><th>Residual Risk</th></tr></thead>
      <tbody>${hazHtml || '<tr><td colspan="4">None selected</td></tr>'}</tbody>
    </table>
    <h3>Notes</h3>
    <p>${escapeHtml(data.notes)||'—'}</p>
    <div class="signature-block">
      <p><strong>Worker Signature:</strong> ${escapeHtml(data.workerSign)||'—'}</p>
      <p><strong>Date Signed:</strong> ${data.signDate||'—'}</p>
    </div>
  `;
}

function getAllJsas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function renderList() {
  const all = getAllJsas();
  jsaList.innerHTML = all.length ? all.map(j => `
    <div class="jsa-card" onclick="loadJsa('${j.id}')">
      <h4>${escapeHtml(j.jobName)}</h4>
      <div class="meta">
        <span>${j.jobDate || ''}</span>
        <span class="status-badge status-${(j.status||'draft').toLowerCase()}">${j.status || 'Draft'}</span>
      </div>
    </div>
  `).join('') : '<p>No saved JSAs yet.</p>';
}

function loadJsa(id) {
  const all = getAllJsas();
  const j = all.find(x => x.id === id);
  if (!j) return;
  currentJsaId = id;
  document.getElementById('jobName').value = j.jobName || '';
  document.getElementById('location').value = j.location || '';
  document.getElementById('jobDate').value = j.jobDate || '';
  document.getElementById('preparedBy').value = j.preparedBy || '';
  document.getElementById('supervisor').value = j.supervisor || '';
  document.getElementById('latitude').value = j.latitude || '';
  document.getElementById('longitude').value = j.longitude || '';
  document.getElementById('nearestHospital').value = j.nearestHospital || '';
  document.getElementById('notes').value = j.notes || '';
  document.getElementById('workerSign').value = j.workerSign || '';
  document.getElementById('signDate').value = j.signDate || '';

  // Participants
  document.getElementById('participantsContainer').innerHTML = '';
  participants = [];
  (j.participants || []).forEach(p => addParticipant(p.name, p.role));
  if (!j.participants || !j.participants.length) addParticipant();

  // Hazards
  selectedHazards = [];
  document.querySelectorAll('#hazardCheckboxes input').forEach(cb => cb.checked = false);
  (j.hazards || []).forEach(h => {
    const full = HAZARDS.find(x => x.id === h.id);
    if (full) {
      selectedHazards.push({ ...full, residualRisk: h.residualRisk || full.defaultRisk });
      const cb = document.querySelector(`#hazardCheckboxes input[value="${h.id}"]`);
      if (cb) cb.checked = true;
    }
  });
  renderSelectedHazards();

  // PPE
  document.querySelectorAll('#ppeGrid input').forEach(cb => cb.checked = false);
  (j.ppe || []).forEach(p => {
    const cb = Array.from(document.querySelectorAll('#ppeGrid input')).find(x => x.value === p);
    if (cb) cb.checked = true;
  });

  showView('form');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-view="form"]').classList.add('active');
}

// LOTO
function saveLoto() {
  const rec = {
    id: Date.now().toString(),
    equipment: document.getElementById('lotoEquipment').value,
    personnel: document.getElementById('lotoPersonnel').value,
    applied: document.getElementById('lotoApplied').value,
    removed: document.getElementById('lotoRemoved').value,
    serials: document.getElementById('lotoSerials').value,
    handover: document.getElementById('lotoHandover').value,
    savedAt: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  all.unshift(rec);
  localStorage.setItem(LOTO_KEY, JSON.stringify(all));
  document.getElementById('lotoForm').reset();
  renderLotoList();
  alert('LOTO record saved.');
}

function renderLotoList() {
  const all = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  document.getElementById('lotoList').innerHTML = all.length ? '<h3>Saved LOTO Records</h3>' + all.map(r => `
    <div class="jsa-card"><strong>${escapeHtml(r.equipment||'Untitled')}</strong><br>
    Applied: ${r.applied||'—'} | Removed: ${r.removed||'—'}<br>
    <small>${new Date(r.savedAt).toLocaleString()}</small></div>
  `).join('') : '';
}

// Journey
function saveJourney() {
  const rec = {
    id: Date.now().toString(),
    driver: document.getElementById('journeyDriver').value,
    passengers: document.getElementById('journeyPassengers').value,
    vehicle: document.getElementById('journeyVehicle').value,
    plate: document.getElementById('journeyPlate').value,
    depart: document.getElementById('journeyDepart').value,
    dest: document.getElementById('journeyDest').value,
    savedAt: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');
  all.unshift(rec);
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(all));
  document.getElementById('journeyForm').reset();
  renderJourneyList();
  alert('Journey plan saved.');
}

function renderJourneyList() {
  const all = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');
  document.getElementById('journeyList').innerHTML = all.length ? '<h3>Saved Journeys</h3>' + all.map(r => `
    <div class="jsa-card"><strong>${escapeHtml(r.driver||'Untitled')} → ${escapeHtml(r.dest||'')}</strong><br>
    <small>${new Date(r.savedAt).toLocaleString()}</small></div>
  `).join('') : '';
}

// Trailer
function addTrailerItem() {
  const id = Date.now();
  trailerItems.push({ id, name: '', weight: 0, length: 0, width: 0, height: 0 });
  renderTrailerItems();
}

function renderTrailerItems() {
  const c = document.getElementById('trailerItemsContainer');
  c.innerHTML = trailerItems.map((item, i) => `
    <div class="trailer-item field-row" data-id="${item.id}">
      <input type="text" placeholder="Item name" value="${item.name}" data-field="name">
      <input type="number" placeholder="Weight (lbs)" value="${item.weight||''}" data-field="weight" step="1">
      <input type="number" placeholder="L (ft)" value="${item.length||''}" data-field="length" step="0.1">
      <input type="number" placeholder="W" value="${item.width||''}" data-field="width" step="0.1">
      <input type="number" placeholder="H" value="${item.height||''}" data-field="height" step="0.1">
      <button type="button" class="btn small secondary" onclick="removeTrailerItem('${item.id}')">✕</button>
    </div>
  `).join('');
  c.querySelectorAll('input').forEach(inp => inp.addEventListener('input', updateTrailerSummary));
  updateTrailerSummary();
}

function removeTrailerItem(id) {
  trailerItems = trailerItems.filter(i => i.id != id);
  renderTrailerItems();
}

function updateTrailerSummary() {
  // Collect current values
  document.querySelectorAll('.trailer-item').forEach(row => {
    const id = row.dataset.id;
    const item = trailerItems.find(i => i.id == id);
    if (item) {
      item.name = row.querySelector('[data-field="name"]').value;
      item.weight = parseFloat(row.querySelector('[data-field="weight"]').value) || 0;
      item.length = parseFloat(row.querySelector('[data-field="length"]').value) || 0;
      item.width = parseFloat(row.querySelector('[data-field="width"]').value) || 0;
      item.height = parseFloat(row.querySelector('[data-field="height"]').value) || 0;
    }
  });
  const totalWeight = trailerItems.reduce((s, i) => s + i.weight, 0);
  const maxW = parseFloat(document.getElementById('trailerMaxWeight').value) || 0;
  const over = maxW > 0 && totalWeight > maxW;
  document.getElementById('trailerSummary').innerHTML = `
    <strong>Total Weight:</strong> ${totalWeight} lbs ${maxW ? `/ Max ${maxW} lbs` : ''}<br>
    ${over ? '<span style="color:#dc2626;font-weight:700;">⚠ OVERLOADED — exceeds trailer capacity</span>' : '<span style="color:#16a34a;">Within capacity</span>'}
  `;
}

function saveTrailer() {
  updateTrailerSummary();
  const rec = {
    id: Date.now().toString(),
    maxWeight: document.getElementById('trailerMaxWeight').value,
    maxLength: document.getElementById('trailerMaxLength').value,
    maxWidth: document.getElementById('trailerMaxWidth').value,
    maxHeight: document.getElementById('trailerMaxHeight').value,
    items: [...trailerItems],
    savedAt: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem(TRAILER_KEY) || '[]');
  all.unshift(rec);
  localStorage.setItem(TRAILER_KEY, JSON.stringify(all));
  alert('Trailer load plan saved.');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[m]));
}

function sendFeedback() {
  const name = document.getElementById('feedbackName').value.trim() || 'Anonymous';
  const type = document.getElementById('feedbackType').value;
  const message = document.getElementById('feedbackMessage').value.trim();
  if (!message) {
    alert('Please enter your feedback.');
    return;
  }

  const subject = encodeURIComponent(`JSA App Feedback: ${type}`);
  const body = encodeURIComponent(
    `Feedback Type: ${type}\n` +
    `From: ${name}\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    `Message:\n${message}\n\n` +
    `---\nSent from N2TheStorm JSA App`
  );

  const mailto = `mailto:Dave@n2thestorm.com?subject=${subject}&body=${body}`;
  window.location.href = mailto;

  // Show thank you
  document.getElementById('feedbackForm').classList.add('hidden');
  document.getElementById('feedbackThanks').classList.remove('hidden');

  // Optional: store locally
  try {
    const all = JSON.parse(localStorage.getItem('n2thestorm_feedback') || '[]');
    all.unshift({ name, type, message, date: new Date().toISOString() });
    localStorage.setItem('n2thestorm_feedback', JSON.stringify(all.slice(0, 50)));
  } catch (e) {}
}

function forceUpdate() {
  if (!confirm('Force update the app? This will clear the cache and reload the latest version.')) return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => reg.unregister());
    }).then(() => {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
        .then(() => location.reload(true));
    });
  } else {
    location.reload(true);
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}
