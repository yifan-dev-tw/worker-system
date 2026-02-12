import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= 員工 ================= */

window.submitData = async function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) return alert("請輸入姓名與電話");

  await addDoc(collection(db, "workers"), {
    name,
    phone,
    score: 0
  });

  loadWorkers();
  loadWorkerOptions();
};

async function loadWorkers() {
  const querySnapshot = await getDocs(collection(db, "workers"));

  let html = `
    <table>
      <tr>
        <th>姓名</th>
        <th>電話</th>
        <th>評分</th>
        <th>操作</th>
      </tr>
  `;

  querySnapshot.forEach((docSnap) => {
    const w = docSnap.data();
    const id = docSnap.id;

    html += `
      <tr>
        <td>${w.name}</td>
        <td>${w.phone}</td>
        <td>${w.score ?? 0}</td>
        <td>
          <button onclick="editWorker('${id}','${w.name}','${w.phone}')">編輯</button>
          <button onclick="deleteWorker('${id}')">刪除</button>
          <button onclick="addScore('${id}',2)">+2</button>
          <button onclick="addScore('${id}',-2)">-2</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("workerList").innerHTML = html;
}

/* 刪除員工 */
window.deleteWorker = async function (id) {
  if (!confirm("確定刪除員工？")) return;
  await deleteDoc(doc(db, "workers", id));
  loadWorkers();
  loadWorkerOptions();
};

/* 編輯員工 */
window.editWorker = async function (id, oldName, oldPhone) {
  const name = prompt("姓名", oldName);
  const phone = prompt("電話", oldPhone);

  if (!name || !phone) return;

  await updateDoc(doc(db, "workers", id), { name, phone });
  loadWorkers();
  loadWorkerOptions();
};

/* 評分系統 */
window.addScore = async function (id, change) {
  const ref = doc(db, "workers", id);
  const snapshot = await getDocs(collection(db, "workers"));

  snapshot.forEach(async (d) => {
    if (d.id === id) {
      const w = d.data();
      let score = (w.score || 0) + change;
      if (score > 100) score = 100;
      if (score < 0) score = 0;
      await updateDoc(ref, { score });
      loadWorkers();
    }
  });
};

/* 下拉選單 */
async function loadWorkerOptions() {
  const querySnapshot = await getDocs(collection(db, "workers"));
  const select = document.getElementById("dispatchName");

  select.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const w = docSnap.data();
    const option = document.createElement("option");
    option.value = w.name;
    option.textContent = w.name;
    select.appendChild(option);
  });
}

/* ================= 派工 ================= */

window.addDispatch = async function () {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;

  if (!name || !location || !date) return alert("請填寫完整資料");

  await addDoc(collection(db, "dispatch"), {
    name,
    location,
    date
  });

  loadDispatch();
};

async function loadDispatch() {
  const querySnapshot = await getDocs(collection(db, "dispatch"));

  let html = `
    <table>
      <tr>
        <th>員工</th>
        <th>地點</th>
        <th>日期</th>
        <th>操作</th>
      </tr>
  `;

  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const id = docSnap.id;

    html += `
      <tr>
        <td>${d.name || "-"}</td>
        <td>${d.location || "-"}</td>
        <td>${d.date || "-"}</td>
        <td>
          <button onclick="editDispatch('${id}','${d.name}','${d.location}','${d.date}')">編輯</button>
          <button onclick="deleteDispatch('${id}')">刪除</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("dispatchList").innerHTML = html;
}

/* 刪除派工 */
window.deleteDispatch = async function (id) {
  if (!confirm("刪除派工？")) return;
  await deleteDoc(doc(db, "dispatch", id));
  loadDispatch();
};

/* 編輯派工 */
window.editDispatch = async function (id, name, location, date) {
  const newLocation = prompt("工作地點", location);
  const newDate = prompt("日期", date);

  if (!newLocation || !newDate) return;

  await updateDoc(doc(db, "dispatch", id), {
    location: newLocation,
    date: newDate
  });

  loadDispatch();
};

/* ================= 初始化 ================= */

window.onload = function () {
  loadWorkers();
  loadWorkerOptions();
  loadDispatch();
};
