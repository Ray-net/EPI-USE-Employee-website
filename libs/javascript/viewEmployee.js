let employeenr = window.location.search;
let searcharray = employeenr.split("=");
function loadEmployeeData() {
  console.log("data");
  axios
    .get(`http://localhost:5000/api/findone?id=${searcharray[1]}`)
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
        .get(`http://localhost:5000/api/encrypt?str=${response.data.email.trim().toLowerCase()}`)
        .then((response) => {
          document.getElementById(
            "images"
          ).src = `http://www.gravatar.com/avatar/${response.data.split("= ")[1].trim()}?s=200`;
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
      .get(`http://localhost:5000/api/delete?id=${searcharray[1]}`).then(response => {
        location.href = '/';
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
  if (manager == employeenr) {
    alert("You may not be your own manager");
    return;
  }
  if (role != "CEO" && manager == "") {
    alert("You require a manager");
    return;
  }
  axios
    .post(`http://localhost:5000/api/update`, {
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
  location.reload();
});
