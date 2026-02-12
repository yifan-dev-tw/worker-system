import { auth } from "./firebase.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    location.href = "admin.html";
  } catch {
    alert("登入失敗");
  }
};
