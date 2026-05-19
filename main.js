// Clock
function tick() {
  const now = new Date();
  const t = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  document.getElementById('small-clock').textContent = t;
  document.getElementById('big-clock').textContent = t;
}
tick();
setInterval(tick, 10000);

// Phone open/close
const overlay = document.getElementById('app-overlay');
document.getElementById('phone-small').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('back-btn').addEventListener('click', () => overlay.classList.remove('open'));

// Tab switching
document.querySelectorAll('.bn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.bn[data-tab]').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    btn.classList.add('active');
  });
});

// Modal open
const modalOv = document.getElementById('modal-ov');
const modalSheet = document.getElementById('modal-sheet');

function openModal() {
  document.getElementById('t-from').value = '';
  document.getElementById('t-to').value = '';
  modalOv.classList.add('open');
  setTimeout(() => document.getElementById('t-from').focus(), 300);
}

document.getElementById('bn-plus').addEventListener('click', openModal);
document.getElementById('open-modal').addEventListener('click', openModal);

// Modal close
function closeModal() {
  modalSheet.style.animation = 'slideDown .25s ease forwards';
  setTimeout(() => {
    modalOv.classList.remove('open');
    modalSheet.style.animation = '';
  }, 230);
}
document.getElementById('btn-cancel').addEventListener('click', closeModal);
modalOv.addEventListener('click', e => { if (e.target === modalOv) closeModal(); });

const sd = document.createElement('style');
sd.textContent = '@keyframes slideDown{from{transform:translateY(0);opacity:1}to{transform:translateY(100%);opacity:0}}';
document.head.appendChild(sd);

// Time tabs
let timeMode = 'now';
document.querySelectorAll('.ttab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ttab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timeMode = btn.dataset.v;
    document.getElementById('t-time').classList.toggle('hidden', timeMode !== 'later');
  });
});

// Passenger
let pax = 1;
document.getElementById('pax-m').addEventListener('click', () => { if (pax > 1) { pax--; document.getElementById('pax-v').textContent = pax; } });
document.getElementById('pax-p').addEventListener('click', () => { if (pax < 4) { pax++; document.getElementById('pax-v').textContent = pax; } });

// Vehicle
let selPts = 10;
document.querySelectorAll('.vt').forEach(v => {
  v.addEventListener('click', () => {
    document.querySelectorAll('.vt').forEach(x => x.classList.remove('active'));
    v.classList.add('active');
    selPts = parseInt(v.dataset.pts);
  });
});

// Create trip
document.getElementById('btn-create').addEventListener('click', () => {
  const from = document.getElementById('t-from').value.trim();
  const to = document.getElementById('t-to').value.trim();
  if (!from || !to) {
    if (!from) shake(document.getElementById('t-from'));
    if (!to) shake(document.getElementById('t-to'));
    return;
  }
  const time = timeMode === 'now' ? 'Şimdi' : document.getElementById('t-time').value;
  addTrip(from, to, time, selPts);
  closeModal();
  setTimeout(() => toast('Yolculuk oluşturuldu · −' + selPts + ' puan'), 300);
});

function addTrip(from, to, time, pts) {
  const list = document.getElementById('trips-list');
  const row = document.createElement('div');
  row.className = 'trip-row';
  row.style.animation = 'fadeIn .3s ease';
  row.innerHTML = `<div class="tr-ic">🚗</div><div class="tr-info"><span class="tr-r">${esc(from)} → ${esc(to)}</span><span class="tr-d">Bugün · ${time}</span></div><span class="tr-p">−${pts} puan</span>`;
  list.insertBefore(row, list.firstChild);
  const fs = document.createElement('style');
  fs.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(fs);
}

function toast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('t-msg').textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function shake(el) {
  el.style.animation = 'shk .3s ease';
  const s = document.createElement('style');
  s.textContent = '@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}';
  document.head.appendChild(s);
  setTimeout(() => el.style.animation = '', 300);
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
