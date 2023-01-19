const roles = {
  CEO: "CEO",
  Manager: "Manager",
  Employee: "Employee",
  Intern: "Intern",
};
//name, surname, birth date, employee number, salary,
//role/position, and reporting line manager.
var employeeData = [];
/*
      Description: get the employee data from database then calls buildtree on the load of index.html.
      input: none
      output: none
  
  */

const managementMap = new Map();
const employeesMap = new Map();
window.addEventListener("load", function () {
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
      //console.log(employeesMap);
      //console.log(managementMap);

      // EmployeeWithoutManagers variable for all upper management that will need a tree
      let EmployeeWithoutManagers = [];
      for (let i = 0; i < employeeData.length; i++) {
        if (employeeData[i].manager == "") {
          EmployeeWithoutManagers.push(employeeData[i].employeeNumber);
        }
      }
      //console.log(EmployeeWithoutManagers);
      let html = "";
      for (let i = 0; i < EmployeeWithoutManagers.length; i++) {
        html = html + "<ul>" + await buildTree(EmployeeWithoutManagers[i]) + "</ul><br/><br/>";
      }
      //console.log(html);
      //console.log(html);
      let container = this.document.querySelector(".tree");
      container.innerHTML = html;
    })
    .catch((error) => console.log(error));
});

/*
 *       @Description: function that builds a hierarchy tree through the given start member of the
 *                     employee list and returns an HTML string.
 *       @input: Employee nr,
 *       @output: String of HTML
 *
 */
async function buildTree(employeeNr) {
  let workerArray = managementMap.get(employeeNr);
  
  let employee = employeesMap.get(employeeNr);
  console.log(employee);
  if (employee.email == "" || employee.email == null) {
    let html = "";
  html =
    html + '<li><div><a href="/view-employee?id=' + employeeNr + '"><img src=';
    html +=
      '"https://www.gravatar.com/avatar/00000000000000000000000000000000" alt="Employee" style="width:100%">';
    html += "<h3> " + employee.name + " " + employee.surname + "</h3></a>";
    if (workerArray.length > 0) {
      html = html + "</div>";
    } else {
      html = html + "</div>";
    }
    if (workerArray.length > 0) {
      html = html + "<ul class='active'>";
      for (let i = 0; i < workerArray.length; i++) {
        console.log(employee);
        html = html + await buildTree(workerArray[i]) + "</li>";
      }
      html = html + "</ul>";
    } else {
      console.log(employee);
      html = html + "</li>";
    }
    return html;
  } else {
    console.log('here');
    let element = await axios
      .get(
        `https://epi-use-employee-tree.herokuapp.com/api/encrypt?str=${employee.email
          .trim()
          .toLowerCase()}`
      )
      .then(async (response) => {
        html = '';
        html =
    html + '<li><div><a href="/view-employee?id=' + employeeNr + '"><img src=';
        html += `"http://www.gravatar.com/avatar/${response.data
          .split("= ")[1]
          .trim()}?s=200" alt="Employee" style="width:100%">`;
        html += "<h3> " + employee.name + " " + employee.surname + "</h3></a>";
        if (workerArray.length > 0) {
          html = html + "</div>";
        } else {
          html = html + "</div>";
        }
        if (workerArray.length > 0) {
          html = html + "<ul class='active'>";
          for (let i = 0; i < workerArray.length; i++) {
            console.log(employee);
            html = html + await buildTree(workerArray[i]) + "</li>";
          }
          html = html + "</ul>";
        } else {
          console.log(employee);
          html = html + "</li>";
        }
        console.log(html);
        return html;
        
      })
      .catch((error) => console.log(error));
      return html = element;
      
  }
}
function log() {
  console.log("here");
}

function openForm() {
  document.getElementById("modalOne").style.display = "block";
}
function closeForm() {
  document.getElementById("modalOne").style.display = "none";
}

$(".searchbtn").on("click", async function () {
  var nameValue = document.getElementById("search").value;
  var employee;
  console.log(nameValue);
  for (let i = 0; i < employeeData.length; i++) {
    if (nameValue.toLowerCase().trim() == employeeData[i].name.toLowerCase().trim()) {
      employee = employeeData[i].employeeNumber;
      break;
    }
    if (nameValue.toLowerCase().trim() == employeeData[i].surname.toLowerCase().trim()) {
      employee = employeeData[i].employeeNumber;
      break;
    }
    if (nameValue.toLowerCase().trim() == employeeData[i].employeeNumber.toLowerCase().trim()) {
      employee = employeeData[i].employeeNumber;
      break;
    }
    if (nameValue.toLowerCase().trim() == (employeeData[i].name.toLowerCase().trim()+ ' '+employeeData[i].surname.toLowerCase().trim())) {
      employee = employeeData[i].employeeNumber;
      break;
    }
  }
  if(employee == undefined)
  {
    return ;
  }
  else{
    location.replace(`/view-employee?id=${employee}`)
  }
  
});

$(".create").on("click", function () {
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
  if(manager != '' && manager != undefined && employeesMap.get(manager) == undefined)
  {
    alert("Need an existing manager");
    return;
  }

  axios
    .post(`https://epi-use-employee-tree.herokuapp.com/api/create`, {
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
