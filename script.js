import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========= 新增員工 ========= */
window.submitData = async function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("請輸入姓名與電話");
    return;
  }

  try {
    await addDoc(collection(db, "workers"), {
      name,
      phone,
      score: 0
    });

    alert("員工新增成功");

    loadWorkers();
    loadWorkerOptions();

  } catch (e) {
    console.error(e);
    alert("新增失敗");
  }
};

/* ========= 讀取員工 ========= */
async function loadWorkers() {
  const querySnapshot = await getDocs(collection(db, "workers"));

  let html = `
    <table>
      <tr>
        <th>姓名</th>
        <th>電話</th>
        <th>評分</th>
      </tr>
  `;

  querySnapshot.forEach((doc) => {
    const w = doc.data();
    html += `
      <tr>
        <td>${w.name}</td>
        <td>${w.phone}</td>
        <td>${w.score ?? 0}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("workerList").innerHTML = html;
}

/* ========= 員工下拉選單 ========= */
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

/* ========= 新增派工 ========= */
window.addDispatch = async function () {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;

  if (!name || !location || !date) {
    alert("請填寫完整派工資料");
    return;
  }

  try {
    await addDoc(collection(db, "dispatch"), {
      name,
      location,
      date
    });

    alert("派工新增成功");

    loadDispatch();

  } catch (e) {
    console.error(e);
    alert("派工新增失敗");
  }
};

/* ========= 讀取派工 ========= */
async function loadDispatch() {
  const querySnapshot = await getDocs(collection(db, "dispatch"));

  let html = `
    <table>
      <tr>
        <th>員工</th>
        <th>地點</th>
        <th>日期</th>
      </tr>
  `;

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    html += `
      <tr>
        <td>${d.name}</td>
        <td>${d.location}</td>
        <td>${d.date}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("dispatchList").innerHTML = html;
}

/* ========= 初始化 ========= */
window.onload = function () {
  loadWorkers();
  loadWorkerOptions();
  loadDispatch();
};
