var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'WYNN!373sql',
  database: 'employee_db'
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: 'userChoice',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
          'View All Employees',
          'View All Department',
          'View All Role',
          'Add Employees',
          'Add Department',
          'Add Role',
          'Update Employee Roles'
        ]
    })
    .then(function(answer) {
      // based on their answer, call correct function
      if (answer.userChoice === 'View All Employees') {
        viewEmployees();
      }
      else if(answer.postOrBid === 'BID') {
        bidAuction();
      } else{
        connection.end();
      }
    });
}

// function to view all employees in the database
function viewEmployees() {

      connection.query(
        'SELECT  * FROM employee_db.employee;',
        function(err) {
          if (err) throw err;
          console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          start();
        }
      );

    }

function bidAuction() {
  // query the database for all items being auctioned
  connection.query('SELECT * FROM auctions', function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: 'What auction would you like to place a bid in?'
        },
        {
          name: 'bid',
          type: 'input',
          message: 'How much would you like to bid?'
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            'UPDATE auctions SET ? WHERE ?',
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log('Bid placed successfully!');
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log('Your bid was too low. Try again...');
          start();
        }
      });
  });
}