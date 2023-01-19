document.querySelectorAll(".sortable th").forEach((column) => {
  column.addEventListener("click", () => {
    const tableData = column.parentElement.parentElement.parentElement;
    const IndexOfHead = Array.prototype.indexOf.call(
      column.parentElement.children,
      column
    );
    const setAsc = column.classList.contains("asc");

    SortTable(tableData, IndexOfHead, !setAsc);
  });
});
let employeesMap = new Map();
let managementMap = new Map();
window.addEventListener("load", function () {
  axios
    .get(`https://epi-use-employee-tree.herokuapp.com/api/findall`)
    .then((response) => {
      let employeeData = response.data;
      let html = "";
      html += buildtable(employeeData);
      let container = document.getElementById("populate");
      container.innerHTML = html;
      console.log(html);
      let roleValues = [...new Set(employeeData.map((item) => item.role))];

      for (let i = 0; i < employeeData.length; i++) {
        employeesMap.set(employeeData[i].employeeNumber, employeeData[i]);
      }

      for (let i = 0; i < employeeData.length; i++) {
        if (!managementMap.get(employeeData[i].employeeNumber)) {
          managementMap.set(employeeData[i].employeeNumber, []);
        }

        if (employeeData[i].manager != "") {
          if (managementMap.get(employeeData[i].manager)) {
            let workerArray = managementMap.get(employeeData[i].manager);
            workerArray.push(employeeData[i].employeeNumber);
            managementMap.set(employeeData[i].manager, workerArray);
          } else {
            let workerArray = [];
            workerArray.push(employeeData[i].employeeNumber);
            managementMap.set(employeeData[i].manager, workerArray);
          }
        }
      }
      populateManagers();
      populateRoles(roleValues);
    })
    .catch((error) => console.log(error));
});

function buildtable(employeeData) {
  console.log("here");
  console.log(employeeData);
  console.log("here");
  let html = "";
  for (let i = 0; i < employeeData.length; i++) {
    html += "<tr><td>" + employeeData[i].employeeNumber + "</td>";
    html += "<td>" + employeeData[i].name + "</td>";
    html += "<td>" + employeeData[i].surname + "</td>";
    html += "<td>" + employeeData[i].dateOfBirth + "</td>";
    html += "<td>" + employeeData[i].role + "</td>";
    html += "<td>" + employeeData[i].manager + "</td>";
    html += "<td>" + employeeData[i].salary + "</td>";
    html += "<td>" + employeeData[i].email + "</td></tr>";
  }
  return html;
}
function SortTable(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  tBody.append(...sortedRows);

  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("asc", "desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("desc", !asc);
}

function filterTableRole() {
  const RoleSelect = document.querySelector(".roleSelect");
  var filter, table, tr, td, i, txtValue;

  filter = RoleSelect.value.toUpperCase();
  table = document.querySelector(".sortable");
  tr = table.getElementsByTagName("tr");
  if (filter == "ALL") {
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "";
    }
  } else {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[4];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

function filterTableManger() {
  const RoleSelect = document.querySelector(".managerSelect");
  var filter, table, tr, td, i, txtValue;

  filter = RoleSelect.value.toUpperCase();
  table = document.querySelector(".sortable");
  tr = table.getElementsByTagName("tr");
  if (filter == "ALL") {
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "";
    }
  } else {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[5];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

function filterTableAge() {
  const RoleSelect = document.querySelector(".ageSelect");
  var filter, table, tr;

  filter = RoleSelect.value.toUpperCase();
  table = document.querySelector(".sortable");
  tr = table.getElementsByTagName("tr");

  switch (filter) {
    case "20": {
      tablesort(tr, 0, 20);
      break;
    }
    case "30": {
      tablesort(tr, 20, 30);
      break;
    }
    case "40": {
      tablesort(tr, 30, 40);
      break;
    }
    case "50": {
      tablesort(tr, 40, 50);
      break;
    }
    case "60": {
      tablesort(tr, 50, 60);
      break;
    }
    case "70": {
      tablesort(tr, 60, 70);
      break;
    }

    default: {
      for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
      }
      break;
    }
  }
}

function tablesort(tr, min, max) {
  var txtValue, td;
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtValue = td.textContent || td.innerText;
      let age = getAge(txtValue);
      if (age >= min && age <= max) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function populateRoles(roles) {
  const selector = document.querySelector(".roleSelect");
  html = '<option value="all">All Roles</option>';
  for (let i = 0; i < roles.length; i++) {
    html += `<option value="${roles[i]}">${roles[i]}</option>`;
  }
  selector.innerHTML = html;
}

function populateManagers() {
  const selector = document.querySelector(".managerSelect");
  html = '<option value="all">All Mangers</option>';
  for (let [key, value] of managementMap) {
    if (value != []) {
      let fullname =
        employeesMap.get(key).name + " " + employeesMap.get(key).surname;
      html += `<option value="${key}">${fullname}</option>`;
    }
  }
  selector.innerHTML = html;
}

function getAge(dateString) {
  
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function filterSalary()
{
  var table, tr, td, txtValue;
  const min = document.querySelector("#min");
  const max = document.querySelector("#max");
  table = document.querySelector(".sortable");
  tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[6];
    if (td) {
      txtValue = Number(td.textContent || td.innerText);
      console.log(txtValue);
      if (txtValue >= min.value && txtValue <= max.value) {
        console.log(txtValue);
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }


  
}