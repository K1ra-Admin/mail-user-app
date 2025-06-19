const BASE_URL = "https://script.google.com/macros/s/AKfycbytkO0ccfauJUFEwQEy7xCwiMsshPv_2bjV2XvbRDd0LK0ckD9309MsEMI3SicJVvG_/exec";

if (document.getElementById("registerForm")) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "register",
        email: email.value,
        password: password.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(data => {
      alert("Berhasil daftar! ID: " + data.id);
      location.href = "login.html";
    });
  });
}

if (document.getElementById("loginForm")) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        email: email.value,
        password: password.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("user_id", data.id);
        location.href = "profile.html";
      } else {
        alert("Login gagal!");
      }
    });
  });
}

if (document.getElementById("profile-info")) {
  const id = localStorage.getItem("user_id");
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ action: "login", email: "", password: "", id }),
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(data => {
    profileInfo.innerHTML = `<p><strong>ID:</strong> ${data.id}</p><p><strong>Email:</strong> ${data.email}</p>`;
    document.getElementById("toHistory").href = "history.html?id=" + data.id;
  });

  updateForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_profile",
        id: localStorage.getItem("user_id"),
        username: username.value,
        leader: leader.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(() => alert("Profil diperbarui!"));
  });
}

if (document.getElementById("singleAccountForm")) {
  singleAccountForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submit_account",
        id: localStorage.getItem("user_id"),
        accountEmail: accountEmail.value,
        accountPassword: accountPassword.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(() => alert("Akun berhasil dikirim!"));
  });
}

if (document.getElementById("history-container")) {
  const id = new URLSearchParams(location.search).get("id");
  fetch(`${BASE_URL}?action=get_history&id=${id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("history-container");
      container.innerHTML = "";
      if (data.length === 0) {
        container.innerHTML = "<p>Belum ada data akun.</p>";
        return;
      }
      data.forEach(item => {
        const icon = item.status === "✅" ? "✔️" : item.status === "❌" ? "❌" : "⏳";
        container.innerHTML += `<p><strong>Email:</strong> ${item.email}</p><p><strong>Status:</strong> ${icon}</p><hr/>`;
      });
    });
}