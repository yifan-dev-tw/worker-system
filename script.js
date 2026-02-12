import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-ajaVChBSIK7uXIgcv5JTlxDjuxLWHDA",
  authDomain: "worker-system.firebaseapp.com",
  projectId: "worker-system",
  storageBucket: "worker-system.firebasestorage.app",
  messagingSenderId: "249724369179",
  appId: "1:249724369179:web:9d14d30c499aec379dbbbe",
  measurementId: "G-H4WTDJ84TG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function submitData() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("請填寫姓名與電話");
    return;
  }

  await addDoc(collection(db, "workers"), {
    name: name,
    phone: phone,
    score: 0
  });

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";

  loadWorkers();
}

// 員工列表
async function renderWorkers() {
  const { collection, getDocs } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );

  const querySnapshot = await getDocs(collection(window.db, "workers"));

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

// 評分更新
function updateScore(index, change) {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  let score = workers[index].score || 0;
  score += change;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  workers[index].score = score;

  localStorage.setItem("workers", JSON.stringify(workers));
  renderWorkers();
}

// 下拉選單
function loadWorkerOptions() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];
  let select = document.getElementById("dispatchName");

  select.innerHTML = "";

  workers.forEach(function(w) {
    let option = document.createElement("option");
    option.value = w.name;
    option.textContent = w.name;
    select.appendChild(option);
  });
}

// 派工
function addDispatch() {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;

  const record = { name, location, date };

  let dispatchList = JSON.parse(localStorage.getItem("dispatch")) || [];
  dispatchList.push(record);
  localStorage.setItem("dispatch", JSON.stringify(dispatchList));

  // 完成派工自動加分
 let workers = JSON.parse(localStorage.getItem("workers")) || [];

workers.forEach(function(w) {
  if (w.name === name) {
    let score = (w.score || 0) + 2;
    if (score > 100) score = 100;
    w.score = score;
  }
});

localStorage.setItem("workers", JSON.stringify(workers));
renderWorkers();
renderDispatch();
}

// 派工列表
function renderDispatch() {
  let list = JSON.parse(localStorage.getItem("dispatch")) || [];

  let html = `
    <table>
      <tr>
        <th>員工</th>
        <th>地點</th>
        <th>日期</th>
        <th>操作</th>
      </tr>
  `;

  list.forEach(function(d, index) {
    html += `
      <tr>
        <td>${d.name}</td>
        <td>${d.location}</td>
        <td>${d.date}</td>
        <td>
          <button onclick="deleteDispatch(${index})">刪除</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("dispatchList").innerHTML = html;
}

// 初始化
window.onload = function() {
  renderWorkers();
  renderDispatch();
  loadWorkerOptions();
};

function deleteWorker(index) {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  if (!confirm("確定要刪除這位員工嗎？")) {
    return;
  }

  workers.splice(index, 1);

  localStorage.setItem("workers", JSON.stringify(workers));

  renderWorkers();
  loadWorkerOptions();
}

function deleteDispatch(index) {
  let list = JSON.parse(localStorage.getItem("dispatch")) || [];

  if (!confirm("確定刪除這筆派工紀錄？")) {
    return;
  }

  list.splice(index, 1);

  localStorage.setItem("dispatch", JSON.stringify(list));

  renderDispatch();
}

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
        <td>${w.score}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("workerList").innerHTML = html;
}

window.onload = function() {
  loadWorkers();
};
