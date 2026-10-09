
// 1. Alapadatok
const cars = [
  {
    id: 1,
    brand: "BMW",
    model: "M4 Competition",
    dailyPrice: 52000,
    colors: [
      { name: "Éjfekete", hex: "#111111", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600" },
      { name: "Neon Lila", hex: "#8b5cf6", img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600" },
      { name: "Hófehér", hex: "#f4f4f5", img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600" }
    ]
  },
  {
    id: 2,
    brand: "Porsche",
    model: "Taycan Turbo S",
    dailyPrice: 68000,
    colors: [
      { name: "Fekete Metál", hex: "#18181b", img: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600" },
      { name: "Ultra Violet", hex: "#7c3aed", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600" }
    ]
  },
  {
    id: 3,
    brand: "Mercedes-AMG",
    model: "GT Coupe",
    dailyPrice: 75000,
    colors: [
      { name: "Matt Fekete", hex: "#09090b", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600" },
      { name: "Amethyst Lila", hex: "#6b21a8", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600" }
    ]
  },
  {
    id: 4,
    brand: "Audi",
    model: "RS7 Sportback",
    dailyPrice: 59000,
    colors: [
      { name: "Phantom Black", hex: "#171717", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600" },
      { name: "Royal Purple", hex: "#9333ea", img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600" }
    ]
  },
  {
    id: 5,
    brand: "Ford",
    model: "Mustang Dark Horse",
    dailyPrice: 44000,
    colors: [
      { name: "Shadow Black", hex: "#0f172a", img: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600" },
      { name: "Cyber Violet", hex: "#a855f7", img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600" }
    ]
  },
  {
    id: 6,
    brand: "Tesla",
    model: "Model S Plaid",
    dailyPrice: 62000,
    colors: [
      { name: "Solid Black", hex: "#1e1e1e", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600" },
      { name: "Electric Purple", hex: "#c084fc", img: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=600" }
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
