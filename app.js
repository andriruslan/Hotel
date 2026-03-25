const API_URL = "https://script.google.com/macros/s/AKfycbyfabCaieSX2R--5Vccz2rC6oW7wwPL3YysJK3kfMAgyKu5k1YqUVUzfuE9_dZBg9Dp/exec";
const SYSTEM_PASSWORD = "24Bua";

function login() {
  const pass = document.getElementById("loginPassword").value;
  if (pass === SYSTEM_PASSWORD) {
    localStorage.setItem("hotelLogged", "1");
    document.getElementById("loginError").innerText = "";
    openScreen("menuScreen");
  } else {
    document.getElementById("loginError").innerText = "Невірний пароль";
  }
}

function logout() {
  localStorage.removeItem("hotelLogged");
  document.getElementById("loginPassword").value = "";
  openScreen("loginScreen");
}

window.onload = function () {
  if (localStorage.getItem("hotelLogged") === "1") {
    openScreen("menuScreen");
  } else {
    openScreen("loginScreen");
  }
};

function openScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

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

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (data.ok || data.success) {
      document.getElementById("guestStatus").innerText = data.message || "Гостя додано";
      clearGuestForm();
    } else {
      document.getElementById("guestStatus").innerText = data.error || data.message || "Помилка збереження";
    }
  } catch (err) {
    document.getElementById("guestStatus").innerText = "Помилка запиту: " + err.message;
  }
}

function clearGuestForm() {
  document.getElementById("gRoom").value = "";
  document.getElementById("gName").value = "";
  document.getElementById("gPhone").value = "";
  document.getElementById("gIn").value = "";
  document.getElementById("gOut").value = "";
  document.getElementById("gCount").value = "";
  document.getElementById("gNotes").value = "";
}

async function loadRoom() {
  const room = document.getElementById("rRoom").value;

  try {
    const res = await fetch(`${API_URL}?action=getRoom&RoomNumber=${encodeURIComponent(room)}`);
    const data = await res.json();

    if (!data.ok) {
      document.getElementById("roomData").innerHTML = `<p class="error">${data.error || "Помилка"}</p>`;
      return;
    }

    let html = "<h3>Гості</h3>";
    if (data.guests.length === 0) {
      html += "<p>Немає активних гостей</p>";
    } else {
      data.guests.forEach(g => {
        html += `<div class="card"><strong>${g.FullName}</strong><br>Телефон: ${g.Phone || "-"}<br>ID: ${g.ID}<br>Заїзд: ${g.CheckIn || "-"}<br>Виїзд: ${g.CheckOut || "-"}</div>`;
      });
    }

    html += "<h3>Послуги</h3>";
    if (data.services.length === 0) {
      html += "<p>Послуг немає</p>";
    } else {
      data.services.forEach(s => {
        html += `<div class="card">${s.ServiceName} — ${s.Price || 0} грн<br>Гість ID: ${s.GuestID || "-"}<br>Працівник: ${s.Staff || "-"}</div>`;
      });
    }

    document.getElementById("roomData").innerHTML = html;
  } catch (err) {
    document.getElementById("roomData").innerHTML = `<p class="error">Помилка запиту: ${err.message}</p>`;
  }
}

async function selectService(name) {
  if (!name) {
    document.getElementById("sPrice").value = "";
    return;
  }

  try {
    const response = await fetch(`${API_URL}?action=lookupPrice&ServiceName=${encodeURIComponent(name)}`);
    const data = await response.json();

    if (data.ok && data.DefaultPrice !== undefined) {
      document.getElementById("sPrice").value = data.DefaultPrice;
    }
  } catch (err) {
    console.error(err);
  }
}

async function addService() {
  const payload = {
    action: "addService",
    RoomNumber: document.getElementById("sRoom").value,
    GuestID: document.getElementById("sGuest").value,
    ServiceName: document.getElementById("sName").value,
    Price: document.getElementById("sPrice").value,
    Staff: document.getElementById("sStaff").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    document.getElementById("serviceStatus").innerText = data.message || data.error || "Готово";
  } catch (err) {
    document.getElementById("serviceStatus").innerText = "Помилка запиту: " + err.message;
  }
}

async function checkout() {
  const payload = {
    action: "checkout",
    RoomNumber: document.getElementById("cRoom").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    document.getElementById("checkoutStatus").innerText = data.message || data.error || "Готово";
  } catch (err) {
    document.getElementById("checkoutStatus").innerText = "Помилка запиту: " + err.message;
  }
}
