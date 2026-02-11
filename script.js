function submitData() 
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  const worker = {
    name: name,
    phone: phone,
    score: 0
  };

  let workers = JSON.parse(localStorage.getItem("workers")) || [];
  workers.push(worker);
  localStorage.setItem("workers", JSON.stringify(workers));

  loadWorkerOptions();
  renderWorkers();

  document.getElementById("result").innerHTML = "資料已儲存！";
}

function showWorkers() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  let html = `
    <table border="1" width="100%" style="border-collapse: collapse;">
      <tr>
        <th>姓名</th>
        <th>電話</th>
        <th>評分</th>
      </tr>
  `;

  workers.forEach(function(w) {
    html += `
      <tr>
        <td>${w.name}</td>
        <td>${w.phone}</td>
        <td>${w.score || 0}</td>
      </tr>
    `;
   });

    html += "</table>";

    document.getElementById("workerList").innerHTML = html;
}

function addDispatch() {
  const name = document.getElementById("dispatchName").value;
  const location = document.getElementById("dispatchLocation").value;
  const date = document.getElementById("dispatchDate").value;

  const record = {
    name: name,
    location: location,
    date: date
  };

  let dispatchList = JSON.parse(localStorage.getItem("dispatch")) || [];
  dispatchList.push(record);
  localStorage.setItem("dispatch", JSON.stringify(dispatchList));
  renderDispatch();
  document.getElementById("dispatchResult").innerHTML = "派工已記錄！";
}

function loadWorkerOptions() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];
  let select = document.getElementById("dispatchName");

  if (!select) return;

  select.innerHTML = "";

  workers.forEach(function(w) {
    let option = document.createElement("option");
    option.value = w.name;
    option.textContent = w.name;
    select.appendChild(option);
  });
}

function renderWorkers() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  let html = "";

  workers.forEach(function(w) {
    html += "<div>" + w.name + " / " + w.phone + "</div>";
  });

  document.getElementById("workerList").innerHTML = html;
}html;
}

function renderDispatch() {
  let dispatchList = JSON.parse(localStorage.getItem("dispatch")) || [];

  let html = `
    <table border="1" width="100%" style="border-collapse: collapse;">
      <tr>
        <th>員工</th>
        <th>地點</th>
        <th>日期</th>
      </tr>
  `;

  dispatchList.forEach(function(d) {
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

window.onload = function() {
  loadWorkerOptions();
  renderWorkers();
  renderDispatch();
};
};
