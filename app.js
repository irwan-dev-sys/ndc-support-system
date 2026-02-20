const API_URL = "https://script.google.com/macros/s/AKfycbwBp-NDDXHf6SlMzuf0dzVGMRD92Xaxt_rJII2-rTGtw60H2j8QWEdIha5JAPgfr4Qh8g/exec";

/* =========================================
   FUNGSI LOGIN
========================================= */
async function login() {
  const nip = document.getElementById("nip").value;
  const password = document.getElementById("password").value;
  const msgEl = document.getElementById("msg");

  // Validasi Input Kosong
  if (!nip || !password) {
    msgEl.innerText = "NIP dan Password tidak boleh kosong.";
    return;
  }

  // Loading text agar user tahu proses sedang berjalan (GAS butuh 1-3 detik)
  msgEl.innerText = "Proses login..."; 

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain" // Wajib text/plain untuk bypass CORS GAS
      },
      body: JSON.stringify({
        action: "login",
        nip: nip,
        password: password
      })
    });

    // Karena di backend sudah pasti outputJSON, kita parse di sini
    const responseData = await res.json();

    if (responseData.status === "success") {
      // PERHATIKAN: di backend baru, token ada di dalam object "data"
      localStorage.setItem("token", responseData.data.token);
      localStorage.setItem("name", responseData.data.name);
      localStorage.setItem("role", responseData.data.role);
      
      window.location.href = "dashboard.html";
    } else {
      // Tampilkan pesan error dari backend
      msgEl.innerText = responseData.message;
    }
  } catch (error) {
    console.error("Login Error:", error);
    msgEl.innerText = "Gagal terhubung ke server.";
  }
}

/* =========================================
   FUNGSI GET LOGS (Halaman Dashboard)
========================================= */
async function getLogs() {
  const token = localStorage.getItem("token");
  const resultEl = document.getElementById("result");

  // Cek apakah user sudah login (punya token)
  if (!token) {
    alert("Sesi tidak valid, silakan login kembali.");
    logout();
    return;
  }

  resultEl.innerText = "Memuat data logs...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain" // Tambahkan header ini agar tidak kena CORS
      },
      body: JSON.stringify({
        action: "getLogs", // Ubah dari "getAuditLogs" menjadi "getLogs" menyesuaikan backend
        token: token
      })
    });

    const responseData = await res.json();

    if (responseData.status === "success") {
      // Tampilkan data ke div/pre html
      resultEl.innerText = JSON.stringify(responseData.logs, null, 2);
    } else {
      resultEl.innerText = "Error: " + responseData.message;
      
      // Jika token expired/invalid, auto keluarkan user
      if (responseData.message.includes("Expired") || responseData.message.includes("Invalid")) {
        setTimeout(logout, 2000); 
      }
    }
  } catch (error) {
    console.error("Get Logs Error:", error);
    resultEl.innerText = "Gagal mengambil data dari server.";
  }
}

/* =========================================
   FUNGSI LOGOUT
========================================= */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
