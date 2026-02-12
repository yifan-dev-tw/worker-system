import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===================== 評分規則 ===================== */
const scoreRule = {
  完成: 2,
  準時: 1,
  遲到: -3,
  未到: -10,
  請假: -1,
  取消: -5
};

/* ===================== 新增員工 ===================== */
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

/* ===================== 讀取員工 ===================== */
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
    html += `
    <tr>
      <td>${w.name}</td>
      <td>${w.phone}</td>
      <td>${w.score}</td>
      <td>
        <button onclick="addScore('${docSnap.id}',2)">+2</button>
        <button onclick="addScore('${docSnap.id}',-2)">-2</button>
        <button onclick="deleteWorker('${docSnap.id}')">刪除</button>
      </td>
    </tr>
    `;
  });

  html += "</table>";
  document.getElementById("workerList").innerHTML = html;
}

/* ===================== 手動加減分 ===================== */
window.addScore = async function (id, value) {
  const ref = doc(db, "workers", id);
  const snap = await getDocs(collection(db, "workers"));

  snap.forEach(async (d) => {
    if (d.id === id) {
      const w = d.data();
      const newScore = (w.score || 0) + value;

      await updateDoc(ref, { score: newScore });

      await addDoc(collection(db, "scoreHistory"), {
        name: w.name,
        change: value,
        date: new Date().toLocaleString()
      });
    }
  });

  loadWorkers();
};

/* ===================== 刪除員工 ===================== */
window.deleteWorker = async function (id) {
  await deleteDoc(doc(db, "workers", id));
  loadWorkers();
  loadWorkerOptions();
};

/* ===================== 員工下拉 ===================== */
async function loadWorkerOptions() {
  const querySnapshot = await getDocs(collection(db, "workers"));
  const select = document.getElementById("dispatchName");

  select.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const w = doc.data();
    const option = document.createElement("option");
    option.value = w.name;
    option.textContent = w.name;
    select.appendChild(option);
  });
}

/* ===================== 新增派工 ===================== */
window.addDispatch = async function () {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;
  const status = document.getElementById("dispatchStatus").value;

  if (!name || !location || !date) return alert("請填寫完整");

  await addDoc(collection(db, "dispatch"), {
    name,
    location,
    date,
    status
  });

  /* 自動評分 */
  const scoreChange = scoreRule[status] || 0;
  updateWorkerScore(name, scoreChange, status);

  loadDispatch();
};

/* ===================== 更新員工分數 ===================== */
async function updateWorkerScore(name, change, reason) {
  const querySnapshot = await getDocs(collection(db, "workers"));

  querySnapshot.forEach(async (docSnap) => {
    const w = docSnap.data();
    if (w.name === name) {
      const newScore = (w.score || 0) + change;

      await updateDoc(doc(db, "workers", docSnap.id), {
        score: newScore
      });

      await addDoc(collection(db, "scoreHistory"), {
        name,
        change,
        reason,
        date: new Date().toLocaleString()
      });
    }
  });

  loadWorkers();
}

/* ===================== 讀取派工 ===================== */
async function loadDispatch() {
  const querySnapshot = await getDocs(collection(db, "dispatch"));

  let html = `
  <table>
    <tr>
      <th>員工</th>
      <th>地點</th>
      <th>日期</th>
      <th>狀態</th>
      <th>操作</th>
    </tr>
  `;

  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    html += `
    <tr>
      <td>${d.name}</td>
      <td>${d.location}</td>
      <td>${d.date}</td>
      <td>${d.status}</td>
      <td>
        <button onclick="deleteDispatch('${docSnap.id}')">刪除</button>
      </td>
    </tr>
    `;
  });

  html += "</table>";
  document.getElementById("dispatchList").innerHTML = html;
}

/* ===================== 刪除派工 ===================== */
window.deleteDispatch = async function (id) {
  await deleteDoc(doc(db, "dispatch", id));
  loadDispatch();
};

/* ===================== 初始化 ===================== */
window.onload = function () {
  loadWorkers();
  loadWorkerOptions();
  loadDispatch();
};
