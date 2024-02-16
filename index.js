const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
require("dotenv").config();
const Art = require("./UI/EmpolyeeManager");

// Create a connection pool
const pool = mysql.createPool({
  // livehost
  host: "localhost",
  // MySQL username
  user: process.env.DB_USER,
  // MySQL password
  password: process.env.DB_PASSWORD,
  // Database name
  database: process.env.DB_NAME,
});

// Calling the ASCII ART for nice ART!
// Art();

const selectEvrFromDep = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM department");
    console.log("\n");
    console.log("Results:");
    console.log(rows);
    console.log("\n");
    repeatQuestion();
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const selectEvrFromRoles = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`
SELECT role.id, role.title, department.name AS department, role.salary
FROM role
INNER JOIN department ON role.department_id = department.id;`);
    console.log("\n");
    console.log("Results:");
    console.log(rows);
    console.log("\n");
    repeatQuestion();
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const selectEvrFromEmployees = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`
SELECT employee.id, 
       employee.first_name, 
       employee.last_name, 
       role.title,
       department.name AS department,
       role.salary,
       CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
`);
    console.log("\n");
    console.log("Results:");
    console.log(rows);
    console.log("\n");
    repeatQuestion();
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const UserChoices = [
  "View All Employees",
  "Add New Employee",
  "Update Employee Role",
  "View All Roles",
  "Add New Role",
  "View All Departments",
  "Add New Department",
  "Quit",
];

function repeatQuestion() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "chosenOption",
        message: "What Would You Like to Choose?",
        choices: UserChoices,
      },
    ])
    .then(({ chosenOption }) => {
      if (chosenOption === "View All Departments") {
        selectEvrFromDep();
      } else if (chosenOption === "View All Roles") {
        selectEvrFromRoles();
      } else if (chosenOption === "View All Employees") {
        selectEvrFromEmployees();
      } else {
        console.log("Processing Choice...");
        setTimeout(() => {
          console.log("====================");
          console.log("See You Later Boss!");
        }, 1500);
      }
    })
    .catch((err) => {
      console.error(`There was an error at ${err}`);
    });
}

repeatQuestion();
