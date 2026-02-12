alert("新版系統");

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const scoreRules = {
  完成: 2,
  準時: 1,
  遲到: -3,
  未到: -10,
  請假: -1,
  取消: -5
};

/* 新增員工 */
window.submitData = async function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) return alert("請輸入資料");

  await addDoc(collection(db, "workers"), {
    name,
    phone,
    score: 0
  });

  loadWorkers();
  loadWorkerOptions();
};

/* 員工列表 */
async function loadWorkers() {
  const snap = await getDocs(collection(db, "workers"));

  let html = `<table>
<tr><th>姓名</th><th>電話</th><th>評分</th><th>操作</th></tr>`;

  snap.forEach(d => {
    const w = d.data();
    html += `
<tr>
<td>${w.name}</td>
<td>${w.phone}</td>
<td>${w.score || 0}</td>
<td>
<button onclick="deleteWorker('${d.id}')">刪除</button>
</td>
</tr>`;
  });

  html += "</table>";
  workerList.innerHTML = html;
}

/* 刪除員工 */
window.deleteWorker = async function(id){
  await deleteDoc(doc(db,"workers",id));
  loadWorkers();
  loadWorkerOptions();
}

/* 員工選單 */
async function loadWorkerOptions() {
  const snap = await getDocs(collection(db, "workers"));
  const select = dispatchName;
  select.innerHTML = "";

  snap.forEach(d => {
    const w = d.data();
    const op = document.createElement("option");
    op.value = w.name;
    op.textContent = w.name;
    select.appendChild(op);
  });
}

/* 評分 */
async function applyScore(workerName, status) {
  const snap = await getDocs(collection(db, "workers"));

  snap.forEach(async d => {
    const w = d.data();
    if (w.name === workerName) {
      await updateDoc(doc(db,"workers",d.id),{
        score:(w.score||0)+scoreRules[status]
      });
    }
  });

  loadWorkers();
}

/* 新增派工 */
window.addDispatch = async function () {
  const name = dispatchName.value;
  const location = dispatchLocation.value;
  const date = dispatchDate.value;
  const status = dispatchStatus.value;

  if (!name || !location || !date) return alert("請填寫完整");

  await addDoc(collection(db,"dispatch"),{
    name,location,date,status
  });

  await applyScore(name,status);
  loadDispatch();
};

/* 派工列表 */
async function loadDispatch() {
  const snap = await getDocs(collection(db,"dispatch"));

  let html = `<table>
<tr><th>員工</th><th>地點</th><th>日期</th><th>狀態</th><th>操作</th></tr>`;

  snap.forEach(d=>{
    const x = d.data();
    html+=`
<tr>
<td>${x.name}</td>
<td>${x.location}</td>
<td>${x.date}</td>
<td>${x.status}</td>
<td><button onclick="deleteDispatch('${d.id}')">刪除</button></td>
</tr>`;
  });

  html+="</table>";
  dispatchList.innerHTML=html;
}

/* 刪除派工 */
window.deleteDispatch = async function(id){
  await deleteDoc(doc(db,"dispatch",id));
  loadDispatch();
}

window.onload = async function () {
  loadWorkers();
  loadWorkerOptions();
  loadDispatch();
};
