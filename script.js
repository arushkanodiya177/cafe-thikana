/* ============================================================
   CAFE THIKANA – SCRIPT.JS
   Pure vanilla JS, localStorage persistence
   ============================================================ */

// ---------- UTILITIES ----------
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

const toast = (msg) => {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
};

// ---------- DEMO DATA SEED ----------
const DEFAULT_MENU = [
  { id: 'm1',  name: 'Paneer Tikka',           price: 289, cat: 'Starters',            veg: true,  desc: 'Char-grilled cottage cheese with mint chutney',        img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Paneer+Tikka', available: true },
  { id: 'm2',  name: 'Chicken Malai Tikka',    price: 349, cat: 'Starters',            veg: false, desc: 'Creamy chicken skewers, mildly spiced',                 img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Chicken+Tikka', available: true },
  { id: 'm3',  name: 'Butter Chicken',         price: 429, cat: 'Indian Main Course',  veg: false, desc: 'Rich tomato-cream curry, tender chicken',               img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Butter+Chicken', available: true },
  { id: 'm4',  name: 'Dal Makhani',            price: 299, cat: 'Indian Main Course',  veg: true,  desc: 'Slow-cooked black lentils with butter',                 img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Dal+Makhani', available: true },
  { id: 'm5',  name: 'Veg Hakka Noodles',      price: 249, cat: 'Chinese',             veg: true,  desc: 'Wok-tossed noodles with fresh vegetables',              img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Hakka+Noodles', available: true },
  { id: 'm6',  name: 'Chicken Manchurian',     price: 319, cat: 'Chinese',             veg: false, desc: 'Crispy chicken in spicy Manchurian sauce',              img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Chicken+Manchurian', available: true },
  { id: 'm7',  name: 'Margherita Pizza',       price: 349, cat: 'Pizza and Pasta',     veg: true,  desc: 'Classic mozzarella, basil, tomato',                     img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Margherita', available: true },
  { id: 'm8',  name: 'Alfredo Pasta',          price: 299, cat: 'Pizza and Pasta',     veg: true,  desc: 'Creamy Alfredo with herbs',                             img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Alfredo+Pasta', available: true },
  { id: 'm9',  name: 'French Fries',           price: 129, cat: 'Snacks',              veg: true,  desc: 'Crispy golden fries with dip',                          img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=French+Fries', available: true },
  { id: 'm10', name: 'Veg Spring Rolls',       price: 169, cat: 'Snacks',              veg: true,  desc: 'Crispy rolls with veggie filling',                      img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Spring+Rolls', available: true },
  { id: 'm11', name: 'Masala Chai',            price: 79,  cat: 'Beverages',           veg: true,  desc: 'Aromatic Indian spiced tea',                            img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Masala+Chai', available: true },
  { id: 'm12', name: 'Cold Coffee',            price: 129, cat: 'Beverages',           veg: true,  desc: 'Chilled coffee with cream',                             img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Cold+Coffee', available: true },
  { id: 'm13', name: 'Gulab Jamun',            price: 119, cat: 'Desserts',            veg: true,  desc: 'Soft dumplings in rose syrup',                          img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Gulab+Jamun', available: true },
  { id: 'm14', name: 'Chocolate Brownie',      price: 159, cat: 'Desserts',            veg: true,  desc: 'Warm brownie with vanilla ice cream',                   img: 'https://placehold.co/400x300/1C1B1A/C6A15B?text=Brownie', available: true },
];

const DEFAULT_REVIEWS = [
  { id: 'r1', name: 'Amit Sharma',   rating: 5, text: 'Great food and lovely ambience. The family loved it!',           approved: true },
  { id: 'r2', name: 'Priya Verma',   rating: 4, text: 'Delicious food and warm hospitality. Will visit again.',          approved: true },
  { id: 'r3', name: 'Rahul Singh',   rating: 5, text: 'Perfect place for family dinner. The interiors are beautiful.',   approved: true },
];

const DEFAULT_TABLES = [
  { id: 'T01', seats: 4, status: 'available' },
  { id: 'T02', seats: 4, status: 'available' },
  { id: 'T03', seats: 2, status: 'available' },
  { id: 'T04', seats: 6, status: 'available' },
  { id: 'T05', seats: 2, status: 'available' },
  { id: 'T06', seats: 8, status: 'available' },
];

// ---------- STORAGE HELPERS ----------
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('ct_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem('ct_' + key, JSON.stringify(val));
    } catch (e) {}
  }
};

// ---------- INIT DATA ----------
let menuData        = store.get('menu', DEFAULT_MENU);
let reviewsData     = store.get('reviews', DEFAULT_REVIEWS);
let ordersData      = store.get('orders', []);
let reservationsData= store.get('reservations', []);
let tablesData      = store.get('tables', DEFAULT_TABLES);
let cartData        = store.get('cart', []);
let settingsData    = store.get('settings', { name: 'Cafe Thikana', phone: '09399799980', email: 'cafethikana2.0@gmail.com', tax: 5 });

// persist on first load
store.set('menu', menuData);
store.set('reviews', reviewsData);
store.set('tables', tablesData);

// ---------- HERO FADE ----------
setTimeout(() => {
  const loader = $('#loader');
  if (loader) loader.classList.add('hidden');
}, 1200);

// ---------- NAVBAR SCROLL ----------
const navbar = $('#navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  const backTop = $('#backTopBtn');
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
});

// ---------- MOBILE MENU ----------
$('#hamburgerBtn')?.addEventListener('click', () => $('#mobileMenu')?.classList.add('open'));
$('#closeMenuBtn')?.addEventListener('click', () => $('#mobileMenu')?.classList.remove('open'));
$$('.mobile-link').forEach(l => l.addEventListener('click', () => $('#mobileMenu')?.classList.remove('open')));

// ---------- BACK TO TOP ----------
$('#backTopBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('active');
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// ---------- MENU RENDER ----------
let activeMenuCat   = 'all';
let menuSearchTerm  = '';

function renderMenu() {
  const grid = $('#menuGrid');
  if (!grid) return;

  const filtered = menuData.filter(item => {
    const catOk = activeMenuCat === 'all' || item.cat === activeMenuCat;
    const searchOk = !menuSearchTerm || item.name.toLowerCase().includes(menuSearchTerm.toLowerCase());
    return catOk && searchOk && item.available !== false;
  });

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px;">No items found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/400x300/1C1B1A/C6A15B?text=Food'">
      <div class="menu-card-body">
        <h4>
          <span><span class="${item.veg ? 'badge-veg' : 'badge-nonveg'}"></span>${item.name}</span>
          <span class="price">₹${item.price}</span>
        </h4>
        <p>${item.desc}</p>
        <button class="add-cart" data-id="${item.id}"><i class="fas fa-plus"></i> Add to Cart</button>
      </div>
    </div>
  `).join('');

  $$('.add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id);
    });
  });
}

// menu filters
$$('#menuFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#menuFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMenuCat = btn.dataset.cat;
    renderMenu();
  });
});

$('#menuSearch')?.addEventListener('input', (e) => {
  menuSearchTerm = e.target.value;
  renderMenu();
});

// ---------- CART ----------
function addToCart(id) {
  const item = menuData.find(i => i.id === id);
  if (!item) return;

  const existing = cartData.find(c => c.id === id);
  if (existing) existing.qty += 1;
  else cartData.push({ id, name: item.name, price: item.price, qty: 1 });

  store.set('cart', cartData);
  updateCartUI();
  toast(`${item.name} added to cart`);
  $('#cartModal')?.classList.add('open');
}

function updateCartUI() {
  const container = $('#cartItems');
  if (!container) return;

  if (!cartData.length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Your cart is empty.</p>';
    $('#cartTotal').textContent = '₹0';
    return;
  }

  container.innerHTML = cartData.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <div class="qty-controls">
        <button class="qty-minus" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button class="qty-plus"  data-id="${item.id}">+</button>
        <span style="color:var(--gold);min-width:60px;text-align:right;">₹${item.price * item.qty}</span>
      </div>
    </div>
  `).join('');

  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  $('#cartTotal').textContent = `₹${total}`;

  $$('.qty-plus').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, 1)));
  $$('.qty-minus').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
}

function changeQty(id, delta) {
  const idx = cartData.findIndex(c => c.id === id);
  if (idx === -1) return;

  cartData[idx].qty += delta;
  if (cartData[idx].qty <= 0) cartData.splice(idx, 1);

  store.set('cart', cartData);
  updateCartUI();
}

$('#closeCartBtn')?.addEventListener('click', () => $('#cartModal')?.classList.remove('open'));

$('#placeOrderBtn')?.addEventListener('click', () => {
  if (!cartData.length) {
    toast('Your cart is empty.');
    return;
  }

  const tableParam = new URLSearchParams(window.location.search).get('table') || 'T01';
  const total      = cartData.reduce((s, i) => s + i.price * i.qty, 0);

  const newOrder = {
    id: 'ORD' + Date.now().toString().slice(-6),
    table: tableParam,
    items: cartData.map(i => ({ ...i })),
    total,
    status: 'New',
    time: new Date().toLocaleString(),
    payment: 'Pending'
  };

  ordersData.unshift(newOrder);
  store.set('orders', ordersData);

  cartData = [];
  store.set('cart', cartData);

  updateCartUI();
  $('#cartModal')?.classList.remove('open');
  toast('Order placed! (Demo)');

  if ($('#adminSection')?.classList.contains('open')) renderAdminDashboard();
});

// ---------- GALLERY ----------
const galleryItems = [
  { src: 'interior1.jpg', cat: 'Interiors',    label: 'Private Dining' },
  { src: 'interior2.jpg', cat: 'Interiors',    label: 'Premium Seating' },
  { src: 'birthday.jpg',  cat: 'Celebrations', label: 'Birthday Setup' },
  { src: 'interior1.jpg', cat: 'Dining',       label: 'Family Dining' },
  { src: 'interior2.jpg', cat: 'Dining',       label: 'Elegant Ambience' },
  { src: 'birthday.jpg',  cat: 'Celebrations', label: 'Anniversary Decor' },
];

let galleryFilter = 'all';

function renderGallery() {
  const grid = $('#galleryGrid');
  if (!grid) return;

  const filtered = galleryItems.filter(i => galleryFilter === 'all' || i.cat === galleryFilter);

  grid.innerHTML = filtered.map(i => `
    <div class="gallery-item" data-src="${i.src}">
      <img src="${i.src}" alt="${i.label}" onerror="this.src='https://placehold.co/600x400/1C1B1A/C6A15B?text=Gallery'">
      <div class="overlay">${i.label}</div>
    </div>
  `).join('');

  $$('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const lightboxImg = $('#lightboxImg');
      if (lightboxImg) lightboxImg.src = el.dataset.src;
      $('#lightbox')?.classList.add('open');
    });
  });
}

$$('[data-gcat]').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('[data-gcat]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    galleryFilter = btn.dataset.gcat;
    renderGallery();
  });
});

$('#closeLightbox')?.addEventListener('click', () => $('#lightbox')?.classList.remove('open'));
$('#lightbox')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) $('#lightbox')?.classList.remove('open');
});

// ---------- REVIEWS ----------
function renderReviews() {
  const carousel = $('#reviewCarousel');
  if (!carousel) return;

  const approved = reviewsData.filter(r => r.approved !== false);

  carousel.innerHTML = approved.map(r => `
    <div class="review-card">
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p>"${r.text}"</p>
      <h5>${r.name}</h5>
      <small>Sample review</small>
    </div>
  `).join('');
}

// review modal
let selectedRating = 5;

$$('#starInput span').forEach(s => {
  s.addEventListener('click', () => {
    selectedRating = parseInt(s.dataset.star);
    $$('#starInput span').forEach(st =>
      st.classList.toggle('active', parseInt(st.dataset.star) <= selectedRating)
    );
  });
});

$('#writeReviewBtn')?.addEventListener('click', () => {
  const modal = $('#reviewModal');
  if (modal) modal.style.display = 'flex';
  $('#revName').value = '';
  $('#revText').value = '';
  selectedRating = 5;
  $$('#starInput span').forEach(st =>
    st.classList.toggle('active', parseInt(st.dataset.star) <= 5)
  );
});

$('#cancelReviewBtn')?.addEventListener('click', () => {
  const modal = $('#reviewModal');
  if (modal) modal.style.display = 'none';
});

$('#submitReviewBtn')?.addEventListener('click', () => {
  const name = $('#revName').value.trim();
  const text = $('#revText').value.trim();

  if (!name || !text) {
    toast('Please fill name and review.');
    return;
  }

  const newReview = {
    id: 'r' + Date.now(),
    name,
    rating: selectedRating,
    text,
    approved: false
  };

  reviewsData.push(newReview);
  store.set('reviews', reviewsData);
  renderReviews();

  const modal = $('#reviewModal');
  if (modal) modal.style.display = 'none';
  toast('Review submitted for approval. Thank you!');
});

// google review button placeholder
$('#googleReviewBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  toast('Configure Google Place ID in code to enable.');
});

// ---------- RESERVATION ----------
$('#reservationForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name   = $('#resName').value.trim();
  const phone  = $('#resPhone').value.trim();
  const date   = $('#resDate').value;
  const time   = $('#resTime').value;
  const guests = $('#resGuests').value;
  const notes  = $('#resNotes').value.trim();

  if (!name || !phone || !date || !time) {
    toast('Please fill all required fields.');
    return;
  }

  const reservation = {
    id: 'RES' + Date.now(),
    name, phone, date, time, guests, notes,
    status: 'Pending',
    created: new Date().toLocaleString()
  };

  reservationsData.unshift(reservation);
  store.set('reservations', reservationsData);

  const msg = $('#reservationMsg');
  if (msg) {
    msg.innerHTML = `
      <div style="background:rgba(198,161,91,0.1);border:1px solid var(--gold);padding:16px;border-radius:10px;color:var(--gold);">
        <i class="fas fa-check-circle"></i> Reservation request received! We will contact you shortly.<br>
        <a href="https://wa.me/919399799980?text=Hi%2C%20I%27d%20like%20to%20confirm%20my%20reservation%20(${encodeURIComponent(name)}%20%7C%20${date}%20%7C%20${time})"
           target="_blank"
           style="color:var(--gold);text-decoration:underline;margin-top:8px;display:inline-block;">
          Enquire on WhatsApp
        </a>
      </div>`;
  }

  $('#reservationForm').reset();
  toast('Reservation request sent!');
});

// ---------- ADMIN DASHBOARD ----------
let revenueChartInstance, topItemsChartInstance, dailyChartInstance, paymentChartInstance;

function renderAdminDashboard() {
  // cards
  const today        = new Date().toLocaleDateString();
  const todayOrders  = ordersData.filter(o => o.time && o.time.startsWith(today));
  const totalRevenue = ordersData.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders= ordersData.filter(o => o.status === 'New' || o.status === 'Preparing').length;
  const completedOrders = ordersData.filter(o => o.status === 'Served').length;
  const activeTables = tablesData.filter(t => t.status === 'occupied').length;
  const todayRes     = reservationsData.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  const dashCards = $('#dashCards');
  if (dashCards) {
    dashCards.innerHTML = `
      <div class="dash-card"><h4>Today's Orders</h4><div class="value">${todayOrders.length}</div></div>
      <div class="dash-card"><h4>Total Revenue</h4><div class="value">₹${totalRevenue.toLocaleString()}</div></div>
      <div class="dash-card"><h4>Pending Orders</h4><div class="value">${pendingOrders}</div></div>
      <div class="dash-card"><h4>Completed</h4><div class="value">${completedOrders}</div></div>
      <div class="dash-card"><h4>Active Tables</h4><div class="value">${activeTables}</div></div>
      <div class="dash-card"><h4>Today's Reservations</h4><div class="value">${todayRes}</div></div>
    `;
  }

  // recent orders
  const recentTbody = $('#recentOrdersTable tbody');
  if (recentTbody) {
    recentTbody.innerHTML = ordersData.slice(0, 5).map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.table}</td>
        <td>${o.items.map(i => i.name + ' x' + i.qty).join(', ')}</td>
        <td>₹${o.total}</td>
        <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No orders yet</td></tr>';
  }

  renderCharts();
  renderAllOrders();
  renderKitchenOrders();
  renderAdminTables();
  renderQR();
  renderMenuMgmt();
  renderCustomers();
  renderAdminReviews();
}

function renderCharts() {
  // destroy old charts
  if (revenueChartInstance)  revenueChartInstance.destroy();
  if (topItemsChartInstance) topItemsChartInstance.destroy();
  if (dailyChartInstance)    dailyChartInstance.destroy();
  if (paymentChartInstance)  paymentChartInstance.destroy();

  // Revenue chart
  const revCtx = $('#revenueChart');
  if (revCtx) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const data = days.map(() => Math.floor(Math.random() * 3000) + 1000);

    revenueChartInstance = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: 'Revenue (₹)',
          data,
          borderColor: '#C6A15B',
          backgroundColor: 'rgba(198,161,91,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#b8b0a8' } } },
        scales: {
          x: { ticks: { color: '#b8b0a8' } },
          y: { ticks: { color: '#b8b0a8' } }
        }
      }
    });
  }

  // Top items
  const topCtx = $('#topItemsChart');
  if (topCtx) {
    const items = menuData.slice(0, 5);
    topItemsChartInstance = new Chart(topCtx, {
      type: 'bar',
      data: {
        labels: items.map(i => i.name),
        datasets: [{
          label: 'Orders',
          data: items.map(() => Math.floor(Math.random() * 40) + 5),
          backgroundColor: '#A51E24'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#b8b0a8' } } },
        scales: {
          x: { ticks: { color: '#b8b0a8', font: { size: 9 } } },
          y: { ticks: { color: '#b8b0a8' } }
        }
      }
    });
  }

  // Daily revenue
  const dailyCtx = $('#dailyRevenueChart');
  if (dailyCtx) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    dailyChartInstance = new Chart(dailyCtx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Revenue (₹)',
          data: days.map(() => Math.floor(Math.random() * 5000) + 1000),
          backgroundColor: '#C6A15B'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#b8b0a8' } } },
        scales: {
          x: { ticks: { color: '#b8b0a8' } },
          y: { ticks: { color: '#b8b0a8' } }
        }
      }
    });
  }

  // Payment distribution
  const payCtx = $('#paymentDistChart');
  if (payCtx) {
    paymentChartInstance = new Chart(payCtx, {
      type: 'doughnut',
      data: {
        labels: ['Cash', 'UPI', 'Card'],
        datasets: [{ data: [40, 45, 15], backgroundColor: ['#C6A15B', '#A51E24', '#2e7d32'] }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#b8b0a8' } } }
      }
    });
  }
}

// ---------- ORDERS PANEL ----------
function renderAllOrders() {
  const tbody = $('#allOrdersTable tbody');
  if (!tbody) return;

  tbody.innerHTML = ordersData.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.table}</td>
      <td>${o.items.map(i => i.name + ' x' + i.qty).join(', ')}</td>
      <td>₹${o.total}</td>
      <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Preparing')">Prepare</button>
        <button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Ready')">Ready</button>
        <button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Served')">Served</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No orders yet</td></tr>';
}

window.updateOrderStatus = function(orderId, status) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;

  order.status = status;
  store.set('orders', ordersData);

  renderAdminDashboard();
  toast(`Order ${orderId} → ${status}`);
};

// ---------- KITCHEN PANEL ----------
function renderKitchenOrders() {
  const container = $('#kitchenOrders');
  if (!container) return;

  const activeOrders = ordersData.filter(o => o.status !== 'Served');

  if (!activeOrders.length) {
    container.innerHTML = '<p style="color:var(--text-muted);">No active orders.</p>';
    return;
  }

  container.innerHTML = activeOrders.map(o => `
    <div class="list-item">
      <div>
        <strong>${o.id}</strong> · Table ${o.table} · <span class="meta">${o.time}</span>
        <div style="margin-top:6px;font-size:0.85rem;">${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span>
        ${o.status === 'New' ? `<button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Preparing')">Preparing</button>` : ''}
        ${o.status === 'Preparing' ? `<button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Ready')">Ready</button>` : ''}
        ${o.status === 'Ready' ? `<button class="btn btn-sm btn-outline" onclick="updateOrderStatus('${o.id}','Served')">Served</button>` : ''}
      </div>
    </div>
  `).join('');
}

// ---------- TABLES PANEL ----------
function renderAdminTables() {
  const grid = $('#adminTableGrid');
  if (!grid) return;

  grid.innerHTML = tablesData.map(t => `
    <div class="table-card" data-table="${t.id}">
      <div class="tnum">${t.id}</div>
      <div class="tstatus">${t.seats} seats</div>
      <div class="tstatus status-${t.status}">${t.status}</div>
    </div>
  `).join('');

  $$('.table-card').forEach(card => {
    card.addEventListener('click', () => {
      const t = tablesData.find(x => x.id === card.dataset.table);
      if (!t) return;

      const next = {
        available: 'occupied',
        occupied: 'reserved',
        reserved: 'available'
      }[t.status] || 'available';

      t.status = next;
      store.set('tables', tablesData);
      renderAdminTables();
      toast(`Table ${t.id} → ${next}`);
    });
  });
}

// ---------- QR PANEL ----------
function renderQR() {
  const container = $('#qrContainer');
  if (!container) return;

  container.innerHTML = '';

  tablesData.forEach(t => {
    const wrapper = document.createElement('div');
    wrapper.className = 'qr-item';

    const label = document.createElement('div');
    label.className = 'qrlbl';
    label.textContent = `Table ${t.id}`;
    wrapper.appendChild(label);

    const qrDiv = document.createElement('div');
    wrapper.appendChild(qrDiv);

    // Use QRCode library if available
    if (window.QRCode) {
      try {
        new QRCode(qrDiv, {
          text: `${location.origin}${location.pathname}?table=${t.id}`,
          width: 120,
          height: 120
        });
      } catch (e) {
        qrDiv.textContent = 'QR unavailable';
      }
    } else {
      qrDiv.textContent = 'QR lib missing';
    }

    container.appendChild(wrapper);
  });
}

// ---------- MENU MANAGEMENT ----------
function renderMenuMgmt() {
  const container = $('#menuMgmtList');
  if (!container) return;

  container.innerHTML = menuData.map(item => `
    <div class="list-item">
      <div>
        <strong>${item.name}</strong>
        <span class="meta">· ${item.cat} · ₹${item.price}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-outline" onclick="toggleMenuAvailability('${item.id}')">
          ${item.available === false ? 'Enable' : 'Disable'}
        </button>
        <button class="btn btn-sm btn-outline" onclick="editMenuItem('${item.id}')">Edit Price</button>
      </div>
    </div>
  `).join('');
}

window.toggleMenuAvailability = function(id) {
  const item = menuData.find(i => i.id === id);
  if (!item) return;

  item.available = item.available === false ? true : false;
  store.set('menu', menuData);
  renderMenuMgmt();
  renderMenu();
  toast(`${item.name} → ${item.available ? 'enabled' : 'disabled'}`);
};

window.editMenuItem = function(id) {
  const item = menuData.find(i => i.id === id);
  if (!item) return;

  const newPrice = prompt(`New price for ${item.name} (₹):`, item.price);
  if (newPrice === null) return;

  const priceNum = parseFloat(newPrice);
  if (isNaN(priceNum) || priceNum <= 0) {
    toast('Invalid price.');
    return;
  }

  item.price = priceNum;
  store.set('menu', menuData);
  renderMenuMgmt();
  renderMenu();
  toast(`${item.name} price updated.`);
};

// Add new menu item
$('#addMenuItemBtn')?.addEventListener('click', () => {
  const name  = $('#newItemName').value.trim();
  const price = parseFloat($('#newItemPrice').value);
  const cat   = $('#newItemCat').value;
  const veg   = $('#newItemVeg').value === 'veg';
  const desc  = $('#newItemDesc').value.trim();

  if (!name || isNaN(price) || price <= 0) {
    toast('Please provide a valid name and price.');
    return;
  }

  const newItem = {
    id: 'm' + Date.now(),
    name,
    price,
    cat,
    veg,
    desc: desc || 'Deliciously prepared.',
    img: `https://placehold.co/400x300/1C1B1A/C6A15B?text=${encodeURIComponent(name)}`,
    available: true
  };

  menuData.push(newItem);
  store.set('menu', menuData);

  renderMenuMgmt();
  renderMenu();

  $('#newItemName').value = '';
  $('#newItemPrice').value = '';
  $('#newItemDesc').value = '';

  toast(`${name} added to menu.`);
});

// ---------- CUSTOMERS ----------
function renderCustomers() {
  const container = $('#customerList');
  if (!container) return;

  // derive from reservations + orders
  const customerMap = new Map();

  reservationsData.forEach(r => {
    const key = r.phone || r.name;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: r.name,
        phone: r.phone,
        visits: 0,
        spending: 0
      });
    }
    customerMap.get(key).visits += 1;
  });

  ordersData.forEach(o => {
    // match by table only (demo, no customer link)
    // in real system, order would include customer info
  });

  const customers = [...customerMap.values()];

  if (!customers.length) {
    container.innerHTML = '<p style="color:var(--text-muted);">No customers yet.</p>';
    return;
  }

  container.innerHTML = customers.map(c => `
    <div class="list-item">
      <div>
        <strong>${c.name}</strong>
        <span class="meta">· ${c.phone}</span>
      </div>
      <div class="meta">
        Visits: ${c.visits} · Spending: ₹${c.spending}
      </div>
    </div>
  `).join('');
}

// ---------- REVIEW MANAGEMENT ----------
function renderAdminReviews() {
  const container = $('#adminReviewList');
  if (!container) return;

  if (!reviewsData.length) {
    container.innerHTML = '<p style="color:var(--text-muted);">No reviews.</p>';
    return;
  }

  container.innerHTML = reviewsData.map(r => `
    <div class="list-item">
      <div>
        <strong>${r.name}</strong>
        <span class="meta">· ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        <div style="font-size:0.85rem;margin-top:4px;">${r.text}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <span class="status-badge ${r.approved !== false ? 'status-paid' : 'status-pending'}">
          ${r.approved !== false ? 'Approved' : 'Pending'}
        </span>
        ${r.approved === false
          ? `<button class="btn btn-sm btn-outline" onclick="approveReview('${r.id}')">Approve</button>`
          : `<button class="btn btn-sm btn-outline" onclick="rejectReview('${r.id}')">Reject</button>`}
      </div>
    </div>
  `).join('');
}

window.approveReview = function(id) {
  const r = reviewsData.find(x => x.id === id);
  if (!r) return;

  r.approved = true;
  store.set('reviews', reviewsData);
  renderAdminReviews();
  renderReviews();
  toast('Review approved.');
};

window.rejectReview = function(id) {
  const r = reviewsData.find(x => x.id === id);
  if (!r) return;

  r.approved = false;
  store.set('reviews', reviewsData);
  renderAdminReviews();
  renderReviews();
  toast('Review rejected.');
};

// ---------- ADMIN LOGIN ----------
$('#adminLoginBtn')?.addEventListener('click', () => {
  $('#adminSection')?.classList.add('open');
  renderAdminDashboard();
});

$('#adminCloseBtn')?.addEventListener('click', () => {
  $('#adminSection')?.classList.remove('open');
});

// admin tabs
$$('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.admin-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.atab;

    $$('.admin-panel').forEach(p => p.classList.remove('active'));
    $('#panel-' + target)?.classList.add('active');

    // re-render specific panels when opened
    if (target === 'qr')          renderQR();
    if (target === 'menuMgmt')    renderMenuMgmt();
    if (target === 'customers')   renderCustomers();
    if (target === 'reviewsMgmt') renderAdminReviews();
    if (target === 'reports')     renderCharts();
    if (target === 'tables')      renderAdminTables();
    if (target === 'kitchen')     renderKitchenOrders();
    if (target === 'orders')      renderAllOrders();
  });
});

// ---------- SETTINGS ----------
$('#saveSettingsBtn')?.addEventListener('click', () => {
  settingsData.name  = $('#setName').value.trim() || 'Cafe Thikana';
  settingsData.phone = $('#setPhone').value.trim() || '09399799980';
  settingsData.email = $('#setEmail').value.trim() || 'cafethikana2.0@gmail.com';
  settingsData.tax   = parseFloat($('#setTax').value) || 5;

  store.set('settings', settingsData);
  toast('Settings saved.');
});

// ---------- INITIAL RENDER ----------
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderGallery();
  renderReviews();
  updateCartUI();
});

// also render after slight delay in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderMenu();
  renderGallery();
  renderReviews();
  updateCartUI();
}