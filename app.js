const API = "https://script.google.com/macros/s/AKfycbxo2mITCJ2-ikdqypEMbcFui1IKWjoJvx7Txt8Hygm100GKjUSJ241Kv6dwxf7EJ1t9/exec";
const PASSWORD = "hotel123"; // 🔐 Поміняй пароль тут

function $(id) { return document.getElementById(id); }

function openScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function login() {
  const pass = $("loginPassword").value;
  if (pass === PASSWORD) openScreen("menuScreen");
  else $("loginError").textContent = "Неправильний пароль";
}

function logout() {
  $("loginPassword").value = "";
  openScreen("loginScreen");
}

// ------------------ Новий гість ------------------
async function addGuest() {
  const data = {
    action: "addGuest",
    roomNumber: $("gRoom").value,
    fullName: $("gName").value,
    phone: $("gPhone").value,
    checkIn: $("gIn").value,
    checkOut: $("gOut").value,
    guestsCount: $("gCount").value,
    notes: $("gNotes").value
  };

  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(data)
  });

  let json = await res.json();
  $("guestStatus").textContent = json.success ? "Збережено!" : "Помилка";
}

// ------------------ Картка номеру ------------------
async function loadRoom() {
  const room = $("rRoom").value;

  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify({ action: "getRoom", roomNumber: room })
  });

  let json = await res.json();

  let html = "<h3>Гості</h3>";
  json.guests.forEach(g => {
    html += `<p><b>${g.name}</b><br>📞 ${g.phone}<br>ID: ${g.id}</p>`;
  });

  html += "<h3>Послуги</h3>";
  json.services.forEach(s => {
    html += `<p>${s.date}: ${s.service} (${s.price} грн) — ${s.staff}</p>`;
  });

  $("roomData").innerHTML = html;
}

// ------------------ Послуги ------------------
async function addService() {
  const data = {
    action: "addService",
    roomNumber: $("sRoom").value,
    guestId: $("sGuest").value,
    serviceName: $("sName").value,
    price: $("sPrice").value,
    date: new Date().toISOString().split("T")[0],
    staff: $("sStaff").value
  };

  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(data)
  });

  let json = await res.json();
  $("serviceStatus").textContent = json.success ? "Додано!" : "Помилка";
}

// ------------------ Виїзд ------------------
async function checkout() {
  const room = $("cRoom").value;

  let res = await fetch(API, {
    method: "POST",
    body: JSON.stringify({ action: "checkoutGuest", roomNumber: room })
  });

  let json = await res.json();
  $("checkoutStatus").textContent = json.success ? "Гості виселені!" : "Помилка";
}
