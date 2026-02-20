const API_URL = "https://script.google.com/macros/s/AKfycbwBp-NDDXHf6SlMzuf0dzVGMRD92Xaxt_rJII2-rTGtw60H2j8QWEdIha5JAPgfr4Qh8g/exec";

async function login() {
  const nip = document.getElementById("nip").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain"
  },
  body: JSON.stringify({
    action: "login",
    nip: nip,
    password: password
  })
});

  const data = await res.json();

  if (data.status === "success") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = data.message;
  }
}

async function getLogs() {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getAuditLogs",
      token: token
    })
  });

  const data = await res.json();

  document.getElementById("result").innerText =
    JSON.stringify(data, null, 2);
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
