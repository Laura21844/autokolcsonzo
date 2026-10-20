
// 1. Alapadatok
const cars = [
  {
    id: 1,
    brand: "BMW",
    model: "M4 Competition",
    dailyPrice: 52000,
    colors: [
      { name: "Éjfekete", hex: "#111111", img: "/cars/colors/bmw_m4_fekete.jpg" },
      { name: "Neon Lila", hex: "#8b5cf6", img: "/cars/colors/bmw_m4_lila.jpg" },
      { name: "Hófehér", hex: "#f4f4f5", img: "/cars/colors/bmw_m4_feher.jpg" }
    ]
  },
  {
    id: 2,
    brand: "Porsche",
    model: "Taycan Turbo S",
    dailyPrice: 68000,
    colors: [
      { name: "Ultra violet", hex: "#7c3aed", img: "/cars/colors/porsche-taycan-turbo-purple.jpg" },
      { name: "Fekete metál", hex: "#000000", img: "/cars/colors/porschetaycanturbosblack.jpg" }
    ]
  },
  {
    id: 3,
    brand: "Fiat 500",
    model: "Abarth",
    dailyPrice: 25000,
    colors: [
      { name: "Matt Fekete", hex: "#09090b", img: "/cars/colors/fiat500fekete.avif" },
      { name: "Amethyst Lila", hex: "#6b21a8", img: "/cars/colors/fiat500lila.jpg" }
    ]
  },
  {
    id: 4,
    brand: "Audi",
    model: "RS7 Sportback",
    dailyPrice: 59000,
    colors: [
      { name: "Phantom Black", hex: "#171717", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600" },
      { name: "Royal Purple", hex: "#9333ea", img: "/cars/colors/audilila.webp" }
    ]
  },
  {
    id: 5,
    brand: "Ford",
    model: "Mustang GT 500 Shelby",
    dailyPrice: 44000,
    colors: [
      { name: "Shadow Black", hex: "#0f172a", img: "/cars/colors/ford_black.jpg" },
      { name: "Cyber Violet", hex: "#a855f7", img: "/cars/colors/ford_lila.jpg" }
    ]
  },
  {
    id: 6,
    brand: "Tesla",
    model: "Model S Plaid",
    dailyPrice: 62000,
    colors: [
      { name: "Solid Black", hex: "#1e1e1e", img: "/cars/colors/teslafekete.webp" },
      { name: "Electric Purple", hex: "#c084fc", img: "/cars/colors/teslalila.jpg" }
    ]
  }
];

let rentals = [
  { id: "LSG-101", customerName: "Kovács Péter", phone: "+36301234567", email: "kovacs@mail.hu", carId: 1, carName: "BMW M4 Competition", color: "Neon Lila", startDate: "2026-10-12", endDate: "2026-10-15", days: 3, price: 156000, active: true },
  { id: "LSG-102", customerName: "Nagy Anna", phone: "+36209876543", email: "anna@mail.hu", carId: 2, carName: "Porsche Taycan Turbo S", color: "Fekete Metál", startDate: "2026-10-14", endDate: "2026-10-18", days: 4, price: 272000, active: true },
  { id: "LSG-103", customerName: "Tóth Bence", phone: "+36704561234", email: "bence@mail.hu", carId: 3, carName: "Mercedes-AMG GT Coupe", color: "Amethyst Lila", startDate: "2026-10-20", endDate: "2026-10-22", days: 2, price: 150000, active: true }
];

let sortCol = "customerName";
let sortAsc = true;

// 2. DOM inicializálás
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").min = today;
  document.getElementById("endDate").min = today;

  renderFleet();
  populateDropdowns();
  renderRentals();
  attachEvents();
});

// 3. Portfólió + Színváltó generálás
function renderFleet() {
  const container = document.getElementById("fleetContainer");
  container.innerHTML = "";

  cars.forEach(car => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    
    // Színgombok HTML
    const swatches = car.colors.map((c, i) => `
      <span class="swatch ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" 
            onclick="changeCarColor(${car.id}, '${c.img}', '${c.name}', this)"></span>
    `).join("");

    col.innerHTML = `
      <div class="card bg-dark-card border border-secondary p-3 h-100 rounded-3">
        <img src="${car.colors[0].img}" id="img-car-${car.id}" class="car-img mb-3" alt="${car.brand} ${car.model}">
        <h5 class="text-white">${car.brand} ${car.model}</h5>
        <div class="mb-2">
          <small class="text-secondary d-block">Szín: <strong id="label-car-${car.id}" class="text-purple">${car.colors[0].name}</strong></small>
          <div class="mt-1">${swatches}</div>
        </div>
        <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
          <span class="fw-bold text-white">${car.dailyPrice.toLocaleString()} Ft/nap</span>
          <a href="#uj-foglalas" class="btn btn-sm btn-outline-purple" onclick="selectCarForBooking(${car.id})">Kiválasztás</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Színváltás logikája a kártyán
window.changeCarColor = function(carId, imgUrl, colorName, element) {
  document.getElementById(`img-car-${carId}`).src = imgUrl;
  document.getElementById(`label-car-${carId}`).textContent = colorName;
  
  const parent = element.parentElement;
  parent.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
  element.classList.add("active");
};

function selectCarForBooking(carId) {
  const carSelect = document.getElementById("carSelect");
  carSelect.value = carId;
  updateColorDropdown();
  calculatePrice();
}

// 4. Dropdown menük feltöltése
function populateDropdowns() {
  const carSelect = document.getElementById("carSelect");
  const filterCar = document.getElementById("filterCar");

  cars.forEach(c => {
    carSelect.innerHTML += `<option value="${c.id}">${c.brand} ${c.model} (${c.dailyPrice.toLocaleString()} Ft/nap)</option>`;
    filterCar.innerHTML += `<option value="${c.id}">${c.brand} ${c.model}</option>`;
  });
  updateColorDropdown();
}

function updateColorDropdown() {
  const carId = document.getElementById("carSelect").value;
  const colorSelect = document.getElementById("colorSelect");
  colorSelect.innerHTML = "";

  const car = cars.find(c => c.id == carId);
  if (car) {
    car.colors.forEach(col => {
      colorSelect.innerHTML += `<option value="${col.name}">${col.name}</option>`;
    });
  }
}


// 5. Foglalások megjelenítése és szűrése
function renderRentals() {
  const txt = document.getElementById("filterText").value.toLowerCase();
  const carId = document.getElementById("filterCar").value;

  // Összetett szűrés + Soft delete figyelembevétele
  let filtered = rentals.filter(r => r.active &&
    (r.customerName.toLowerCase().includes(txt) || r.carName.toLowerCase().includes(txt)) &&
    (!carId || r.carId == carId)
  );

  // Rendezés
  filtered.sort((a, b) => {
    let vA = a[sortCol], vB = b[sortCol];
    return (vA > vB ? 1 : -1) * (sortAsc ? 1 : -1);
  });

  // Táblázat render
  const tbody = document.getElementById("rentalsTable");
  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td class="text-purple">${r.id}</td>
      <td>${r.customerName}</td>
      <td>${r.phone}</td>
      <td>${r.carName} <span class="badge bg-secondary">${r.color}</span></td>
      <td>${r.startDate} &rarr; ${r.endDate} (${r.days} nap)</td>
      <td class="text-purple fw-bold">${r.price.toLocaleString()} Ft</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="deleteRental('${r.id}')">Törlés</button></td>
    </tr>
  `).join("");

  // Kártyás nézet render
  const cardsContainer = document.getElementById("cardsView");
  cardsContainer.innerHTML = filtered.map(r => `
    <div class="col-md-6 col-lg-4">
      <div class="card bg-dark-card border border-secondary p-3">
        <div class="d-flex justify-content-between text-purple fw-bold mb-2">
          <span>${r.id}</span>
          <span>${r.price.toLocaleString()} Ft</span>
        </div>
        <h5 class="text-white">${r.customerName}</h5>
        <p class="text-secondary small mb-2">${r.carName} &bull; ${r.color}</p>
        <p class="small text-secondary mb-3">${r.startDate} - ${r.endDate} (${r.days} nap)</p>
        <button class="btn btn-sm btn-outline-danger w-100" onclick="deleteRental('${r.id}')">Törlés</button>
      </div>
    </div>
  `).join("");
}

// Soft delete
window.deleteRental = function(id) {
  const item = rentals.find(r => r.id === id);
  if (item) {
    item.active = false;
    renderRentals();
  }
};

// 6. Ár- és dátumszámítás (Kötelező extra feladat)
function calculatePrice() {
  const carId = document.getElementById("carSelect").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!carId || !start || !end) return { days: 0, price: 0 };

  const sDate = new Date(start);
  const eDate = new Date(end);
  const diffDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    document.getElementById("calcDays").textContent = "Érvénytelen";
    document.getElementById("calcPrice").textContent = "0 Ft";
    return { days: 0, price: 0 };
  }

  const car = cars.find(c => c.id == carId);
  const total = diffDays * car.dailyPrice;

  document.getElementById("calcDays").textContent = diffDays;
  document.getElementById("calcPrice").textContent = total.toLocaleString() + " Ft";

  return { days: diffDays, price: total, car: car };
}

// 7. Eseménykezelők és űrlapküldés
function attachEvents() {
  document.getElementById("carSelect").addEventListener("change", () => {
    updateColorDropdown();
    calculatePrice();
  });
  document.getElementById("startDate").addEventListener("change", calculatePrice);
  document.getElementById("endDate").addEventListener("change", calculatePrice);

  // Szűrők
  document.getElementById("filterText").addEventListener("input", renderRentals);
  document.getElementById("filterCar").addEventListener("change", renderRentals);
  document.getElementById("filterReset").addEventListener("click", () => {
    document.getElementById("filterText").value = "";
    document.getElementById("filterCar").value = "";
    renderRentals();
  });

  // Rendezés
  document.getElementById("sortName").addEventListener("click", () => toggleSort("customerName"));
  document.getElementById("sortDate").addEventListener("click", () => toggleSort("startDate"));
  document.getElementById("sortPrice").addEventListener("click", () => toggleSort("price"));

  // Nézetváltó
  document.getElementById("btnTable").addEventListener("click", () => switchView("table"));
  document.getElementById("btnCards").addEventListener("click", () => switchView("cards"));

  // Tetejére gomb
  const topBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => topBtn.style.display = window.scrollY > 300 ? "block" : "none");
  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Form submit + Validáció
  document.getElementById("bookingForm").addEventListener("submit", handleBookingSubmit);
}

function toggleSort(col) {
  if (sortCol === col) sortAsc = !sortAsc;
  else { sortCol = col; sortAsc = true; }
  renderRentals();
}

function switchView(type) {
  const isTable = type === "table";
  document.getElementById("tableView").classList.toggle("d-none", !isTable);
  document.getElementById("cardsView").classList.toggle("d-none", isTable);
  document.getElementById("btnTable").classList.toggle("active", isTable);
  document.getElementById("btnCards").classList.toggle("active", !isTable);
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const alertBox = document.getElementById("formAlert");
  alertBox.classList.add("d-none");

  const name = document.getElementById("custName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const carId = document.getElementById("carSelect").value;
  const color = document.getElementById("colorSelect").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  // Egyszerű validációk
  if (!name || !email || !phone || !start || !end) {
    alertBox.textContent = "Minden csillagozott mező kitöltése kötelező!";
    alertBox.classList.remove("d-none");
    return;
  }

  const calc = calculatePrice();
  if (calc.days <= 0) {
    alertBox.textContent = "A záró dátum nem lehet korábbi a kezdő dátumnál!";
    alertBox.classList.remove("d-none");
    return;
  }

  // Ütközésvizsgálat
  const conflict = rentals.some(r => r.active && r.carId == carId && new Date(start) < new Date(r.endDate) && new Date(end) > new Date(r.startDate));
  if (conflict) {
    alertBox.textContent = "Ez a modell már foglalt ebben az időszakban!";
    alertBox.classList.remove("d-none");
    return;
  }

  // Új rekord mentése
  const newId = `LSG-${100 + rentals.length + 1}`;
  const newBooking = {
    id: newId,
    customerName: name,
    phone: phone,
    email: email,
    carId: parseInt(carId),
    carName: `${calc.car.brand} ${calc.car.model}`,
    color: color,
    startDate: start,
    endDate: end,
    days: calc.days,
    price: calc.price,
    active: true
  };

  rentals.unshift(newBooking);
  renderRentals();

  // Visszajelzés
  const successCard = document.getElementById("successCard");
  document.getElementById("successDetails").innerHTML = `
    <strong>Kód:</strong> ${newBooking.id} | <strong>Autó:</strong> ${newBooking.carName} (${newBooking.color})<br>
    <strong>Időszak:</strong> ${newBooking.startDate} - ${newBooking.endDate} (${newBooking.days} nap)<br>
    <strong>Összeg:</strong> ${newBooking.price.toLocaleString()} Ft
  `;
  successCard.classList.remove("d-none");
  document.getElementById("bookingForm").reset();
  calculatePrice();
}
