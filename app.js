var mysql = require("mysql");
var inquirer = require("inquirer");
//const { values } = require("sequelize/types/lib/operators");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "WYNN!373sql",
  database: "employee_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "userChoice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employees",
        "Add Department",
        "Add Role",
        "Update Employee Roles",
      ],
    })
    .then(function (answer) {
      // based on their answer, call correct function
      if (answer.userChoice === "View All Employees") {
        viewEmployees();
      } else if (answer.userChoice === "View All Departments") {
        viewDepartments();
      } else if (answer.userChoice === "View All Roles") {
        viewRoles();
      } else if (answer.userChoice === "Add Employees") {
        addEmployee();
      } else if (answer.userChoice === "Add Department") {
        addDepartment();
      } else if (answer.userChoice === "Add Role") {
        addRole();
      } else if (answer.userChoice === "Update Employee Roles") {
        updateEmployeeRoles();
      } else {
        connection.end();
      }
    });
}

// function to view all employees in the database
function viewEmployees() {
  connection.query("SELECT  * FROM employee;", function (err, results) {
    if (err) throw err;
    // console.log('results', results);
    console.table(results);

    start();
  });
}

function viewDepartments() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    // console.log('results', results);
    console.table(results);

    start();
  });
}

function viewRoles() {
  connection.query("SELECT  * FROM employee_role", function (err, results) {
    if (err) throw err;
    // console.log('results', results);
    console.table(results);

    start();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "employeeRole",
        type: "input",
        message: "What is the role id?",
        // choices: roles,
      },
      {
        name: "employeeManager",
        type: "input",
        message: "What is the manager's id?",
      },
    ])

    .then(function (answer) {
      //console.log("answer", answer);

      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,
          role_id: answer.employeeRole,
          manager_id: answer.employeeManager,
        },
        function (err) {
          if (err) throw err;
          console.log("Employee was added successfully!");

          start();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the department you want to add?",
      },
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.departmentName,
        },
        function (err) {
          if (err) throw err;
          console.log("Department was added successfully!");

          start();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "What is the role you want to add?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary?",
      },
      {
        name: "roleDepartment",
        type: "input",
        message: "What is the department id?",
      },
    ])

    .then(function (answer) {
      connection.query(
        "INSERT INTO employee_role SET ?",
        {
          title: answer.roleName,
          salary: answer.roleSalary,
          department_id: answer.roleDepartment,
        },
        function (err) {
          if (err) throw err;
          console.log("Role was added successfully!");

          start();
        }
      );
    });
}

function updateEmployeeRoles() {

  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    function (err, results) {
      if (err) throw err;

      let listChoices = results.map((employees) => {
        var obj = {
          name: `${employees.first_name} ${employees.last_name}`,
          value: employees.id,
        };
        return obj;
      });

      inquirer
        .prompt({
          name: "employeeChoice",
          type: "list",
          message: "Whose role do you want to update?",
          choices: listChoices,
        })
        .then(function (answer) {
          connection.query(
            "SELECT id, title FROM employee_role",
            function (err, results) {
              if (err) throw err;

              let roleChoices = results.map((roles) => {
                var object = {
                  name: roles.title,
                  value: roles.id,
                };
                return object;
              });

              inquirer
                .prompt({
                  name: "roleChoice",
                  type: "list",
                  message: "Pick a role?",
                  choices: roleChoices,
                })
                .then(function (answer2) {

                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [answer2.roleChoice, answer.employeeChoice],
                    function (err) {
                      if (err) throw err;
                      console.log("Role was updated successfully!");

                      start();
                    }
                  );


                });
            }
          );
        });
    }
  );
}
