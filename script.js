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

  await addDoc(collection(db, "workers"), {
    name,
    phone,
    score: 0
  });

  alert("新增成功");
  loadWorkers();
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
}   // ← 這一行是關鍵（你原本少了）

/* 新增派工 */
window.addDispatch = async function () {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;

  if (!name || !location || !date) {
    alert("請填寫完整派工資料");
    return;
  }

  await addDoc(collection(db, "dispatch"), {
    name,
    location,
    date
  });

  alert("派工新增成功");
  loadDispatch();
};

/* 讀取派工 */
async function loadDispatch() {
  const querySnapshot = await getDocs(collection(db, "dispatch"));

  let html = "<ul>";
  querySnapshot.forEach((doc) => {
    const d = doc.data();
    html += `<li>${d.name} - ${d.location} - ${d.date}</li>`;
  });
  html += "</ul>";

  document.getElementById("dispatchList").innerHTML = html;
}

window.onload = function () {
  loadWorkers();
  loadDispatch();
};
