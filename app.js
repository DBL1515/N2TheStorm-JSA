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
const feedbackView = document.getElementById('feedbackView');
const jsaList = document.getElementById('jsaList');
const form = document.getElementById('jsaForm');

let signaturePad = null;

document.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  seedDefaultEquipment();
  renderHazardCheckboxes();
  renderList();
  renderLotoList();
  renderJourneyList();
  renderSavedTrailers();
  renderSavedLoadItems();
  setupEventListeners();
  initSignaturePad();
  initLotoSignaturePad();
  registerServiceWorker();
  addParticipant();
  requestLocation(); // auto-request on load
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
  document.getElementById('savedBtn').onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="list"]').classList.add('active');
    showView('list');
    renderList();
  };
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
  document.getElementById('saveLotoBtn').onclick = saveLoto;
  document.getElementById('saveJourneyBtn').onclick = saveJourney;
  document.getElementById('addTrailerItemBtn').onclick = addTrailerItem;
  document.getElementById('addSavedLoadItemBtn').onclick = addSavedLoadItem;
  document.getElementById('manageTrailersBtn').onclick = showManageTrailers;
  document.getElementById('savedTrailerSelect').onchange = loadSavedTrailer;
  document.getElementById('departGpsBtn').onclick = () => fillGps('journeyDepart');
  document.getElementById('destGpsBtn').onclick = () => fillGps('journeyDest');
  document.getElementById('departMapsBtn').onclick = () => openMaps('journeyDepart');
  document.getElementById('destMapsBtn').onclick = () => openMaps('journeyDest');
  document.getElementById('getDirectionsBtn').onclick = openDirections;

  // Auto-load route when both fields have content
  ['journeyDepart', 'journeyDest'].forEach(id => {
    document.getElementById(id).addEventListener('blur', tryAutoRoute);
    document.getElementById(id).addEventListener('change', tryAutoRoute);
  });

  document.getElementById('closeModalBtn').onclick = closeEquipmentModal;
  document.getElementById('equipmentModal').onclick = (e) => {
    if (e.target.id === 'equipmentModal') closeEquipmentModal();
  };
  renderEquipmentLibrary();
  document.getElementById('clearSignatureBtn').onclick = clearSignature;
  document.getElementById('clearLotoSignatureBtn').onclick = clearLotoSignature;

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
  [listView, formView, previewView, lotoView, journeyView, feedbackView, equipmentView].forEach(v => v && v.classList.add('hidden'));
  if (view === 'list') listView.classList.remove('hidden');
  if (view === 'form') formView.classList.remove('hidden');
  if (view === 'preview') previewView.classList.remove('hidden');
  if (view === 'loto') lotoView.classList.remove('hidden');
  if (view === 'journey') journeyView.classList.remove('hidden');
  if (view === 'feedback') feedbackView.classList.remove('hidden');
  if (view === 'equipment') { equipmentView.classList.remove('hidden'); renderEquipmentLibrary(); }
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
      selectedHazards.push({ ...haz, residualRisk: 'Low' });
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
        <div class="risk-badge risk-low" style="display:inline-block; padding:0.4rem 0.8rem;">Low</div>
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

function initSignaturePad() {
  const canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function start(e) { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
  function move(e) {
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    e.preventDefault();
  }
  function end() { drawing = false; }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
  signaturePad = { canvas, ctx };
}

function initLotoSignaturePad() {
  const canvas = document.getElementById('lotoSignatureCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: (touch.clientX - rect.left) * (canvas.width / rect.width), y: (touch.clientY - rect.top) * (canvas.height / rect.height) };
  }
  function start(e) { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
  function move(e) { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke(); e.preventDefault(); }
  function end() { drawing = false; }
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
  window.lotoSignaturePad = { canvas, ctx };
}

function clearLotoSignature() {
  if (window.lotoSignaturePad) window.lotoSignaturePad.ctx.clearRect(0, 0, window.lotoSignaturePad.canvas.width, window.lotoSignaturePad.canvas.height);
}

function getLotoSignature() {
  return window.lotoSignaturePad ? window.lotoSignaturePad.canvas.toDataURL('image/png') : '';
}

function clearSignature() {
  if (!signaturePad) return;
  signaturePad.ctx.clearRect(0, 0, signaturePad.canvas.width, signaturePad.canvas.height);
}

function getSignatureData() {
  if (!signaturePad) return '';
  return signaturePad.canvas.toDataURL('image/png');
}

function requestLocation() {
  const status = document.getElementById('locationStatus');
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by this device.';
    return;
  }
  status.textContent = 'Requesting location...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lon;
      status.textContent = 'Location captured.';
      loadNearbyHospitals(lat, lon);
    },
    err => {
      status.textContent = 'Location is required. Please allow location access and reload the page.';
      alert('Location access is required to complete a JSA. Please enable location services and refresh.');
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
}

async function loadNearbyHospitals(lat, lon) {
  const select = document.getElementById('nearestHospital');
  select.innerHTML = '<option value="">Loading hospitals...</option>';
  try {
    // Query nodes, ways, and relations for better coverage
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:80467,${lat},${lon});
        way["amenity"="hospital"](around:80467,${lat},${lon});
        relation["amenity"="hospital"](around:80467,${lat},${lon});
      );
      out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Overpass error');
    const data = await res.json();

    const hospitals = (data.elements || [])
      .map(e => {
        const name = e.tags && e.tags.name;
        if (!name) return null;
        const elat = e.lat || (e.center && e.center.lat);
        const elon = e.lon || (e.center && e.center.lon);
        let dist = 999999;
        if (elat && elon) {
          dist = Math.sqrt(Math.pow(elat - lat, 2) + Math.pow(elon - lon, 2));
        }
        return { name, dist };
      })
      .filter(Boolean)
      .filter((h, i, arr) => arr.findIndex(x => x.name === h.name) === i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 25);

    let options = '<option value="">Select nearest hospital...</option>';
    options += hospitals.map(h => `<option value="${escapeHtml(h.name)}">${escapeHtml(h.name)}</option>`).join('');
    options += '<option value="__manual__">— Enter hospital manually —</option>';
    select.innerHTML = options;

    if (!hospitals.length) {
      select.innerHTML = '<option value="">No hospitals found — use manual entry</option><option value="__manual__">— Enter hospital manually —</option>';
    }

    // Handle manual entry
    select.onchange = () => {
      const manualInput = document.getElementById('manualHospital');
      if (select.value === '__manual__') {
        if (!manualInput) {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = 'manualHospital';
          input.placeholder = 'Type hospital name';
          input.className = 'field';
          input.style.marginTop = '0.5rem';
          select.parentNode.appendChild(input);
        } else {
          manualInput.style.display = 'block';
        }
      } else if (manualInput) {
        manualInput.style.display = 'none';
      }
    };
  } catch (e) {
    select.innerHTML = '<option value="">Could not load hospitals</option><option value="__manual__">— Enter hospital manually —</option>';
  }
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
    nearestHospital: (() => {
      const sel = document.getElementById('nearestHospital').value;
      if (sel === '__manual__') {
        const manual = document.getElementById('manualHospital');
        return manual ? manual.value.trim() : '';
      }
      return sel;
    })(),
    participants: [...participants],
    ppe: ppeChecked,
    hazards: selectedHazards.map(h => ({ id: h.id, name: h.name, residualRisk: h.residualRisk })),
    notes: document.getElementById('notes').value.trim(),
    signature: getSignatureData(),
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
      <p><strong>Worker Signature:</strong></p>
      ${data.signature ? `<img src="${data.signature}" alt="Signature" style="max-width:250px; border:1px solid #e2e8f0; border-radius:6px;">` : '<em>No signature</em>'}
      <p><strong>Date Signed:</strong> ${data.signDate||'—'}</p>
    </div>
  `;
}

function getAllJsas() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function renderList() {
  const jsas = getAllJsas();
  const lotos = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  const journeys = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');

  let html = '';

  if (jsas.length) {
    html += '<h3 style="margin:1rem 0 0.5rem; font-size:1rem;">JSAs</h3>';
    html += jsas.map(j => `
      <div class="jsa-card" onclick="loadJsa('${j.id}')">
        <h4>${escapeHtml(j.jobName)}</h4>
        <div class="meta">
          <span>${j.jobDate || ''}</span>
          <span class="status-badge status-${(j.status||'draft').toLowerCase()}">${j.status || 'Draft'}</span>
        </div>
      </div>
    `).join('');
  }

  if (lotos.length) {
    html += '<h3 style="margin:1rem 0 0.5rem; font-size:1rem;">LOTO Records</h3>';
    html += lotos.map(r => `
      <div class="jsa-card" onclick="loadLoto('${r.id}')">
        <strong>${escapeHtml(r.equipment||'Untitled LOTO')}</strong><br>
        <span class="meta">Applied: ${r.applied||'—'} | Removed: ${r.removed||'—'}</span>
      </div>
    `).join('');
  }

  if (journeys.length) {
    html += '<h3 style="margin:1rem 0 0.5rem; font-size:1rem;">Journey Plans</h3>';
    html += journeys.map(r => `
      <div class="jsa-card" onclick="loadJourney('${r.id}')">
        <strong>${escapeHtml(r.driver||'Untitled')} → ${escapeHtml(r.dest||'')}</strong><br>
        <span class="meta">${new Date(r.savedAt).toLocaleDateString()}</span>
      </div>
    `).join('');
  }

  jsaList.innerHTML = html || '<p>No saved documents yet.</p>';
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
  document.getElementById('signDate').value = j.signDate || '';
  if (j.signature && signaturePad) {
    const img = new Image();
    img.onload = () => signaturePad.ctx.drawImage(img, 0, 0);
    img.src = j.signature;
  }

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

let currentLotoId = null;

// LOTO
function saveLoto() {
  const rec = {
    id: currentLotoId || Date.now().toString(),
    equipment: document.getElementById('lotoEquipment').value,
    signature: getLotoSignature(),
    applied: document.getElementById('lotoApplied').value,
    removed: document.getElementById('lotoRemoved').value,
    serials: document.getElementById('lotoSerials').value,
    handover: document.getElementById('lotoHandover').value,
    savedAt: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  const idx = all.findIndex(r => r.id === rec.id);
  if (idx >= 0) all[idx] = rec; else all.unshift(rec);
  localStorage.setItem(LOTO_KEY, JSON.stringify(all));
  currentLotoId = null;
  document.getElementById('lotoForm').reset();
  clearLotoSignature();
  renderLotoList();
  alert('LOTO record saved.');
}

function renderLotoList() {
  const all = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  document.getElementById('lotoList').innerHTML = all.length ? '<h3>Saved LOTO Records</h3><p class="small-note">Tap a record to open and edit it. Note: records are stored on this device only.</p>' + all.map(r => `
    <div class="jsa-card" onclick="loadLoto('${r.id}')">
      <strong>${escapeHtml(r.equipment||'Untitled')}</strong><br>
      Applied: ${r.applied||'—'} | Removed: ${r.removed||'—'}<br>
      <small>${new Date(r.savedAt).toLocaleString()}</small>
    </div>
  `).join('') : '<p class="small-note">No LOTO records yet. Records are stored on this device only.</p>';
}

function loadLoto(id) {
  const all = JSON.parse(localStorage.getItem(LOTO_KEY) || '[]');
  const r = all.find(x => x.id === id);
  if (!r) return;
  currentLotoId = id;
  document.getElementById('lotoEquipment').value = r.equipment || '';
  document.getElementById('lotoApplied').value = r.applied || '';
  document.getElementById('lotoRemoved').value = r.removed || '';
  document.getElementById('lotoSerials').value = r.serials || '';
  document.getElementById('lotoHandover').value = r.handover || '';
  if (r.signature && window.lotoSignaturePad) {
    const img = new Image();
    img.onload = () => window.lotoSignaturePad.ctx.drawImage(img, 0, 0);
    img.src = r.signature;
  }
  showView('loto');
}

// Journey
function fillGps(fieldId) {
  if (!navigator.geolocation) { alert('Geolocation not available'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById(fieldId).value = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
  }, () => alert('Could not get location'));
}

function openMaps(fieldId) {
  const val = document.getElementById(fieldId).value.trim();
  const q = val || 'current location';
  const url = `https://maps.google.com/?q=${encodeURIComponent(q)}`;
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function tryAutoRoute() {
  const from = document.getElementById('journeyDepart').value.trim();
  const to = document.getElementById('journeyDest').value.trim();
  if (!from || !to) return;
  const routeBox = document.getElementById('journeyRoute');
  routeBox.value = 'Loading route...';

  const fromCoord = parseCoord(from);
  const toCoord = parseCoord(to);

  if (fromCoord && toCoord) {
    // Use OSRM for step-by-step directions
    fetch(`https://router.project-osrm.org/route/v1/driving/${fromCoord.lon},${fromCoord.lat};${toCoord.lon},${toCoord.lat}?overview=false&steps=true`)
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes[0] && data.routes[0].legs) {
          const steps = data.routes[0].legs[0].steps || [];
          const lines = steps.map((s, i) => {
            const dist = (s.distance / 1609.34).toFixed(1);
            const instruction = s.maneuver && s.maneuver.instruction ? s.maneuver.instruction : (s.name ? `Continue on ${s.name}` : 'Continue');
            return `${i + 1}. ${instruction} (${dist} mi)`;
          }).filter(Boolean);
          const totalDist = (data.routes[0].distance / 1609.34).toFixed(1);
          const totalMins = Math.round(data.routes[0].duration / 60);
          routeBox.value = lines.length
            ? `Total: ${totalDist} miles, ~${totalMins} min\n\n` + lines.join('\n')
            : `Approx. ${totalDist} miles, ${totalMins} minutes. Use Google Maps for full turn-by-turn.`;
        } else {
          routeBox.value = 'Route calculated. Use Get Google Maps Directions for full details.';
        }
      })
      .catch(() => { routeBox.value = 'Could not auto-load route. Use Get Google Maps Directions.'; });
  } else {
    routeBox.value = 'Addresses entered. Use Get Google Maps Directions for full route.';
  }
}

function parseCoord(str) {
  const m = str.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  return null;
}

function seedDefaultEquipment() {
  const trailerKey = 'n2thestorm_trailer_specs';
  const itemKey = 'n2thestorm_load_items';

  const defaultTrailers = [
    {
      name: "35' Gooseneck (Dual Axle)",
      maxWeight: '36000',
      maxLength: '35',
      maxWidth: '8.5',
      maxHeight: '13.5',
      notes: 'Dual axles rated 18,000 lbs each. Trailer empty weight 7,000 lbs. Usable payload approx. 29,000 lbs.'
    },
    {
      name: 'Mesa Energy Solutions 350kW NG Generator (22L)',
      maxWeight: '16989',
      maxLength: '22',
      maxWidth: '8.6',
      maxHeight: '10.3',
      notes: 'Bumper-pull trailer-mounted natural gas generator. 350 kW prime, PSI 21.9L / 22L engine. Wet weight ~16,989 lbs. Enclosure approx. 260" L × 103" W × 124" H.'
    },
    {
      name: 'Mesa Energy Solutions 250kW NG Generator (14L)',
      maxWeight: '15289',
      maxLength: '22',
      maxWidth: '8.6',
      maxHeight: '10.3',
      notes: 'Bumper-pull trailer-mounted natural gas generator. 250 kW prime, PSI 14.6L engine. Wet weight ~15,289 lbs. Enclosure approx. 260" L × 103" W × 124" H.'
    },
    {
      name: 'Mesa Energy Solutions 170kW NG Generator (11L)',
      maxWeight: '10929',
      maxLength: '23',
      maxWidth: '7.3',
      maxHeight: '9.7',
      notes: 'Bumper-pull trailer-mounted natural gas generator. 170 kW prime, PSI 11.1L engine. Wet weight ~10,929 lbs. Enclosure approx. 272" L × 87" W × 116" H.'
    }
  ];

  const defaultItems = [
    {
      name: 'Atlas Copco PAC H108 E (PAC 108E)',
      weight: '7350',
      length: '10',
      width: '6',
      height: '5.5',
      notes: '350 HP electric boost pump. Max flow 6,400 USgpm, max head 360 ft. 10" suction / 8" discharge. Dry weight ~7,350 lbs. Dimensions approx. 10 ft L × 6 ft W × 5.5 ft H.'
    },
    {
      name: 'Atlas Copco PAC F44 E (PAC 44E)',
      weight: '2755',
      length: '7.8',
      width: '5.7',
      height: '3.7',
      notes: '50 HP electric pump. Max flow ~1,300 USgpm, max head ~150 ft. 4" suction / 4" discharge. Dry weight ~2,755 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.7 ft H.'
    },
    {
      name: 'Atlas Copco PAC F66 E (PAC 66E)',
      weight: '3415',
      length: '7.8',
      width: '5.7',
      height: '3.9',
      notes: '75 HP electric pump. Max flow 2,640 USgpm, max head 166 ft. 6" suction / 6" discharge. Dry weight ~3,415 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.9 ft H.'
    },
    {
      name: 'Atlas Copco PAC F88 E (PAC 88E)',
      weight: '4520',
      length: '7.8',
      width: '5.7',
      height: '4.4',
      notes: '150 HP electric pump. Max flow 3,950 USgpm, max head 200 ft. 8" suction / 8" discharge. Dry weight ~4,520 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 4.4 ft H.'
    }
  ];

  // Always ensure built-ins exist
  let existingTrailers = JSON.parse(localStorage.getItem(trailerKey) || '[]');
  let existingTrailerNames = existingTrailers.map(t => t.name);
  defaultTrailers.forEach(d => {
    if (!existingTrailerNames.includes(d.name)) existingTrailers.push(d);
  });
  localStorage.setItem(trailerKey, JSON.stringify(existingTrailers));

  let existingItems = JSON.parse(localStorage.getItem(itemKey) || '[]');
  let existingItemNames = existingItems.map(i => i.name);
  defaultItems.forEach(d => {
    if (!existingItemNames.includes(d.name)) existingItems.push(d);
  });
  localStorage.setItem(itemKey, JSON.stringify(existingItems));
}

function renderEquipmentLibrary() {
  // Always show built-in equipment directly so it appears even if localStorage is stale
  const builtInTrailers = [
    { name: "35' Gooseneck (Dual Axle)", maxWeight: '36000', maxLength: '35', maxWidth: '8.5', maxHeight: '13.5', notes: 'Dual axles rated 18,000 lbs each. Trailer empty weight 7,000 lbs. Usable payload approx. 29,000 lbs.' },
    { name: 'Mesa Energy Solutions 350kW NG Generator (22L)', maxWeight: '16989', maxLength: '22', maxWidth: '8.6', maxHeight: '10.3', notes: 'Bumper-pull trailer-mounted natural gas generator. 350 kW prime, PSI 21.9L / 22L engine. Wet weight ~16,989 lbs. Enclosure approx. 260" L × 103" W × 124" H.' },
    { name: 'Mesa Energy Solutions 250kW NG Generator (14L)', maxWeight: '15289', maxLength: '22', maxWidth: '8.6', maxHeight: '10.3', notes: 'Bumper-pull trailer-mounted natural gas generator. 250 kW prime, PSI 14.6L engine. Wet weight ~15,289 lbs. Enclosure approx. 260" L × 103" W × 124" H.' },
    { name: 'Mesa Energy Solutions 170kW NG Generator (11L)', maxWeight: '10929', maxLength: '23', maxWidth: '7.3', maxHeight: '9.7', notes: 'Bumper-pull trailer-mounted natural gas generator. 170 kW prime, PSI 11.1L engine. Wet weight ~10,929 lbs. Enclosure approx. 272" L × 87" W × 116" H.' }
  ];

  const builtInItems = [
    { name: 'Atlas Copco PAC H108 E (PAC 108E)', weight: '7350', length: '10', width: '6', height: '5.5', notes: '350 HP electric boost pump. Max flow 6,400 USgpm, max head 360 ft. 10" suction / 8" discharge. Dry weight ~7,350 lbs. Dimensions approx. 10 ft L × 6 ft W × 5.5 ft H.' },
    { name: 'Atlas Copco PAC F44 E (PAC 44E)', weight: '2755', length: '7.8', width: '5.7', height: '3.7', notes: '50 HP electric pump. Max flow ~1,300 USgpm, max head ~150 ft. 4" suction / 4" discharge. Dry weight ~2,755 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.7 ft H.' },
    { name: 'Atlas Copco PAC F66 E (PAC 66E)', weight: '3415', length: '7.8', width: '5.7', height: '3.9', notes: '75 HP electric pump. Max flow 2,640 USgpm, max head 166 ft. 6" suction / 6" discharge. Dry weight ~3,415 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.9 ft H.' },
    { name: 'Atlas Copco PAC F88 E (PAC 88E)', weight: '4520', length: '7.8', width: '5.7', height: '4.4', notes: '150 HP electric pump. Max flow 3,950 USgpm, max head 200 ft. 8" suction / 8" discharge. Dry weight ~4,520 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 4.4 ft H.' }
  ];

  document.getElementById('trailerLibrary').innerHTML = builtInTrailers.map((t, i) => `
    <div class="jsa-card" onclick="showBuiltInDetail('trailer', ${i})">
      <strong>${escapeHtml(t.name)}</strong><br>
      <span class="meta">Max ${t.maxWeight || '—'} lbs • ${t.maxLength || '—'} ft long</span>
    </div>
  `).join('');

  document.getElementById('loadItemLibrary').innerHTML = builtInItems.map((it, i) => `
    <div class="jsa-card" onclick="showBuiltInDetail('item', ${i})">
      <strong>${escapeHtml(it.name)}</strong><br>
      <span class="meta">${it.weight || '—'} lbs</span>
    </div>
  `).join('');
}

function showBuiltInDetail(type, index) {
  const trailers = [
    { name: "35' Gooseneck (Dual Axle)", maxWeight: '36000', maxLength: '35', maxWidth: '8.5', maxHeight: '13.5', notes: 'Dual axles rated 18,000 lbs each. Trailer empty weight 7,000 lbs. Usable payload approx. 29,000 lbs.' },
    { name: 'Mesa Energy Solutions 350kW NG Generator (22L)', maxWeight: '16989', maxLength: '22', maxWidth: '8.6', maxHeight: '10.3', notes: 'Bumper-pull trailer-mounted natural gas generator. 350 kW prime, PSI 21.9L / 22L engine. Wet weight ~16,989 lbs. Enclosure approx. 260" L × 103" W × 124" H.' },
    { name: 'Mesa Energy Solutions 250kW NG Generator (14L)', maxWeight: '15289', maxLength: '22', maxWidth: '8.6', maxHeight: '10.3', notes: 'Bumper-pull trailer-mounted natural gas generator. 250 kW prime, PSI 14.6L engine. Wet weight ~15,289 lbs. Enclosure approx. 260" L × 103" W × 124" H.' },
    { name: 'Mesa Energy Solutions 170kW NG Generator (11L)', maxWeight: '10929', maxLength: '23', maxWidth: '7.3', maxHeight: '9.7', notes: 'Bumper-pull trailer-mounted natural gas generator. 170 kW prime, PSI 11.1L engine. Wet weight ~10,929 lbs. Enclosure approx. 272" L × 87" W × 116" H.' }
  ];
  const items = [
    { name: 'Atlas Copco PAC H108 E (PAC 108E)', weight: '7350', length: '10', width: '6', height: '5.5', notes: '350 HP electric boost pump. Max flow 6,400 USgpm, max head 360 ft. 10" suction / 8" discharge. Dry weight ~7,350 lbs. Dimensions approx. 10 ft L × 6 ft W × 5.5 ft H.' },
    { name: 'Atlas Copco PAC F44 E (PAC 44E)', weight: '2755', length: '7.8', width: '5.7', height: '3.7', notes: '50 HP electric pump. Max flow ~1,300 USgpm, max head ~150 ft. 4" suction / 4" discharge. Dry weight ~2,755 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.7 ft H.' },
    { name: 'Atlas Copco PAC F66 E (PAC 66E)', weight: '3415', length: '7.8', width: '5.7', height: '3.9', notes: '75 HP electric pump. Max flow 2,640 USgpm, max head 166 ft. 6" suction / 6" discharge. Dry weight ~3,415 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 3.9 ft H.' },
    { name: 'Atlas Copco PAC F88 E (PAC 88E)', weight: '4520', length: '7.8', width: '5.7', height: '4.4', notes: '150 HP electric pump. Max flow 3,950 USgpm, max head 200 ft. 8" suction / 8" discharge. Dry weight ~4,520 lbs. Dimensions approx. 7.8 ft L × 5.7 ft W × 4.4 ft H.' }
  ];
  const item = type === 'trailer' ? trailers[index] : items[index];
  if (!item) return;

  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  title.textContent = item.name;

  let html = '';
  if (type === 'trailer') {
    html = `
      <p><strong>Max Weight Capacity:</strong> ${item.maxWeight || '—'} lbs</p>
      <p><strong>Length:</strong> ${item.maxLength || '—'} ft</p>
      <p><strong>Width:</strong> ${item.maxWidth || '—'} ft</p>
      <p><strong>Height:</strong> ${item.maxHeight || '—'} ft</p>
      ${item.notes ? `<p style="margin-top:0.75rem;">${escapeHtml(item.notes)}</p>` : ''}
    `;
  } else {
    html = `
      <p><strong>Weight:</strong> ${item.weight || '—'} lbs</p>
      <p><strong>Length:</strong> ${item.length || '—'} ft</p>
      <p><strong>Width:</strong> ${item.width || '—'} ft</p>
      <p><strong>Height:</strong> ${item.height || '—'} ft</p>
      ${item.notes ? `<p style="margin-top:0.75rem;">${escapeHtml(item.notes)}</p>` : ''}
    `;
  }
  body.innerHTML = html;
  document.getElementById('equipmentModal').classList.remove('hidden');
}

function showManageTrailers() {
  const all = JSON.parse(localStorage.getItem('n2thestorm_trailer_specs') || '[]');
  const builtIn = [
    "35' Gooseneck (Dual Axle)",
    'Mesa Energy Solutions 350kW NG Generator (22L)',
    'Mesa Energy Solutions 250kW NG Generator (14L)',
    'Mesa Energy Solutions 170kW NG Generator (11L)'
  ];
  const userTrailers = all.filter(t => !builtIn.includes(t.name));
  if (!userTrailers.length) {
    alert('You have no custom trailers saved yet.');
    return;
  }
  const names = userTrailers.map(t => t.name).join('\n');
  const toDelete = prompt('Your saved trailers:\n\n' + names + '\n\nType the exact name of the trailer you want to delete:');
  if (!toDelete) return;
  const idx = all.findIndex(t => t.name === toDelete.trim());
  if (idx >= 0 && !builtIn.includes(all[idx].name)) {
    all.splice(idx, 1);
    localStorage.setItem('n2thestorm_trailer_specs', JSON.stringify(all));
    renderSavedTrailers();
    alert('Trailer deleted.');
  } else {
    alert('Trailer not found or it is a built-in trailer.');
  }
}

function deleteLoadItem(index) {
  if (!confirm('Delete this load item? This cannot be undone.')) return;
  const all = JSON.parse(localStorage.getItem('n2thestorm_load_items') || '[]');
  all.splice(index, 1);
  localStorage.setItem('n2thestorm_load_items', JSON.stringify(all));
  renderEquipmentLibrary();
  renderSavedLoadItems();
}

function showEquipmentDetail(type, index) {
  const key = type === 'trailer' ? 'n2thestorm_trailer_specs' : 'n2thestorm_load_items';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const item = list[index];
  if (!item) return;

  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  title.textContent = item.name;

  let html = '';
  if (type === 'trailer') {
    html = `
      <p><strong>Max Weight Capacity:</strong> ${item.maxWeight || '—'} lbs</p>
      <p><strong>Length:</strong> ${item.maxLength || '—'} ft</p>
      <p><strong>Width:</strong> ${item.maxWidth || '—'} ft</p>
      <p><strong>Height:</strong> ${item.maxHeight || '—'} ft</p>
      ${item.notes ? `<p style="margin-top:0.75rem;">${escapeHtml(item.notes)}</p>` : ''}
    `;
  } else {
    html = `
      <p><strong>Weight:</strong> ${item.weight || '—'} lbs</p>
      <p><strong>Length:</strong> ${item.length || '—'} ft</p>
      <p><strong>Width:</strong> ${item.width || '—'} ft</p>
      <p><strong>Height:</strong> ${item.height || '—'} ft</p>
      ${item.notes ? `<p style="margin-top:0.75rem;">${escapeHtml(item.notes)}</p>` : ''}
    `;
  }
  body.innerHTML = html;
  document.getElementById('equipmentModal').classList.remove('hidden');
}

function closeEquipmentModal() {
  document.getElementById('equipmentModal').classList.add('hidden');
}

function openDirections() {
  const from = document.getElementById('journeyDepart').value.trim();
  const to = document.getElementById('journeyDest').value.trim();
  if (!from || !to) { alert('Enter both departure and destination first.'); return; }
  const url = `https://maps.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  document.getElementById('journeyRoute').value = `Directions opened in Google Maps from "${from}" to "${to}".`;
}

function saveTrailerSpec() {
  const name = document.getElementById('trailerName').value.trim();
  if (!name) { alert('Enter a trailer name to save.'); return; }
  const spec = {
    name,
    maxWeight: document.getElementById('trailerMaxWeight').value,
    maxLength: document.getElementById('trailerMaxLength').value,
    maxWidth: document.getElementById('trailerMaxWidth').value,
    maxHeight: document.getElementById('trailerMaxHeight').value
  };
  const all = JSON.parse(localStorage.getItem('n2thestorm_trailer_specs') || '[]');
  const idx = all.findIndex(t => t.name === name);
  if (idx >= 0) all[idx] = spec; else all.push(spec);
  localStorage.setItem('n2thestorm_trailer_specs', JSON.stringify(all));
  renderSavedTrailers();
  alert('Trailer specs saved.');
}

function renderSavedLoadItems() {
  const select = document.getElementById('savedLoadItemSelect');
  if (!select) return;
  const all = JSON.parse(localStorage.getItem('n2thestorm_load_items') || '[]');
  select.innerHTML = '<option value="">— Select a saved load item —</option>' +
    all.map((it, i) => `<option value="${i}">${escapeHtml(it.name)}</option>`).join('');
}

function addSavedLoadItem() {
  const select = document.getElementById('savedLoadItemSelect');
  const idx = select.value;
  if (idx === '') return;
  const all = JSON.parse(localStorage.getItem('n2thestorm_load_items') || '[]');
  const item = all[idx];
  if (!item) return;
  trailerItems.push({
    id: Date.now(),
    name: item.name,
    weight: parseFloat(item.weight) || 0,
    length: parseFloat(item.length) || 0,
    width: parseFloat(item.width) || 0,
    height: parseFloat(item.height) || 0
  });
  renderTrailerItems();
  select.value = '';
}

function renderSavedTrailers() {
  const select = document.getElementById('savedTrailerSelect');
  const all = JSON.parse(localStorage.getItem('n2thestorm_trailer_specs') || '[]');
  select.innerHTML = '<option value="">— Select a saved trailer or enter new —</option>' +
    all.map(t => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)}</option>`).join('');
}

function loadSavedTrailer() {
  const name = document.getElementById('savedTrailerSelect').value;
  if (!name) return;
  const all = JSON.parse(localStorage.getItem('n2thestorm_trailer_specs') || '[]');
  const t = all.find(x => x.name === name);
  if (!t) return;
  document.getElementById('trailerName').value = t.name;
  document.getElementById('trailerMaxWeight').value = t.maxWeight || '';
  document.getElementById('trailerMaxLength').value = t.maxLength || '';
  document.getElementById('trailerMaxWidth').value = t.maxWidth || '';
  document.getElementById('trailerMaxHeight').value = t.maxHeight || '';
}

let currentJourneyId = null;

function saveJourney() {
  const rec = {
    id: currentJourneyId || Date.now().toString(),
    driver: document.getElementById('journeyDriver').value,
    passengers: document.getElementById('journeyPassengers').value,
    vehicle: document.getElementById('journeyVehicle').value,
    plate: document.getElementById('journeyPlate').value,
    depart: document.getElementById('journeyDepart').value,
    dest: document.getElementById('journeyDest').value,
    route: document.getElementById('journeyRoute').value,
    stops: document.getElementById('journeyStops').value,
    departTime: document.getElementById('journeyDepartTime').value,
    arrival: document.getElementById('journeyEta').value,
    trailerName: document.getElementById('trailerName').value,
    maxWeight: document.getElementById('trailerMaxWeight').value,
    items: [...trailerItems],
    savedAt: new Date().toISOString()
  };
  const all = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');
  const idx = all.findIndex(r => r.id === rec.id);
  if (idx >= 0) all[idx] = rec; else all.unshift(rec);
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(all));
  currentJourneyId = null;
  document.getElementById('journeyForm').reset();
  trailerItems = [];
  renderTrailerItems();
  renderJourneyList();
  alert('Journey plan saved.');
}

function renderJourneyList() {
  const all = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');
  document.getElementById('journeyList').innerHTML = all.length ? '<h3>Saved Journeys</h3><p class="small-note">Tap a journey to open and edit it.</p>' + all.map(r => `
    <div class="jsa-card" onclick="loadJourney('${r.id}')">
      <strong>${escapeHtml(r.driver||'Untitled')} → ${escapeHtml(r.dest||'')}</strong><br>
      <small>${new Date(r.savedAt).toLocaleString()}</small>
    </div>
  `).join('') : '';
}

function loadJourney(id) {
  const all = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '[]');
  const r = all.find(x => x.id === id);
  if (!r) return;
  currentJourneyId = id;
  document.getElementById('journeyDriver').value = r.driver || '';
  document.getElementById('journeyPassengers').value = r.passengers || '';
  document.getElementById('journeyVehicle').value = r.vehicle || '';
  document.getElementById('journeyPlate').value = r.plate || '';
  document.getElementById('journeyDepart').value = r.depart || '';
  document.getElementById('journeyDest').value = r.dest || '';
  document.getElementById('journeyRoute').value = r.route || '';
  document.getElementById('journeyStops').value = r.stops || '';
  document.getElementById('journeyDepartTime').value = r.departTime || '';
  document.getElementById('journeyEta').value = r.arrival || '';
  document.getElementById('trailerName').value = r.trailerName || '';
  document.getElementById('trailerMaxWeight').value = r.maxWeight || '';
  trailerItems = r.items || [];
  renderTrailerItems();
  showView('journey');
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
  const remaining = maxW > 0 ? maxW - totalWeight : null;

  let html = `<strong>Total Load Weight:</strong> ${totalWeight.toLocaleString()} lbs`;
  if (maxW > 0) {
    html += `<br><strong>Payload Capacity:</strong> ${maxW.toLocaleString()} lbs`;
    if (over) {
      html += `<br><span style="color:#dc2626; font-weight:700;">⚠ OVERLOADED by ${(totalWeight - maxW).toLocaleString()} lbs</span>`;
    } else {
      html += `<br><span style="color:#16a34a;">✓ Within capacity (${remaining.toLocaleString()} lbs remaining)</span>`;
    }
  }
  document.getElementById('trailerSummary').innerHTML = html;
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
