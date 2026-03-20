// ══════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════
const CLASS_ORDER = ["Intern", "CA-1", "CA-2", "CA-3", "CA-4"];

// ══════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════
let state = {
  academicYearStart: 2026,
  rotations: [
    "Gen, Neuro, NORA",
    "Gen, Neuro, NORA",
    "CT",
    "Transplant",
    "APS-Regional",
    "Chronic Pain",
    "Elective",
    "OB",
    "APS-Rounding",
    "TIVA",
    "Senior/Jeopardy",
    "East/AOP",
    "PACU/US",
    "Pre-Op",
    "VAMC",
    "DHMC",
    "CHC"
  ],
  rotationSlots: {},       // { "rowIdx": { "weekKey": "residentName" } }
  dailyRotationSlots: {},  // { "rowIdx": { "dateKey": "residentName" } }
  residents: [
    { name: "Palmer",     cls: "CA-1" },
    { name: "Chen",       cls: "CA-1" },
    { name: "Rodriguez",  cls: "CA-2" },
    { name: "Okonkwo",    cls: "CA-2" },
    { name: "Fitzgerald", cls: "CA-3" },
    { name: "Patel",      cls: "CA-3" },
    { name: "Larsson",    cls: "CA-4" },
    { name: "Novak",      cls: "Intern" }
  ],
  conferences: [
    { id: 'c_asa',       name: 'ASA',           start: '10-16', end: '10-20' },
    { id: 'c_snacc',     name: 'SNACC',         start: '09-10', end: '09-12' },
    { id: 'c_asra_fall', name: 'ASRA',          start: '11-05', end: '11-07' },
    { id: 'c_nypga',     name: 'NYPGA',         start: '12-11', end: '12-14' },
    { id: 'c_sta',       name: 'STA',           start: '01-14', end: '01-17' },
    { id: 'c_asaadv',    name: 'ASA Advance',   start: '01-22', end: '01-24' },
    { id: 'c_crash',     name: 'CRASH',         start: '02-22', end: '02-26' },
    { id: 'c_spa',       name: 'SPA',           start: '03-05', end: '03-07' },
    { id: 'c_sccm',      name: 'SCCM',          start: '03-14', end: '03-16' },
    { id: 'c_csa',       name: 'CSA',           start: '04-08', end: '04-11' },
    { id: 'c_sca',       name: 'SCA',           start: '04-08', end: '04-11' },
    { id: 'c_iars',      name: 'IARS/SOCCA',    start: '04-30', end: '05-02' },
    { id: 'c_asra_spr',  name: 'ASRA',          start: '05-13', end: '05-15' },
    { id: 'c_soap',      name: 'SOAP',          start: '05-19', end: '05-23' },
    { id: 'c_asaleg',    name: 'ASA Legislative', start: '05-18', end: '05-20' }
  ],
  colorRules: [
    // Dates stored as MM-DD (year-relative): Jul–Dec → academicYearStart, Jan–Jun → academicYearStart+1
    // Grey – requires attention (highest priority)
    { id: 'g1', color: 'grey',   label: 'New interns on service',  start: '07-06', end: '08-15', rows: 'all' },
    { id: 'g2', color: 'grey',   label: 'Fall attention period',   start: '10-12', end: '10-23', rows: 'all' },
    { id: 'g3', color: 'grey',   label: 'Spring attention period', start: '02-22', end: '02-27', rows: 'all' },
    // Yellow – busy rotation
    { id: 'y1', color: 'yellow', label: 'Thanksgiving',            start: '11-23', end: '11-27', rows: 'all' },
    { id: 'y2', color: 'yellow', label: 'Christmas',               start: '12-21', end: '12-25', rows: 'all' },
    { id: 'y3', color: 'yellow', label: 'CT – always busy',        rows: [2] },
    { id: 'y4', color: 'yellow', label: 'Transplant – always busy',rows: [3] },
    // Blue – no first-time rotators (OB=7, CHC=16)
    { id: 'b1',  color: 'blue', label: 'OB/CHC no first-timers', start: '08-31', end: '09-04', rows: [7,16] },
    { id: 'b2',  color: 'blue', label: 'OB/CHC no first-timers', start: '10-05', end: '10-09', rows: [7,16] },
    { id: 'b3',  color: 'blue', label: 'OB/CHC no first-timers', start: '11-02', end: '11-06', rows: [7,16] },
    { id: 'b4',  color: 'blue', label: 'OB/CHC no first-timers', start: '11-30', end: '12-04', rows: [7,16] },
    { id: 'b5',  color: 'blue', label: 'OB/CHC no first-timers', start: '01-04', end: '01-08', rows: [7,16] },
    { id: 'b6',  color: 'blue', label: 'OB/CHC no first-timers', start: '02-01', end: '02-05', rows: [7,16] },
    { id: 'b7',  color: 'blue', label: 'OB/CHC no first-timers', start: '03-01', end: '03-05', rows: [7,16] },
    { id: 'b8',  color: 'blue', label: 'OB/CHC no first-timers', start: '04-05', end: '04-09', rows: [7,16] },
    { id: 'b9',  color: 'blue', label: 'OB/CHC no first-timers', start: '05-03', end: '05-07', rows: [7,16] },
    { id: 'b10', color: 'blue', label: 'OB/CHC no first-timers', start: '06-07', end: '06-11', rows: [7,16] }
  ]
};

// ══════════════════════════════════════════════════════
//  RESIDENT HELPERS
// ══════════════════════════════════════════════════════
function sortedResidents() {
  return [...state.residents].sort((a, b) => {
    const ai = CLASS_ORDER.indexOf(a.cls);
    const bi = CLASS_ORDER.indexOf(b.cls);
    if (ai !== bi) return ai - bi;
    return a.name.localeCompare(b.name);
  });
}

// ══════════════════════════════════════════════════════
//  PERSISTENCE
// ══════════════════════════════════════════════════════
const STORAGE_KEY = 'rotScheduler3';

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  // Migrate from previous storage key, bumping year from 2025 → 2026
  const legacy = localStorage.getItem('rotScheduler2');
  if (legacy) {
    try {
      const old = JSON.parse(legacy);
      if (old.academicYearStart === 2025) old.academicYearStart = 2026;
      state = { ...state, ...old };
      localStorage.removeItem('rotScheduler2');
      saveState();
      // Fall through to migration check below
    } catch(e) {}
  } else {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { state = { ...state, ...JSON.parse(raw) }; } catch(e) {} }
  }

  // Migrate old string-format residents to object format
  if (state.residents && state.residents.length > 0 && typeof state.residents[0] === 'string') {
    state.residents = state.residents.map(name => ({ name, cls: 'CA-1' }));
    saveState();
  }

  // Ensure conferences array exists
  if (!state.conferences) state.conferences = [];
}
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `rotation-schedule-${state.academicYearStart}.json`;
  a.click();
}
function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      state = { ...state, ...JSON.parse(ev.target.result) };
      // Migrate imported residents if old format
      if (state.residents && state.residents.length > 0 && typeof state.residents[0] === 'string') {
        state.residents = state.residents.map(name => ({ name, cls: 'CA-1' }));
      }
      if (!state.conferences) state.conferences = [];
      saveState(); initAll();
    }
    catch(err) { alert('Invalid JSON file.'); }
  };
  reader.readAsText(file);
}
function clearAll() {
  if (!confirm('Clear ALL weekly and daily rotation assignments? Cannot be undone.')) return;
  state.rotationSlots = {};
  state.dailyRotationSlots = {};
  saveState();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

// ══════════════════════════════════════════════════════
//  DATE UTILITIES
// ══════════════════════════════════════════════════════
function getWeeks() {
  const weeks = [];
  const july1 = new Date(state.academicYearStart, 6, 1);
  let d = new Date(july1);
  const dow = d.getDay();
  if (dow === 0) d.setDate(d.getDate() + 1);
  else if (dow !== 1) d.setDate(d.getDate() + (8 - dow));
  const endDate = new Date(state.academicYearStart + 1, 5, 30);
  while (d <= endDate) {
    const mon = new Date(d);
    const fri = new Date(d); fri.setDate(fri.getDate() + 4);
    weeks.push({ key: isoWeek(mon), monDate: new Date(mon), friDate: new Date(fri) });
    d.setDate(d.getDate() + 7);
  }
  return weeks;
}

function getWeekdays() {
  const days = [];
  for (const w of getWeeks()) {
    for (let i = 0; i < 5; i++) {
      const d = new Date(w.monDate);
      d.setDate(d.getDate() + i);
      days.push({ date: new Date(d), key: dateKey(d), weekKey: w.key, isMonday: i === 0, dow: i });
    }
  }
  return days;
}

function isoWeek(date) {
  const mon = new Date(date);
  const dow = mon.getDay();
  mon.setDate(mon.getDate() - (dow === 0 ? 6 : dow - 1));
  const y = mon.getFullYear();
  const start = new Date(y, 0, 1);
  const wk = Math.ceil(((mon - start) / 86400000 + start.getDay() + 1) / 7);
  return `${y}-W${String(wk).padStart(2,'0')}`;
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fmtShort(d) {
  return `${d.getMonth()+1}/${d.getDate()}`;
}

function fmtRange(mon, fri) {
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${mo[mon.getMonth()]} ${mon.getDate()} – ${mo[fri.getMonth()]} ${fri.getDate()}`;
}

const DAY_ABBR = ['M','T','W','Th','F'];

// ══════════════════════════════════════════════════════
//  COLOR RULES
// ══════════════════════════════════════════════════════
// Convert MM-DD back to a date input value YYYY-MM-DD using the academic year
function mmddToInputValue(mmdd) {
  const d = resolveRuleDate(mmdd);
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Resolve a date string to a Date object.
// Supports 'MM-DD' (year-relative) and legacy 'YYYY-MM-DD'.
// MM >= 7 (Jul–Dec) → academicYearStart; MM < 7 (Jan–Jun) → academicYearStart+1.
function resolveRuleDate(str) {
  if (!str) return null;
  const parts = str.split('-');
  // Both 'MM-DD' and 'YYYY-MM-DD' — always take the last two segments as MM and DD
  const m = parseInt(parts[parts.length - 2]);
  const d = parseInt(parts[parts.length - 1]);
  const year = m >= 7 ? state.academicYearStart : state.academicYearStart + 1;
  return new Date(year, m - 1, d);
}

// Kept for use outside color rules (daily tab date parsing, etc.)
function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Returns 'grey', 'yellow', 'blue', or null for a cell at (rowIndex, dateRange).
// dateA/dateB span the cell: same date for daily, Mon–Fri for weekly.
// Priority: grey(3) > yellow(2) > blue(1).
function getCellColor(ri, dateA, dateB) {
  const priority = { grey: 3, yellow: 2, blue: 1 };
  let best = null;
  for (const rule of (state.colorRules || [])) {
    // Row filter
    if (rule.rows !== 'all' && !rule.rows.includes(ri)) continue;
    // Date range filter (overlap check: cell range overlaps rule range)
    if (rule.start || rule.end) {
      const s = rule.start ? resolveRuleDate(rule.start) : new Date(0);
      const e = rule.end   ? resolveRuleDate(rule.end)   : new Date(9999, 11, 31);
      if (dateB < s || dateA > e) continue;
    }
    if (!best || priority[rule.color] > priority[best]) best = rule.color;
  }
  return best;
}

// ── Settings: Color rule management ──
let editingRuleId = null;

function renderColorRulesList() {
  const list = document.getElementById('colorRulesList');
  if (!list) return;
  const rules = state.colorRules || [];
  if (!rules.length) { list.innerHTML = '<p style="font-size:12px;color:var(--text-muted)">No rules defined.</p>'; return; }
  list.innerHTML = rules.map(r => {
    const fmtMD = md => {
      const d = resolveRuleDate(md);
      return d ? d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '…';
    };
    const dateStr = r.start || r.end
      ? `${r.start ? fmtMD(r.start) : '…'} → ${r.end ? fmtMD(r.end) : '…'}`
      : 'All dates';
    const rowStr = r.rows === 'all'
      ? 'All rows'
      : r.rows.map(i => state.rotations[i] || `Row ${i}`).join(', ');
    return `<div class="rule-card">
      <div class="rule-swatch ${r.color}"></div>
      <div class="rule-label">${r.label || '(no label)'}</div>
      <div class="rule-detail">${dateStr} &nbsp;·&nbsp; ${rowStr}</div>
      <button class="card-edit-btn" onclick="editColorRule('${r.id}')">Edit</button>
      <span class="rm" onclick="deleteColorRule('${r.id}')" title="Delete">×</span>
    </div>`;
  }).join('');
}

function toggleAddRuleForm(ruleToEdit) {
  const form = document.getElementById('addRuleForm');
  const btn  = document.getElementById('addRuleToggleBtn');
  // If called with a rule object, always open; otherwise toggle
  let open;
  if (ruleToEdit) {
    form.classList.add('open');
    open = true;
  } else {
    if (editingRuleId) {
      // Cancel edit
      editingRuleId = null;
      form.classList.remove('open');
      btn.textContent = '+ Add Rule';
      return;
    }
    open = form.classList.toggle('open');
  }
  btn.textContent = open ? '✕ Cancel' : '+ Add Rule';
  if (open) {
    // Populate row checkboxes
    const checks = document.getElementById('ruleRowChecks');
    checks.innerHTML = state.rotations.map((r, i) =>
      `<label><input type="checkbox" value="${i}"${ruleToEdit && Array.isArray(ruleToEdit.rows) && ruleToEdit.rows.includes(i) ? ' checked' : ''}> ${r} (row ${i+1})</label>`
    ).join('');
    if (ruleToEdit) {
      document.getElementById('ruleColor').value = ruleToEdit.color || 'grey';
      document.getElementById('ruleLabel').value = ruleToEdit.label || '';
      document.getElementById('ruleStart').value = ruleToEdit.start ? mmddToInputValue(ruleToEdit.start) : '';
      document.getElementById('ruleEnd').value   = ruleToEdit.end   ? mmddToInputValue(ruleToEdit.end)   : '';
      const allRows = ruleToEdit.rows === 'all';
      document.getElementById('ruleAllRows').checked = allRows;
      checks.style.display = allRows ? 'none' : 'flex';
    } else {
      document.getElementById('ruleColor').value = 'grey';
      document.getElementById('ruleLabel').value = '';
      document.getElementById('ruleStart').value = '';
      document.getElementById('ruleEnd').value = '';
      document.getElementById('ruleAllRows').checked = true;
      checks.style.display = 'none';
    }
  }
}

function editColorRule(id) {
  const rule = (state.colorRules || []).find(r => r.id === id);
  if (!rule) return;
  editingRuleId = id;
  toggleAddRuleForm(rule);
}

function toggleAllRowsCheck(cb) {
  document.getElementById('ruleRowChecks').style.display = cb.checked ? 'none' : 'flex';
}

function saveColorRule() {
  const color = document.getElementById('ruleColor').value;
  const label = document.getElementById('ruleLabel').value.trim();
  const start = document.getElementById('ruleStart').value;
  const end   = document.getElementById('ruleEnd').value;
  const allRows = document.getElementById('ruleAllRows').checked;
  let rows = 'all';
  if (!allRows) {
    rows = [...document.querySelectorAll('#ruleRowChecks input:checked')].map(cb => parseInt(cb.value));
    if (!rows.length) { alert('Select at least one row, or check "All rows".'); return; }
  }
  const toMMDD = v => v.replace(/^\d{4}-/, '');
  if (!state.colorRules) state.colorRules = [];
  if (editingRuleId) {
    const idx = state.colorRules.findIndex(r => r.id === editingRuleId);
    if (idx !== -1) {
      const rule = { id: editingRuleId, color, label, rows };
      if (start) rule.start = toMMDD(start);
      if (end)   rule.end   = toMMDD(end);
      state.colorRules[idx] = rule;
    }
    editingRuleId = null;
  } else {
    const rule = { id: 'r' + Date.now(), color, label, rows };
    if (start) rule.start = toMMDD(start);
    if (end)   rule.end   = toMMDD(end);
    state.colorRules.push(rule);
  }
  saveState();
  renderColorRulesList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
  toggleAddRuleForm();
}

function deleteColorRule(id) {
  state.colorRules = (state.colorRules || []).filter(r => r.id !== id);
  saveState();
  renderColorRulesList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

// ══════════════════════════════════════════════════════
//  CONFERENCES
// ══════════════════════════════════════════════════════
let editingConfId = null;

function toggleAddConfForm() {
  const form = document.getElementById('addConfForm');
  const btn  = document.getElementById('addConfToggleBtn');
  const open = form.classList.toggle('open');
  btn.textContent = open ? '✕ Cancel' : '+ Add Conference';
  if (open) {
    document.getElementById('confName').value = '';
    document.getElementById('confStart').value = '';
    document.getElementById('confEnd').value = '';
  } else {
    editingConfId = null;
  }
}

function saveConference() {
  const name  = document.getElementById('confName').value.trim();
  const start = document.getElementById('confStart').value;
  const end   = document.getElementById('confEnd').value;
  if (!name)  { alert('Conference name is required.'); return; }
  if (!start) { alert('Start date is required.'); return; }
  const toMMDD = v => v.replace(/^\d{4}-/, '');
  if (!state.conferences) state.conferences = [];
  if (editingConfId) {
    const idx = state.conferences.findIndex(c => c.id === editingConfId);
    if (idx !== -1) {
      state.conferences[idx] = { id: editingConfId, name, start: toMMDD(start) };
      if (end) state.conferences[idx].end = toMMDD(end);
    }
    editingConfId = null;
  } else {
    const conf = { id: 'c' + Date.now(), name, start: toMMDD(start) };
    if (end) conf.end = toMMDD(end);
    state.conferences.push(conf);
  }
  saveState();
  renderConferenceList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
  toggleAddConfForm();
}

function deleteConference(id) {
  state.conferences = (state.conferences || []).filter(c => c.id !== id);
  saveState();
  renderConferenceList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

function editConference(id) {
  const conf = (state.conferences || []).find(c => c.id === id);
  if (!conf) return;
  editingConfId = id;
  const form = document.getElementById('addConfForm');
  const btn  = document.getElementById('addConfToggleBtn');
  form.classList.add('open');
  btn.textContent = '✕ Cancel';
  document.getElementById('confName').value  = conf.name;
  document.getElementById('confStart').value = conf.start ? mmddToInputValue(conf.start) : '';
  document.getElementById('confEnd').value   = conf.end   ? mmddToInputValue(conf.end)   : '';
}

function renderConferenceList() {
  const list = document.getElementById('conferenceList');
  if (!list) return;
  const confs = state.conferences || [];
  if (!confs.length) {
    list.innerHTML = '<p style="font-size:12px;color:var(--text-muted)">No conferences defined.</p>';
    return;
  }
  list.innerHTML = confs.map(c => {
    const fmtMD = md => {
      const d = resolveRuleDate(md);
      return d ? d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '?';
    };
    const dateStr = c.end
      ? `${fmtMD(c.start)} – ${fmtMD(c.end)}`
      : fmtMD(c.start);
    return `<div class="conf-card">
      <div class="conf-name">${c.name}</div>
      <div class="conf-dates">${dateStr}</div>
      <button class="card-edit-btn" onclick="editConference('${c.id}')">Edit</button>
      <span class="rm" onclick="deleteConference('${c.id}')" title="Delete">×</span>
    </div>`;
  }).join('');
}

// Build the conference header row data.
// Returns an array of { conf: obj|null, span: number } groups for the given columns.
// cols: array with { monDate, friDate } for weekly or { date } for daily.
function buildConferenceRow(cols, isWeekly) {
  const confs = state.conferences || [];
  if (!confs.length) {
    // All empty — one cell per column (handled individually)
    return cols.map(() => ({ conf: null, span: 1 }));
  }

  // For each column, find which conference (if any) covers it
  const colConf = cols.map(c => {
    const colStart = isWeekly ? c.monDate : c.date;
    const colEnd   = isWeekly ? c.friDate : c.date;
    for (const conf of confs) {
      const cs = resolveRuleDate(conf.start);
      const ce = conf.end ? resolveRuleDate(conf.end) : cs;
      if (colStart <= ce && colEnd >= cs) return conf;
    }
    return null;
  });

  // Group consecutive columns by conference identity
  const groups = [];
  let i = 0;
  while (i < colConf.length) {
    const current = colConf[i];
    let span = 1;
    // Only group if covered by the same conference object (same id)
    while (
      i + span < colConf.length &&
      colConf[i + span] !== null &&
      current !== null &&
      colConf[i + span].id === current.id
    ) {
      span++;
    }
    groups.push({ conf: current, span });
    i += span;
  }
  return groups;
}

// ══════════════════════════════════════════════════════
//  TABLE RENDERING
// ══════════════════════════════════════════════════════
function renderTable(type) {
  const isWeekly = type === 'weekly';
  const headEl = document.getElementById(isWeekly ? 'rotHead' : 'dailyHead');
  const bodyEl = document.getElementById(isWeekly ? 'rotBody' : 'dailyBody');
  const slotsKey = isWeekly ? 'rotationSlots' : 'dailyRotationSlots';

  // Build columns
  const cols = [];
  let prevMonth = -1, monthIdx = 0;

  if (isWeekly) {
    for (const w of getWeeks()) {
      const m = w.monDate.getMonth();
      if (m !== prevMonth) { prevMonth = m; monthIdx++; }
      cols.push({
        key: w.key,
        monDate: w.monDate,
        friDate: w.friDate,
        label: fmtShort(w.monDate),
        title: fmtRange(w.monDate, w.friDate),
        alt: monthIdx % 2 === 0,
        weekStart: false
      });
    }
  } else {
    for (const d of getWeekdays()) {
      const m = d.date.getMonth();
      if (m !== prevMonth) { prevMonth = m; monthIdx++; }
      cols.push({
        key: d.key,
        date: d.date,
        weekKey: d.weekKey,
        label: fmtShort(d.date),
        sublabel: DAY_ABBR[d.dow],
        title: d.date.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' }),
        alt: monthIdx % 2 === 0,
        weekStart: d.isMonday
      });
    }
  }

  // ── Conference header row ──
  const confGroups = buildConferenceRow(cols, isWeekly);
  let confHtml = '<tr class="conf-row">';
  confHtml += `<th class="s-corner-conf"></th>`;
  for (const g of confGroups) {
    const spanAttr = g.span > 1 ? ` colspan="${g.span}"` : '';
    if (g.conf) {
      confHtml += `<th${spanAttr}><span class="conf-tab" title="${g.conf.name}">${g.conf.name}</span></th>`;
    } else {
      // Emit one empty cell per column in this group (span=1 each, since null groups are individual)
      for (let s = 0; s < g.span; s++) {
        confHtml += `<th></th>`;
      }
    }
  }
  confHtml += '</tr>';

  // ── Date header row ──
  let hHtml = '<tr>';
  hHtml += `<th class="s-corner">${isWeekly ? 'Rotation' : 'Rotation'}</th>`;
  for (const c of cols) {
    const altCls = c.alt ? ' alt' : '';
    const wsCls = c.weekStart ? ' week-start' : '';
    const sub = c.sublabel ? `<small>${c.sublabel}</small>` : '';
    hHtml += `<th class="s-col-hdr${altCls}${wsCls}" title="${c.title}">${c.label}${sub}</th>`;
  }
  hHtml += '</tr>';

  headEl.innerHTML = confHtml + hHtml;

  // ── Body ──
  const slots = state[slotsKey];
  let bHtml = '';

  for (let ri = 0; ri < state.rotations.length; ri++) {
    const rotName = state.rotations[ri];
    const rowSlots = slots[ri] || {};
    bHtml += '<tr>';
    bHtml += `<td class="s-row-hdr" title="${rotName}">${rotName}</td>`;
    for (const c of cols) {
      const val = isWeekly
        ? (rowSlots[c.key] || '')
        : getDailyEffectiveValue(ri, c.key, c.weekKey);
      const isManual = !isWeekly && (state.dailyRotationSlots[ri] || {}).hasOwnProperty(c.key);
      const filledCls = val ? ' filled' : '';
      const manualCls = (!isWeekly && isManual && val) ? ' manual-override' : '';
      const wsCls = c.weekStart ? ' week-start' : '';
      const wkAttr = c.weekKey ? ` data-weekkey="${c.weekKey}"` : '';
      // Compute cell color from rules
      const dateA = isWeekly ? c.monDate : parseLocalDate(c.key);
      const dateB = isWeekly ? c.friDate : dateA;
      const color = getCellColor(ri, dateA, dateB);
      const colorCls = color ? ` cell-${color}` : '';
      bHtml += `<td class="s-cell${filledCls}${manualCls}${wsCls}${colorCls}" data-type="${type}" data-row="${ri}" data-col="${c.key}"${wkAttr} onclick="openPicker(this)">`;
      bHtml += `<div class="cell-val">${val}</div>`;
      bHtml += `</td>`;
    }
    bHtml += '</tr>';
  }

  bodyEl.innerHTML = bHtml;
}

// ══════════════════════════════════════════════════════
//  DAILY FALLBACK HELPER
// ══════════════════════════════════════════════════════
// Returns the value to display for a daily cell:
// manual override → weekly value → ''
function getDailyEffectiveValue(ri, dateKey, weekKey) {
  const manual = state.dailyRotationSlots[ri] || {};
  if (manual.hasOwnProperty(dateKey)) return manual[dateKey];
  return (state.rotationSlots[ri] || {})[weekKey] || '';
}

// After a weekly cell changes, refresh the 5 corresponding daily cells (if daily tab is rendered)
function refreshDailyCellsForWeek(ri, weekKey) {
  const dailyTab = document.getElementById('tab-daily');
  if (!dailyTab.classList.contains('active')) return;
  const cells = dailyTab.querySelectorAll(`.s-cell[data-row="${ri}"][data-weekkey="${weekKey}"]`);
  cells.forEach(cell => {
    const dateKey = cell.dataset.col;
    const val = getDailyEffectiveValue(ri, dateKey, weekKey);
    const isManual = (state.dailyRotationSlots[ri] || {}).hasOwnProperty(dateKey);
    cell.querySelector('.cell-val').textContent = val;
    cell.className = cell.className
      .replace(/\s*(filled|manual-override)/g, '')
      + (val ? ' filled' : '')
      + (isManual && val ? ' manual-override' : '');
  });
}

// ══════════════════════════════════════════════════════
//  CELL PICKER
// ══════════════════════════════════════════════════════
let pickerTarget = null;

function openPicker(cell) {
  pickerTarget = cell;
  const type = cell.dataset.type;
  const ri = parseInt(cell.dataset.row);
  const colKey = cell.dataset.col;
  const weekKey = cell.dataset.weekkey || '';

  // Show the effective current value as active
  const current = type === 'weekly'
    ? ((state.rotationSlots[ri] || {})[colKey] || '')
    : getDailyEffectiveValue(ri, colKey, weekKey);

  document.getElementById('pickerHeader').textContent = state.rotations[ri];

  const sorted = sortedResidents();
  const list = document.getElementById('pickerList');
  list.innerHTML = `<div class="picker-opt clear-opt" data-value="">— clear —</div>` +
    sorted.map(r =>
      `<div class="picker-opt${r.name === current ? ' active' : ''}" data-value="${r.name.replace(/"/g,'&quot;')}">${r.name}<span class="res-cls">${r.cls}</span></div>`
    ).join('');

  const picker = document.getElementById('cellPicker');
  picker.style.display = 'block';
  const rect = cell.getBoundingClientRect();
  const winW = window.innerWidth, winH = window.innerHeight;
  let top = rect.bottom + 2, left = rect.left;
  if (left + 160 > winW) left = winW - 165;
  if (top + 220 > winH) top = rect.top - 222;
  picker.style.top = top + 'px';
  picker.style.left = left + 'px';
}

function applyPicker(name) {
  if (!pickerTarget) return;
  const type = pickerTarget.dataset.type;
  const ri = parseInt(pickerTarget.dataset.row);
  const colKey = pickerTarget.dataset.col;
  const weekKey = pickerTarget.dataset.weekkey || '';

  if (type === 'weekly') {
    // Update weekly slot
    if (!state.rotationSlots[ri]) state.rotationSlots[ri] = {};
    if (name) state.rotationSlots[ri][colKey] = name;
    else delete state.rotationSlots[ri][colKey];

    // Update this weekly cell
    pickerTarget.querySelector('.cell-val').textContent = name;
    pickerTarget.className = pickerTarget.className.replace(' filled', '') + (name ? ' filled' : '');

    // Push change to any visible daily cells for this week (where no manual override exists)
    refreshDailyCellsForWeek(ri, colKey);

  } else {
    // Daily: store as manual override (or delete override to revert to weekly)
    if (!state.dailyRotationSlots[ri]) state.dailyRotationSlots[ri] = {};
    if (name) {
      state.dailyRotationSlots[ri][colKey] = name;
    } else {
      delete state.dailyRotationSlots[ri][colKey];
      // After clearing manual override, show the weekly fallback
      name = getDailyEffectiveValue(ri, colKey, weekKey);
    }

    const isManual = (state.dailyRotationSlots[ri] || {}).hasOwnProperty(colKey);
    pickerTarget.querySelector('.cell-val').textContent = name;
    pickerTarget.className = pickerTarget.className
      .replace(/\s*(filled|manual-override)/g, '')
      + (name ? ' filled' : '')
      + (isManual && name ? ' manual-override' : '');
  }

  saveState();
  closePicker();
}

function closePicker() {
  document.getElementById('cellPicker').style.display = 'none';
  pickerTarget = null;
}

// Picker option clicks — stop propagation so the outside-click handler never sees them
document.getElementById('cellPicker').addEventListener('click', e => {
  e.stopPropagation();
  const opt = e.target.closest('.picker-opt');
  if (opt) applyPicker(opt.dataset.value);
});

// Close picker when clicking outside (won't fire for clicks inside picker due to stopPropagation above)
document.addEventListener('click', e => {
  const picker = document.getElementById('cellPicker');
  if (picker.style.display !== 'none' && !e.target.closest('.s-cell')) {
    closePicker();
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePicker(); });

// ══════════════════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════════════════
function switchTab(name, btn) {
  closePicker();
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  btn.classList.add('active');
  if (name === 'daily') renderTable('daily');
  if (name === 'settings') {
    renderResidentsList();
    renderRotationsList();
    renderColorRulesList();
    renderConferenceList();
  }
}

// ══════════════════════════════════════════════════════
//  YEAR SELECTOR
// ══════════════════════════════════════════════════════
function buildYearSelector() {
  const sel = document.getElementById('yearSelect');
  sel.innerHTML = '';
  for (let y = 2025; y <= 2032; y++) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = `${y}–${y+1}`;
    if (y === state.academicYearStart) opt.selected = true;
    sel.appendChild(opt);
  }
  sel.onchange = () => {
    state.academicYearStart = parseInt(sel.value);
    saveState(); renderTable('weekly');
    if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
  };
}

// ══════════════════════════════════════════════════════
//  SETTINGS — RESIDENTS
// ══════════════════════════════════════════════════════
function renderResidentsList() {
  document.getElementById('residentsList').innerHTML = state.residents.map(r =>
    `<div class="tag">${r.name} <span style="font-size:10px;color:var(--text-muted);margin-left:2px">(${r.cls})</span><span class="rm" onclick="removeResident('${r.name.replace(/'/g,"\\'")}')">×</span></div>`
  ).join('');
}
function addResident() {
  const inp = document.getElementById('newResidentInput');
  const clsSel = document.getElementById('newResidentClass');
  const name = inp.value.trim(); if (!name) return;
  const cls = clsSel.value;
  if (state.residents.some(r => r.name === name)) { alert('Already exists.'); return; }
  state.residents.push({ name, cls }); saveState(); inp.value = '';
  renderResidentsList();
}
function removeResident(name) {
  if (!confirm(`Remove ${name}? They will be cleared from all assignments.`)) return;
  state.residents = state.residents.filter(r => r.name !== name);
  // Remove from all slots
  for (const slotsKey of ['rotationSlots','dailyRotationSlots']) {
    for (const rowSlots of Object.values(state[slotsKey])) {
      for (const [k, v] of Object.entries(rowSlots)) if (v === name) delete rowSlots[k];
    }
  }
  saveState(); renderResidentsList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

// ══════════════════════════════════════════════════════
//  SETTINGS — ROTATIONS
// ══════════════════════════════════════════════════════
function renderRotationsList() {
  document.getElementById('rotationsList').innerHTML = state.rotations.map((r, i) =>
    `<div class="tag" draggable="true"
       ondragstart="onRotDragStart(event,${i})"
       ondragend="onRotDragEnd(event)"
       ondragover="onRotDragOver(event,${i})"
       ondragleave="onRotDragLeave(event)"
       ondrop="onRotDrop(event,${i})">
      <span class="drag-handle">⠿</span>${r}<span class="rm" onclick="removeRotation(${i})">×</span>
    </div>`
  ).join('');
}
function addRotation() {
  const inp = document.getElementById('newRotationInput');
  const name = inp.value.trim(); if (!name) return;
  state.rotations.push(name); saveState(); inp.value = '';
  renderRotationsList(); renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}
function removeRotation(idx) {
  const name = state.rotations[idx];
  if (!confirm(`Remove row "${name}" (row ${idx+1})? Its assignments will be cleared.`)) return;
  state.rotations.splice(idx, 1);
  // Rebuild slot indices: shift everything above idx down by 1
  for (const slotsKey of ['rotationSlots','dailyRotationSlots']) {
    const newSlots = {};
    for (const [k, v] of Object.entries(state[slotsKey])) {
      const ki = parseInt(k);
      if (ki < idx) newSlots[ki] = v;
      else if (ki > idx) newSlots[ki - 1] = v;
      // ki === idx is dropped
    }
    state[slotsKey] = newSlots;
  }
  saveState(); renderRotationsList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

// ── Rotation drag-and-drop ──
let rotDragSrcIdx = null;

function onRotDragStart(e, idx) {
  rotDragSrcIdx = idx;
  e.dataTransfer.effectAllowed = 'move';
  e.currentTarget.style.opacity = '0.5';
}
function onRotDragEnd(e) {
  e.currentTarget.style.opacity = '';
  document.querySelectorAll('#rotationsList .tag').forEach(t => t.classList.remove('drag-over'));
}
function onRotDragOver(e, idx) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('#rotationsList .tag').forEach(t => t.classList.remove('drag-over'));
  e.currentTarget.classList.add('drag-over');
}
function onRotDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}
function onRotDrop(e, toIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (rotDragSrcIdx === null || rotDragSrcIdx === toIdx) { rotDragSrcIdx = null; return; }
  reorderRotations(rotDragSrcIdx, toIdx);
  rotDragSrcIdx = null;
}

function reorderRotations(from, to) {
  const n = state.rotations.length;
  const order = Array.from({length: n}, (_, i) => i);
  const [moved] = order.splice(from, 1);
  order.splice(to, 0, moved);
  // order[newIdx] = oldIdx → build reverse map oldIdx → newIdx
  const oldToNew = {};
  order.forEach((oldIdx, newIdx) => { oldToNew[oldIdx] = newIdx; });

  state.rotations = order.map(i => state.rotations[i]);

  for (const slotsKey of ['rotationSlots', 'dailyRotationSlots']) {
    const remapped = {};
    for (const [k, v] of Object.entries(state[slotsKey])) {
      const ni = oldToNew[parseInt(k)];
      if (ni !== undefined) remapped[ni] = v;
    }
    state[slotsKey] = remapped;
  }

  state.colorRules = (state.colorRules || []).map(rule => {
    if (rule.rows === 'all') return rule;
    return { ...rule, rows: rule.rows.map(i => oldToNew[i] !== undefined ? oldToNew[i] : i) };
  });

  saveState();
  renderRotationsList();
  renderColorRulesList();
  renderTable('weekly');
  if (document.getElementById('tab-daily').classList.contains('active')) renderTable('daily');
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
function initAll() {
  buildYearSelector();
  renderTable('weekly');
}

loadState();
initAll();
