console.log("login.js 已載入");

import { auth } from "./firebase.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", async () => {
  alert("按鈕有被點擊");

  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    location.href = "admin.html";
  } catch (err) {
    alert(err.message);
  }
});
