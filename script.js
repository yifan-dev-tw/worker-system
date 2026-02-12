// 新增員工
function submitData() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  const worker = { name, phone };

  let workers = JSON.parse(localStorage.getItem("workers")) || [];
  workers.push(worker);
  localStorage.setItem("workers", JSON.stringify(workers));

  renderWorkers();
  loadWorkerOptions();
}

// 員工列表
function renderWorkers() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  let html = `
    <table>
      <tr>
        <th>姓名</th>
        <th>電話</th>
        <th>評分</th>
        <th>操作</th>
      </tr>
  `;

  workers.forEach(function(w, index) {
    html += `
      <tr>
        <td>${w.name}</td>
        <td>${w.phone}</td>
        <td>${w.score}</td>
        <td>
          <button onclick="updateScore(${index}, 20)">首次完成</button>
          <button onclick="updateScore(${index}, 2)">完成</button>
          <button onclick="updateScore(${index}, 0.5)">準時</button>
          <button onclick="updateScore(${index}, 1)">8小時</button>
          <button onclick="updateScore(${index}, 3)">連3天</button>
          <br>
          <button onclick="updateScore(${index}, -3)">遲到</button>
          <button onclick="updateScore(${index}, -2)">早退</button>
          <button onclick="updateScore(${index}, -10)">未到</button>
        </td>
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
    w.score = (w.score || 0) + 2;
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
      </tr>
  `;

  list.forEach(function(d) {
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

// 初始化
window.onload = function() {
  renderWorkers();
  renderDispatch();
  loadWorkerOptions();
};
