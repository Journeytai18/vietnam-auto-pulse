const brands = [
  { name: 'VinFast', units: '115,916 · H1 2026', share: 35.3, growth: '+72.0%', color: '#2e72ed', logo: 'VF' },
  { name: 'Toyota', units: '35,410 · H1 2026', share: 10.8, growth: '+20.9%', color: '#e34444', logo: 'T' },
  { name: 'Hyundai', units: '25,069 · H1 2026', share: 7.6, growth: '+3.6%', color: '#3674b8', logo: 'H' },
  { name: 'Mitsubishi', units: '21,617 · H1 2026', share: 6.6, growth: '+36.9%', color: '#d84646', logo: 'M' },
  { name: 'Ford', units: '21,232 · H1 2026', share: 6.5, growth: '−2.2%', color: '#2363aa', logo: 'F' },
  { name: 'Kia', units: '15,732 · H1 2026', share: 4.8, growth: '—', color: '#343b48', logo: 'K' },
  { name: 'Mazda', units: '15,298 · H1 2026', share: 4.7, growth: '—', color: '#7e2035', logo: 'MZ' }
];

let expanded = false;
const list = document.querySelector('#brandList');
function renderBrands() {
  list.innerHTML = brands.slice(0, expanded ? brands.length : 5).map(b => `
    <div class="brand-row" data-search="${b.name.toLowerCase()}">
      <span class="brand-logo" style="background:${b.color}">${b.logo}</span>
      <div class="brand-data"><strong>${b.name}</strong><small>${b.units}</small><div class="bar"><i style="width:${Math.min(b.share * 3.4,100)}%"></i></div></div>
      <div class="brand-share"><strong>${b.share}%</strong><small class="${b.growth.startsWith('−') ? 'down' : 'up'}">${b.growth}</small></div>
    </div>`).join('');
  document.querySelector('#viewAllBtn').innerHTML = expanded ? 'Show top brands <span>↑</span>' : 'View all brands <span>→</span>';
}
renderBrands();

const toast = document.querySelector('#toast');
function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2300); }

document.querySelector('#viewAllBtn').addEventListener('click', () => { expanded = !expanded; renderBrands(); });
document.querySelector('#menuBtn')?.addEventListener('click', () => document.querySelector('.sidebar')?.classList.toggle('open'));
document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active')); item.classList.add('active');
  document.querySelector('.sidebar').classList.remove('open');
}));
document.querySelector('#subscribeBtn')?.addEventListener('click', () => openModal('<h3>Monday market brief</h3><p>Get the newest sales, policy, and powertrain signals with direct source links.</p><input id="emailInput" type="email" placeholder="you@company.com"><button class="modal-action" id="confirmSubscribe">Subscribe</button>'));
document.querySelector('#exportBtn').addEventListener('click', () => { window.print(); notify('Print dialog opened — save as PDF to export.'); });
document.querySelector('#segmentSelect').addEventListener('change', e => notify(`${e.target.value} view is ready for a live data connection.`));
document.querySelector('#searchInput').addEventListener('input', e => {
  const term = e.target.value.toLowerCase().trim();
  if (term && !expanded) { expanded = true; renderBrands(); }
  document.querySelectorAll('.brand-row').forEach(row => row.style.display = row.dataset.search.includes(term) ? 'grid' : 'none');
});
document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.querySelector('#searchInput').focus(); } });

const modal = document.querySelector('#modalBackdrop');
const modalContent = document.querySelector('#modalContent');
function openModal(html) { modalContent.innerHTML = html; modal.classList.add('show'); }
function closeModal() { modal.classList.remove('show'); }
document.querySelector('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modalContent.addEventListener('click', e => {
  if (e.target.id !== 'confirmSubscribe') return;
  const email = document.querySelector('#emailInput').value;
  if (!email.includes('@')) return notify('Enter a valid email address.');
  closeModal(); notify(`Subscribed: ${email}`);
});

const popover = document.querySelector('#popover');
function showMenu(anchor, actions) {
  const box = anchor.getBoundingClientRect();
  popover.innerHTML = actions.map(action => `<button data-action="${action}">${action}</button>`).join('');
  popover.style.top = `${box.bottom + 6}px`;
  popover.style.left = `${Math.max(10, box.right - 190)}px`;
  popover.classList.add('show');
}
document.querySelector('#notificationBtn').addEventListener('click', e => showMenu(e.currentTarget, ['July sales report published', 'Forecast model updated', 'New EV policy source']));
document.querySelector('#dateBtn').addEventListener('click', e => showMenu(e.currentTarget, ['Latest · 21 Aug 2026', 'July 2026', 'H1 2026']));
document.querySelector('#profileBtn')?.addEventListener('click', e => showMenu(e.currentTarget, ['Profile settings', 'Dashboard preferences', 'Sign out']));
document.querySelectorAll('.more').forEach(button => button.addEventListener('click', e => showMenu(e.currentTarget, ['Download card data', 'Copy source link', 'Create alert'])));
popover.addEventListener('click', e => {
  if (!e.target.dataset.action) return;
  if (e.target.dataset.action.includes('2026')) document.querySelector('#dateBtn em').textContent = e.target.dataset.action;
  notify(`${e.target.dataset.action} selected.`); popover.classList.remove('show');
});

document.querySelectorAll('[data-motor]').forEach(button => button.addEventListener('click', () => openModal(`<h3>${button.dataset.motor}</h3><p>This technology view compares adoption, operating economics, infrastructure needs, and five-year market direction. Figures remain clearly separated into reported data and AutoPulse estimates.</p><button class="modal-action" id="modalDone">Done</button>`)));
document.querySelectorAll('.scenario').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.scenario').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); notify(`${button.dataset.scenario} selected. The forecast assumptions are shown below.`);
}));
modalContent.addEventListener('click', e => { if (e.target.id === 'modalDone') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); popover.classList.remove('show'); } });

const topicButtons = document.querySelectorAll('.topic-nav button');
topicButtons.forEach(button => button.addEventListener('click', () => {
  const target = document.getElementById(button.dataset.topic);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
const topicTargets = [...topicButtons].map(button => document.getElementById(button.dataset.topic)).filter(Boolean);
const topicObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  topicButtons.forEach(button => button.classList.toggle('active', button.dataset.topic === visible.target.id));
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .1, .4] });
topicTargets.forEach(target => topicObserver.observe(target));
