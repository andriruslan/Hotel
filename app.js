/* ============================================================
   CONFIG
============================================================ */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxntiKCw1fRoPGtZ9JCIreOnzRnfg_rZs4fdjW0Tyfi4sh7zv3-XyZr6phEWpaVdIpT/exec";

const SYSTEM_PASSWORD = "24Bua";   // твоє: 1. 24  2. B  3. ua

/* ============================================================
   LOGIN SYSTEM
============================================================ */

function login() {
  const pass = document.getElementById("loginPassword").value;

  if (pass === SYSTEM_PASSWORD) {
    localStorage.setItem("hotelLogged", "1");
    openScreen("menuScreen");
  } else {
    document.getElementById("loginError").innerText = "Невірний пароль";
  }
}

function logout() {
  localStorage.removeItem("hotelLogged");
  openScreen("loginScreen");
}

window.onload = function () {
  if (localStorage.getItem("hotelLogged") === "1") {
    openScreen("menuScreen");
  } else {
    openScreen("loginScreen");
  }
};

/* ============================================================
   SCREEN SWITCHING
============================================================ */
function openScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ============================================================
   ADD GUEST
============================================================ */
async function addGuest() {
  const payload = {
    action: "addGuest",
    RoomNumber: document.getElementById("gRoom").value,
    FullName: document.getElementById("gName").value,
    Phone: document.getElementById("gPhone").value,
    CheckIn: document.getElementById("gIn").value,
    CheckOut: document.getElementById("gOut").value,
    GuestsCount: document.getElementById("gCount").value,
    Notes: document.getElementById("gNotes").value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("guestStatus").innerText = data.message || "Готово!";
}

/* ============================================================
   LOAD ROOM DATA
============================================================ */
async function loadRoom() {
  const room = document.getElementById("rRoom").value;

  const res = await fetch(`${API_URL}?action=roomCard&Room=${room}`);
  const data = await res.json();

  document.getElementById("roomData").innerHTML =
    `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

/* ============================================================
   ADD SERVICE
============================================================ */
async function addService() {
  const payload = {
    action: "addService",
    RoomNumber: document.getElementById("sRoom").value,
    GuestID: document.getElementById("sGuest").value,
    ServiceName: document.getElementById("sName").value,
    Price: document.getElementById("sPrice").value,
    Staff: document.getElementById("sStaff").value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("serviceStatus").innerText = data.message || "Додано!";
}

/* ============================================================
   CHECKOUT
============================================================ */
async function checkout() {
  const payload = {
    action: "checkout",
    RoomNumber: document.getElementById("cRoom").value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("checkoutStatus").innerText = data.message || "Готово!";
}
