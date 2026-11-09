// N2TheStorm JSA App
// Client-side only — data stored in localStorage

const STORAGE_KEY = 'n2thestorm_jsas';

let currentJsaId = null;
let steps = [];

// DOM refs
const listView = document.getElementById('listView');
const formView = document.getElementById('formView');
const previewView = document.getElementById('previewView');
const jsaList = document.getElementById('jsaList');
const stepsContainer = document.getElementById('stepsContainer');
const form = document.getElementById('jsaForm');

// Init
document.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  renderList();
  setupEventListeners();
  registerServiceWorker();
});

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('jobDate').value = today;
  document.getElementById('signDate').value = today;
}

function setupEventListeners() {
  document.getElementById('newJsaBtn').onclick = startNew;
  document.getElementById('startNewBtn').onclick = startNew;
  document.getElementById('savedBtn').onclick = () => showView('list');
  document.getElementById('addStepBtn').onclick = () => addStep();
  document.getElementById('saveDraftBtn').onclick = saveDraft;
  document.getElementById('previewBtn').onclick = showPreview;
  document.getElementById('printBtn').onclick = () => window.print();
  document.getElementById('backToFormBtn').onclick = () => showView('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    completeAndExport();
  };
}

function showView(view) {
  listView.classList.add('hidden');
  formView.classList.add('hidden');
  previewView.classList.add('hidden');
  if (view === 'list') listView.classList.remove('hidden');
  if (view === 'form') formView.classList.remove('hidden');
  if (view === 'preview') previewView.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function startNew() {
  currentJsaId = null;
  form.reset();
  setDefaultDates();
  steps = [];
  stepsContainer.innerHTML = '';
  addStep(); // start with one empty step
  showView('form');
}

function addStep(data = {}) {
  const stepIndex = steps.length;
  const stepId = Date.now() + stepIndex;
  const step = {
    id: stepId,
    description: data.description || '',
    hazards: data.hazards || '',
    riskBefore: data.riskBefore || '',
    controls: data.controls || '',
    riskAfter: data.riskAfter || '',
    responsible: data.responsible || ''
  };
  steps.push(step);
  renderStep(step, steps.length);
}

function renderStep(step, number) {
  const card = document.createElement('div');
  card.className = 'step-card';
  card.dataset.id = step.id;
  card.innerHTML = `
    <div class="step-number">Step ${number}</div>
    <div class="step-header">
      <strong>Task Step</strong>
      <button type="button" class="remove-step" onclick="removeStep('${step.id}')">✕</button>
    </div>
    <div class="field">
      <label>Task Description *</label>
      <textarea rows="2" data-field="description" placeholder="Describe this step of the job">${step.description}</textarea>
    </div>
    <div class="field">
      <label>Potential Hazards *</label>
      <textarea rows="2" data-field="hazards" placeholder="What could go wrong?">${step.hazards}</textarea>
    </div>
    <div class="field">
      <label>Risk Before Controls</label>
      <div class="risk-select">
        <label><input type="radio" name="riskBefore_${step.id}" value="Low" ${step.riskBefore==='Low'?'checked':''}><span>Low</span></label>
        <label><input type="radio" name="riskBefore_${step.id}" value="Medium" ${step.riskBefore==='Medium'?'checked':''}><span>Medium</span></label>
        <label><input type="radio" name="riskBefore_${step.id}" value="High" ${step.riskBefore==='High'?'checked':''}><span>High</span></label>
      </div>
    </div>
    <div class="field">
      <label>Control Measures *</label>
      <textarea rows="2" data-field="controls" placeholder="How will the hazard be controlled?">${step.controls}</textarea>
    </div>
    <div class="field">
      <label>Residual Risk</label>
      <div class="risk-select">
        <label><input type="radio" name="riskAfter_${step.id}" value="Low" ${step.riskAfter==='Low'?'checked':''}><span>Low</span></label>
        <label><input type="radio" name="riskAfter_${step.id}" value="Medium" ${step.riskAfter==='Medium'?'checked':''}><span>Medium</span></label>
        <label><input type="radio" name="riskAfter_${step.id}" value="High" ${step.riskAfter==='High'?'checked':''}><span>High</span></label>
      </div>
    </div>
    <div class="field">
      <label>Responsible Person</label>
      <input type="text" data-field="responsible" value="${step.responsible}" placeholder="Who is responsible">
    </div>
  `;
  stepsContainer.appendChild(card);

  // Live update step data
  card.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', () => updateStepFromCard(step.id));
  });
  card.querySelectorAll('input[type="radio"]').forEach(el => {
    el.addEventListener('change', () => updateStepFromCard(step.id));
  });
}

function updateStepFromCard(stepId) {
  const card = document.querySelector(`.step-card[data-id="${stepId}"]`);
  if (!card) return;
  const step = steps.find(s => s.id == stepId);
  if (!step) return;
  step.description = card.querySelector('[data-field="description"]').value;
  step.hazards = card.querySelector('[data-field="hazards"]').value;
  step.controls = card.querySelector('[data-field="controls"]').value;
  step.responsible = card.querySelector('[data-field="responsible"]').value;
  const before = card.querySelector(`input[name="riskBefore_${stepId}"]:checked`);
  const after = card.querySelector(`input[name="riskAfter_${stepId}"]:checked`);
  step.riskBefore = before ? before.value : '';
  step.riskAfter = after ? after.value : '';
}

function removeStep(stepId) {
  if (steps.length <= 1) {
    alert('A JSA needs at least one step.');
    return;
  }
  steps = steps.filter(s => s.id != stepId);
  rerenderSteps();
}

function rerenderSteps() {
  stepsContainer.innerHTML = '';
  steps.forEach((step, i) => renderStep(step, i + 1));
}

function getFormData() {
  // Update all steps from current cards
  steps.forEach(s => updateStepFromCard(s.id));

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
    ppe: ppeChecked,
    steps: [...steps],
    notes: document.getElementById('notes').value.trim(),
    workerSign: document.getElementById('workerSign').value.trim(),
    signDate: document.getElementById('signDate').value,
    createdAt: new Date().toISOString(),
    status: 'draft'
  };
}

function saveDraft() {
  const data = getFormData();
  if (!data.jobName) {
    alert('Please enter a Job / Task Name before saving.');
    return;
  }
  const all = getAllJsas();
  const existingIndex = all.findIndex(j => j.id === data.id);
  if (existingIndex >= 0) {
    all[existingIndex] = data;
  } else {
    all.unshift(data);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  currentJsaId = data.id;
  alert('Draft saved successfully!');
  renderList();
}

function completeAndExport() {
  const data = getFormData();
  if (!data.jobName || !data.preparedBy || steps.some(s => !s.description || !s.hazards || !s.controls)) {
    alert('Please complete all required fields (Job Name, Prepared By, and each step\'s description, hazards, and controls).');
    return;
  }
  data.status = 'completed';
  const all = getAllJsas();
  const existingIndex = all.findIndex(j => j.id === data.id);
  if (existingIndex >= 0) {
    all[existingIndex] = data;
  } else {
    all.unshift(data);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  currentJsaId = data.id;
  showPreview();
}

function showPreview() {
  const data = getFormData();
  if (!data.jobName) {
    alert('Please enter a Job / Task Name.');
    return;
  }
  renderReport(data);
  showView('preview');
}

function renderReport(data) {
  const ppeHtml = data.ppe.length
    ? `<div class="ppe-list">${data.ppe.map(p => `<span class="ppe-badge">${escapeHtml(p)}</span>`).join('')}</div>`
    : '<p><em>None specified</em></p>';

  const stepsHtml = data.steps.map((s, i) => `
    <tr>
      <td><strong>${i+1}</strong></td>
      <td>${escapeHtml(s.description)}</td>
      <td>${escapeHtml(s.hazards)}</td>
      <td class="risk-${(s.riskBefore||'').toLowerCase()}">${s.riskBefore || '—'}</td>
      <td>${escapeHtml(s.controls)}</td>
      <td class="risk-${(s.riskAfter||'').toLowerCase()}">${s.riskAfter || '—'}</td>
      <td>${escapeHtml(s.responsible) || '—'}</td>
    </tr>
  `).join('');

  document.getElementById('reportContent').innerHTML = `
    <div class="report-header">
      <div class="company">N2THESTORM</div>
      <h1>JOB SAFETY ANALYSIS</h1>
      <p>Generated ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="report-meta">
      <div><strong>Job / Task</strong>${escapeHtml(data.jobName)}</div>
      <div><strong>Location</strong>${escapeHtml(data.location) || '—'}</div>
      <div><strong>Date</strong>${data.jobDate || '—'}</div>
      <div><strong>Prepared By</strong>${escapeHtml(data.preparedBy)}</div>
      <div><strong>Supervisor</strong>${escapeHtml(data.supervisor) || '—'}</div>
      <div><strong>Status</strong>${data.status === 'completed' ? 'Completed' : 'Draft'}</div>
    </div>
    <h3 style="margin:1rem 0 0.5rem;color:#0f3460;">Required PPE</h3>
    ${ppeHtml}
    <h3 style="margin:1rem 0 0.5rem;color:#0f3460;">Job Steps, Hazards & Controls</h3>
    <table class="steps-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Task Step</th>
          <th>Hazards</th>
          <th>Risk (Before)</th>
          <th>Control Measures</th>
          <th>Residual Risk</th>
          <th>Responsible</th>
        </tr>
      </thead>
      <tbody>${stepsHtml}</tbody>
    </table>
    ${data.notes ? `<h3 style="margin:1rem 0 0.5rem;color:#0f3460;">Additional Notes</h3><p>${escapeHtml(data.notes).replace(/\n/g,'<br>')}</p>` : ''}
    <div class="signature-block">
      <p><strong>Worker Acknowledgment:</strong> ${escapeHtml(data.workerSign) || '________________________'}</p>
      <p style="margin-top:0.5rem;"><strong>Date:</strong> ${data.signDate || '________________'}</p>
      <p style="margin-top:1rem;font-size:0.8rem;color:#64748b;">
        By signing (typing name), the worker confirms they have reviewed this JSA, understand the hazards and controls, and will follow the safe work procedures.
      </p>
    </div>
  `;
}

function getAllJsas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function renderList() {
  const all = getAllJsas();
  if (all.length === 0) {
    jsaList.innerHTML = '<p style="text-align:center;color:#64748b;padding:2rem;">No JSAs yet. Start a new one!</p>';
    return;
  }
  jsaList.innerHTML = all.map(j => `
    <div class="jsa-card" onclick="loadJsa('${j.id}')">
      <h4>${escapeHtml(j.jobName || 'Untitled')}</h4>
      <div class="meta">
        <span>${j.jobDate || 'No date'} • ${escapeHtml(j.preparedBy || '')}</span>
        <span>${j.status === 'completed' ? '✓ Done' : 'Draft'}</span>
      </div>
    </div>
  `).join('');
}

function loadJsa(id) {
  const all = getAllJsas();
  const jsa = all.find(j => j.id === id);
  if (!jsa) return;
  currentJsaId = jsa.id;
  document.getElementById('jobName').value = jsa.jobName || '';
  document.getElementById('location').value = jsa.location || '';
  document.getElementById('jobDate').value = jsa.jobDate || '';
  document.getElementById('preparedBy').value = jsa.preparedBy || '';
  document.getElementById('supervisor').value = jsa.supervisor || '';
  document.getElementById('notes').value = jsa.notes || '';
  document.getElementById('workerSign').value = jsa.workerSign || '';
  document.getElementById('signDate').value = jsa.signDate || '';
  document.getElementById('otherPpe').value = '';

  // PPE checkboxes
  document.querySelectorAll('#ppeGrid input').forEach(cb => cb.checked = false);
  (jsa.ppe || []).forEach(p => {
    const cb = document.querySelector(`#ppeGrid input[value="${p}"]`);
    if (cb) cb.checked = true;
    else if (p) document.getElementById('otherPpe').value = p;
  });

  steps = jsa.steps || [];
  if (steps.length === 0) {
    steps = [];
    addStep();
  } else {
    stepsContainer.innerHTML = '';
    steps.forEach((s, i) => renderStep(s, i + 1));
  }
  showView('form');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

// Expose for inline onclick
window.removeStep = removeStep;
window.loadJsa = loadJsa;

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}
