/* ============================================================
   CONFIG
============================================================ */
const API_URL = "https://script.google.com/macros/s/AKfycbyfabCaieSX2R--5Vccz2rC6oW7wwPL3YysJK3kfMAgyKu5k1YqUVUzfuE9_dZBg9Dp/exec";

/* ============================================================
   Add Guest
============================================================ */
async function addGuest() {

  const payload = {
    action: "addGuest",
    RoomNumber: document.getElementById("room").value,
    FullName: document.getElementById("fullName").value,
    Phone: document.getElementById("phone").value,
    CheckIn: document.getElementById("checkIn").value,
    CheckOut: document.getElementById("checkOut").value,
    GuestsCount: document.getElementById("guestsCount").value,
    Notes: document.getElementById("notes").value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  alert(JSON.stringify(data));
}

/* ============================================================
   Auto Price Fetch
============================================================ */
async function selectService(name) {

  const response = await fetch(
    `${API_URL}?action=lookupPrice&ServiceName=${encodeURIComponent(name)}`
  );
  const data = await response.json();

  if (data.DefaultPrice) {
    document.getElementById("servicePrice").value = data.DefaultPrice;
  }
}

/* ============================================================
   Add Service
============================================================ */
async function addService() {

  const payload = {
    action: "addService",
    RoomNumber: document.getElementById("serviceRoom").value,
    GuestID: document.getElementById("guestId").value,
    ServiceName: document.getElementById("serviceName").value,
    Price: document.getElementById("servicePrice").value,
    Staff: document.getElementById("staffName").value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  alert(JSON.stringify(data));
}
