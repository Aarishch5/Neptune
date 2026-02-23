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

let tData = JSON.parse(localStorage.getItem(key)) || [];

// fn to save current data array to th local storge
function saveData() {
  localStorage.setItem(key, JSON.stringify(tData));
}

function addrowData(id, doctitle, formStatus, docAddEditDate) {
  tData.push({ id, doctitle, formStatus, docAddEditDate });
  saveData();
}

//     Add rows Logic

let selectedRow = null;

// Main table data form

function onFormSubmit() {
  const doctitle = document.getElementById("documentTitle").value;
  const formStatus = document.getElementById("formStatus").value;
  const docAddEditDate = Date.now();

  let indexVal = document.getElementById("formStatus").selectedIndex;

  if (doctitle.trim() === "" || indexVal === 0) {
    alert("empty Fields");
    return;
  }

  if (editRowId) {
    upDateRowData(doctitle, formStatus, docAddEditDate);
  } else {
    const id = Date.now();
    addrowData(id, doctitle, formStatus, docAddEditDate);
  }

  rowInsert();
  formRset();
}

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

  if(searchInputValue.length === 0 && searchData.length === 0){
      searchDataRender(tData);
  }else if(searchInputValue.length > 0 && searchData.length > 0){
    searchDataRender(searchData);
  }else if(searchInputValue.length > 0 && searchData.length === 0){
    alert("No matched item");
  }
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
    cell1.classList.add("titleText");

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
    

    const formattedDate = new Date(element.docAddEditDate);
    const formattedOnlyDate = formattedDate.toLocaleDateString("en-GB");
    const currTime = formattedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    cell3.appendChild(document.createTextNode(formattedOnlyDate));
    cell3.appendChild(document.createElement("br"));
    const timeSpan = document.createElement("span");
    timeSpan.textContent = currTime;

    cell3.classList.add("date");
    cell3.style.color = "#626D82";
    cell3.style.fontFamily = "Inter, sans-serif";
    cell3.appendChild(timeSpan);

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
    menuBtn.classList.add("menubtn1");
    cell5.appendChild(menuBtn);

    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown-menu");
    dropdown.style.display = "none"; 

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.id = element.id;
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.id = element.id;
    deleteBtn.classList.add("delete-btn");

    dropdown.appendChild(editBtn);
    dropdown.appendChild(deleteBtn);

    cell5.appendChild(dropdown);

    // Toggle dropdown on menu button click
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent event bubbling
      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((d) => {
        if (d !== dropdown){
           d.style.display = "none";
        }
      });
      // Toggle current dropdown
      dropdown.style.display =
        dropdown.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });
  });
}

// Edit functionality
// Menu Icon ele (Using event delegation now)

let editRowId = null;

const tableBody = document.querySelector(".content-table tbody");

tableBody.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {

    editRowId = editBtn.id;
    putDataInForm(editRowId);

    formBox.classList.add("active-popup");
  }

  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    
    let deleteBtnId = deleteBtn.id;
    tData = tData.filter((ele) => !deleteBtnId.includes(String(ele.id)));
    
    saveData();
    rowInsert();
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

function upDateRowData(doctitle, formStatus, docAddEditDate) {
  const index = tData.findIndex((ele) => String(ele.id) === String(editRowId));

  if (index !== -1) {
    tData[index].doctitle = doctitle;
    tData[index].formStatus = formStatus;
    tData[index].docAddEditDate = docAddEditDate;

    saveData();
  }

  editRowId = null; 
}

window.addEventListener("load", function () {
  dataRender(tData);
});
