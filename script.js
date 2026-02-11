function submitData() {
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

  document.getElementById("result").innerHTML = "資料已儲存！";
}

function showWorkers() {
  let workers = JSON.parse(localStorage.getItem("workers")) || [];

  let text = "<h3>工人名單</h3>";

  workers.forEach(function(w) {
    text += w.name + " / 分數：" + (w.score || 0) + "<br>";
  });

  document.getElementById("result").innerHTML = text;
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

window.onload = function() {
  loadWorkerOptions();
};
