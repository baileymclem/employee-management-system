var mysql = require("mysql");
var inquirer = require("inquirer");

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
      } else if (answer.userChoice === "Upate Employee Roles") {
        updateEmployeeRoles();
      } else {
        connection.end();
      }
    });
}

// function to view all employees in the database
function viewEmployees() {
  connection.query(
    "SELECT  * FROM employee_db.employee;",
    function (err, results) {
      if (err) throw err;
      // console.log('results', results);
      console.table(results);

      start();
    }
  );
}

function viewDepartments() {
  // query the database for all items being auctioned
  connection.query(
    "SELECT * FROM employee_db.department",
    function (err, results) {
      if (err) throw err;
      // console.log('results', results);
      console.table(results);

      start();
    }
  );
}

function viewRoles() {
  connection.query(
    "SELECT  * FROM employee_db.employee_role",
    function (err, results) {
      if (err) throw err;
      // console.log('results', results);
      console.table(results);

      start();
    }
  );
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

//console.log("roles", viewRoles);
function updateEmployeeRoles() {
  connection.query(
    "SELECT  * FROM employee_db.employee",
    function (err, results) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choiceEmployee",
            type: "list",
            message: "Whose role do you want to update?",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
          },
          {
            name: "newRole",
            type: "input",
            message: "What's the new role id?",
          },
        ])

        .then(function (answer) {
          var chosenEmployee;
          for (var i = 0; i < results.length; i++) {
            if (results[i].first_name === answer.choiceEmployee) {
              chosenEmployee = results[i];
            }
          }

          connection.query(
            "UPDATE employee_db.employee SET ? WHERE ?",
            {
              id: chosenEmployee.id,
              role_id: answer.newRole,
            },
            function (err) {
              if (err) throw err;
              console.log("Employee was updated successfully!");

              start();
            }
          );
        });
    }
  );
}
