let employeenr = window.location.search;
let searcharray = employeenr.split("=");
const managementMap = new Map();
const employeesMap = new Map();
function loadEmployeeData() {
  axios
    .get(`https://epi-use-employee-tree.herokuapp.com/api/findall`)
    .then(async (response) => {
      //console.log('hetre');
      //console.log(response.data);
      employeeData = response.data;
      //console.log(employeeData);
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
    })
    .catch((error) => console.log(error));
  console.log("data");
  axios
    .get(`https://epi-use-employee-tree.herokuapp.com/api/findone?id=${searcharray[1]}`)
    .then((response) => {
      document.querySelector("#name").value = response.data.name;
      document.querySelector("#employeenr").value =
        response.data.employeeNumber;
      document.querySelector("#surname").value = response.data.surname;
      document.querySelector("#dob").value = response.data.dateOfBirth;
      document.querySelector("#salary").value = response.data.salary;
      document.querySelector("#manager").value = response.data.manager;
      document.querySelector("#role").value = response.data.role;
      document.querySelector("#email").value = response.data.email;

      document.querySelector(".name").innerHTML +=
        response.data.name + " " + response.data.surname;
      document.querySelector(".role").innerHTML += response.data.role;
      document.querySelector(".employeenr").innerHTML +=
        response.data.employeeNumber;
      document.querySelector(".manager").innerHTML += response.data.manager;
      document.querySelector(".salary").innerHTML +=
        "R " + response.data.salary;
      axios
        .get(`https://epi-use-employee-tree.herokuapp.com/api/encrypt?str=${response.data.email.trim().toLowerCase()}`)
        .then((response) => {
          document.getElementById(
            "images"
          ).src = `https://www.gravatar.com/avatar/${response.data.split("= ")[1].trim()}?s=200`;
        })
        .catch((error) => console.log(error));

      //console.log(response.data);
    })
    .catch((error) => console.log(error));
}
function editable() {
  //make document editable
  document.querySelector("#name").removeAttribute("readonly");
  document.querySelector("#employeenr").removeAttribute("readonly");
  document.querySelector("#surname").removeAttribute("readonly");
  document.querySelector("#dob").removeAttribute("readonly");
  document.querySelector("#salary").removeAttribute("readonly");
  document.querySelector("#manager").removeAttribute("readonly");
  document.querySelector("#role").removeAttribute("readonly");
}
function openForm() {
  document.getElementById("popup").style.display = "block";
}
function closeForm() {
  document.getElementById("popup").style.display = "none";
}

$("#delete").on("click", function () {
      axios
      .get(`https://epi-use-employee-tree.herokuapp.com/api/delete?id=${searcharray[1]}`).then(response => {
        location.replace('/');
      }).catch((error) => console.log(error)); 
});



$("#editdata").on("click", function () {
  var name = document.getElementById("name").value;
  var employeenr = document.getElementById("employeenr").value;
  var surname = document.getElementById("surname").value;
  var dob = document.getElementById("dob").value;
  var salary = document.getElementById("salary").value;
  var manager = document.getElementById("manager").value;
  var role = document.getElementById("role").value;
  var email = document.getElementById("email").value;
  if( salary == '')
  {
    alert("Salary must be entered")
    return;
  }
  if( name == '')
  {
    alert("Name must be entered")
    return;
  }
  if( employeenr == '')
  {
    alert("Employee number must be entered")
    return;
  }
  if( role == '')
  {
    alert("Role must be entered")
    return;
  }
  if( surname == '')
  {
    alert("Surname must be entered")
    return;
  }
  if(isNaN(salary))
  {
    alert("Salary must be a number")
    return;
  }
  if (manager == employeenr) {
    alert("You may not be your own manager");
    return;
  }
  if (role != "CEO" && manager == "") {
    alert("You require a manager");
    return;
  }
  if(manager != '' && manager != undefined && employeesMap.get(manager) == undefined)
  {
    alert("Need an existing manager");
    return;
  }
  axios
    .post(`https://epi-use-employee-tree.herokuapp.com/api/update`, {
      originalId: searcharray[1],
      name: name,
      surname: surname,
      dob: dob,
      employeenumber: employeenr,
      salary: salary,
      manager: manager,
      role: role,
      email: email,
    })
    .then(alert("success"))
    .catch((error) => console.log(error));
  location.replace(`/view-employee?id=${employeenr}`);
});


