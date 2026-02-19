let formBox = document.querySelector(".formBox");
let btnToCancelForm = document.querySelector(".form-cancel-button");
let addBtn = document.querySelector("#add");
const key = "tableData"; // key for table

//    to Show the form
addBtn.addEventListener("click", function () {
  formBox.classList.add("active-popup");
});

btnToCancelForm.addEventListener("click", () => {
  formBox.classList.remove("active-popup");
});

// Initializing the array from local storage or use empty array

let tData = JSON.parse(localStorage.getItem(key)) || [];

// fn to save current data array to th local storge
function saveData() {
  localStorage.setItem(key, JSON.stringify(tData));
}

function addrowData(id, doctitle, formStatus) {
  tData.push({ id, doctitle, formStatus });
  saveData();
}

//     Add rows Logic

let selectedRow = null;

// Main table data form
function onFormSubmit() {
  const doctitle = document.getElementById("documentTitle").value;
  const formStatus = document.getElementById("formStatus").value;
  const id = Date.now();

  let indexVal = document.getElementById("formStatus").selectedIndex;

  if (doctitle.trim() === "" || indexVal === 0) {
    alert("empty Fields");
    return;
  }

  addrowData(id, doctitle, formStatus);

  rowInsert();
  formRset();
}

window.addEventListener("load", function () {
  rowInsert();
});

function rowInsert() {
  let tBody = document.querySelector("tbody");
  tBody.innerHTML = "";

  dataRender(tData);

  formBox.classList.remove("active-popup");
}

function formRset() {
  document.getElementById("documentTitle").value = "";
  document.getElementById("formStatus").selectedIndex = 0;
}

// Deleting Multiple

// Multiple delete btn
let multiDeleteBtn = document.querySelector("#multiDelete");

multiDeleteBtn.addEventListener("click", function () {
  const checkBoxes = document.querySelectorAll(
    'table input[type="checkbox"]:checked',
  );

  if (checkBoxes.length === 0) {
    alert("Add atleast one row");
    return;
  }

  const checkboxIds = Array.from(checkBoxes, (ele) => ele.id);

  tData = tData.filter((ele) => !checkboxIds.includes(String(ele.id)));

  saveData();

  rowInsert();
});

// Search Button Functionality

function searchFunction() {
  let searchInput = document.querySelector("#searchInput");
  const searchInputValue = searchInput.value.trim().toLowerCase();

  let searchData = tData.filter(
    (ele) =>
      String(ele.doctitle).trim().toLowerCase() ===
      String(searchInputValue).toLowerCase(),
  );

  searchDataRender(searchData);
}

function searchDataRender(searchData) {
  let tBody = document.querySelector("tbody");
  tBody.innerHTML = "";
  dataRender(searchData);
}

function dataRender(data) {
  data.forEach((element) => {
    const table = document.querySelector(".content-table tbody");
    const newRow = table.insertRow();
    newRow.id = element.id;

    const cell0 = newRow.insertCell(0);
    cell0.innerHTML = `<input id="${element.id}" type="checkbox">`;

    const cell1 = newRow.insertCell(1);
    cell1.textContent = element.doctitle;
    
    const cell2 = newRow.insertCell(2);

    const statusSpan = document.createElement("span");
    statusSpan.textContent = element.formStatus;

    if (element.formStatus === "Completed") {
      statusSpan.classList.add("status-completed");
    } else if (element.formStatus === "Needs Signing") {
      statusSpan.classList.add("status-needsSigning");
    } else if (element.formStatus === "Pending") {
      statusSpan.classList.add("status-pending");
    }
    cell2.appendChild(statusSpan);

    // date/ time
    const cell3 = newRow.insertCell(3);
    const currDate = new Date();
    cell3.textContent = currDate.toLocaleString();
    const cell4 = newRow.insertCell(4);
    const actionButton = document.createElement("button");

    if (element.formStatus === "Completed") {
      actionButton.textContent = "Download";
    } else if (element.formStatus === "Pending") {
      actionButton.textContent = "Preview";
    } else if (element.formStatus === "Needs Signing") {
      actionButton.textContent = "Sign Now";
    }

    actionButton.classList.add("btn5");
    cell4.appendChild(actionButton);

    const cell5 = newRow.insertCell(5);
    let menuBtn = document.createElement("button");

    const img = document.createElement("img");
    img.src = "images/menuIcon.svg"; // menu icon
    img.classList.add("imgInTable");

    menuBtn.appendChild(img);
    menuBtn.id = element.id;
    
    menuBtn.classList.add("menubtn1");

    cell5.appendChild(menuBtn);

    
  });
}

// Edit functionality
// Menu Icon ele (Using event delegation now)

let tableMenuBtn = document.querySelector(".content-table tbody");

tableMenuBtn.addEventListener("click", function (e) {
  const btn = e.target.closest(".menubtn1");
  if (btn) {
    console.log(btn.id);
    putDataInForm(btn.id);
    formBox.classList.add("active-popup");
  }
});

function putDataInForm(btnId) {
  tData.forEach((ele) => {
    if (ele.id == btnId) {
      // put data in the table
    
      document.getElementById("documentTitle").value = ele.doctitle;
      document.getElementById("formStatus").value = ele.formStatus;
    }
  });
}

