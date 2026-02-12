import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* 新增員工 */
window.submitData = async function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("請輸入姓名與電話");
    return;
  }

  try {
    await addDoc(collection(db, "workers"), {
      name: name,
      phone: phone,
      score: 0
    });

    alert("新增成功");
    loadWorkers();

  } catch (e) {
    console.error(e);
    alert("新增失敗");
  }
};

/* 讀取員工 */
async function loadWorkers() {
  const querySnapshot = await getDocs(collection(db, "workers"));

  let html = "<ul>";
  querySnapshot.forEach((doc) => {
    const w = doc.data();
    html += `<li>${w.name} - ${w.phone} - ${w.score}</li>`;
  });
  html += "</ul>";

  document.getElementById("workerList").innerHTML = html;
}

window.onload = loadWorkers;
