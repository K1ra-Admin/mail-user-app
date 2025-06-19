
const BASE_URL = "https://script.google.com/macros/s/AKfycbytkO0ccfauJUFEwQEy7xCwiMsshPv_2bjV2XvbRDd0LK0ckD9309MsEMI3SicJVvG_/exec";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const updateForm = document.getElementById("updateForm");
const singleAccountForm = document.getElementById("singleAccountForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const username = document.getElementById("username");
const leader = document.getElementById("leader");
const accountEmail = document.getElementById("accountEmail");
const accountPassword = document.getElementById("accountPassword");

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "register",
        email: email.value,
        password: password.value
      }),
    }).then(res => res.json()).then(data => {
      alert("Berhasil daftar!");
      location.href = "login.html";
    });
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        email: email.value,
        password: password.value
      }),
    }).then(res => res.json()).then(data => {
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
    body: JSON.stringify({ action: "login", email: "", password: "", id })
  }).then(res => res.json()).then(data => {
    document.getElementById("profile-info").innerHTML = `
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Email:</strong> ${data.email}</p>
    `;
    document.getElementById("toHistory").href = "history.html?id=" + data.id;
  });

  if (updateForm) {
    updateForm.addEventListener("submit", e => {
      e.preventDefault();
      fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "update_profile",
          id: localStorage.getItem("user_id"),
          username: username.value,
          leader: leader.value
        })
      }).then(res => res.text()).then(alert);
    });
  }
}

if (singleAccountForm) {
  singleAccountForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submit_account",
        id: localStorage.getItem("user_id"),
        accountEmail: accountEmail.value,
        accountPassword: accountPassword.value
      })
    }).then(res => res.text()).then(alert);
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
        const statusIcon = item.status === "✅" ? "✔️" : item.status === "❌" ? "❌" : "⏳";
        const div = document.createElement("div");
        div.innerHTML = `<p><strong>Email:</strong> ${item.email}</p><p><strong>Status:</strong> ${statusIcon}</p><hr/>`;
        container.appendChild(div);
      });
    }).catch(() => {
      document.getElementById("history-container").innerHTML = "<p>Gagal memuat data.</p>";
    });
}
