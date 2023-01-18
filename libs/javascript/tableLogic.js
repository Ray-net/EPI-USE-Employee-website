
    window.addEventListener("load", function () {
        axios.get(`http://localhost:5000/api/findall`).then(
                              response => {
                    
                    let employeeData = response.data;
                    let html = "";
                      html += buildtable(employeeData) ;
                    let container = document.getElementById('populate');
                    container.innerHTML = html;
                    console.log(html);
                  }).catch(error=> console.log(error)); 
                              }
                          )

function buildtable(employeeData){
    console.log('here');
    console.log(employeeData);
    console.log('here');
    let html = '';
    for(let i = 0; i< employeeData.length;i++)
    {
        html += '<tr><td>' + employeeData[i].employeeNumber + '</td>';
        html += '<td>' + employeeData[i].name + '</td>';
        html += '<td>' + employeeData[i].surname + '</td>';
        html += '<td>' + employeeData[i].dateOfBirth + '</td>';
        html += '<td>' + employeeData[i].role + '</td>';
        html += '<td>' + employeeData[i].manager + '</td>';
        html += '<td>' + employeeData[i].salary + '</td>';
        html += '<td>' + employeeData[i].email + '</td></tr>';
    }
    return html;
}
/*
<th>Employee Number</th>
						<th>Name</th>
						<th>Surname</th>
						<th>Role</th>
						<th>Manager</th>
						<th>Salary</th>
						<th>E-mail</th>
*/