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

//? ──────────────────────────────────────────────────────────────────────────────── ?
// Function to insert a new department into the database
const insertIntoDep = async (departmentName) => {
  let connection;
  try {
    // Establishing a database connection
    connection = await pool.getConnection();

    // Executing SQL query to insert a new department into the 'department' table
    const [rows, fields] = await connection.execute(
      `INSERT INTO department (name) VALUES (?)`,
      [departmentName]
    );

    // Logging the results of the query
    console.log("\n");
    console.log("Results:");
    console.log(rows);
    console.log("\n");

    // Prompting user for further action
    repeatQuestion();
  } catch (error) {
    // Handling errors that occur during the execution of the query
    console.error("Error executing query:", error.message);
  } finally {
    // Releasing the database connection when done, regardless of success or failure
    if (connection) connection.release();
  }
};

// Function to prompt the user for a new department name and insert it into the database
const newDepartment = async () => {
  try {
    // Prompting user for department name using inquirer module
    const { departmentName } = await inquirer.prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the Name of the Department?",
        // Validation function to ensure the department name is valid
        validate: function (value) {
          if (!value.trim()) {
            return "Department name cannot be empty!";
          }
          // Check if the value contains only numbers
          if (/\d/.test(value)) {
            return "Department name cannot contain numbers!";
          }

          return true; // Return true if validation passes
        },
      },
    ]);

    // Function to capitalize the first letter of a string
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Capitalizing the first letter of the department name
    const upperCase = capitalize(departmentName);

    // Calling the function to insert the department into the database
    insertIntoDep(departmentName);

    // Logging the successful addition of the department to the database
    console.log(`\nAdded ${upperCase} to the Database\n`);

    // Prompting user for further action
    repeatQuestion();
  } catch (err) {
    // Handling errors that occur during the process
    console.error(`There was an error: ${err}`);
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

async function repeatQuestion() {
  try {
    const { chosenOption } = await inquirer.prompt([
      {
        type: "list",
        name: "chosenOption",
        message: "What Would You Like to Choose?",
        choices: UserChoices,
      },
    ]);

    if (chosenOption === "View All Departments") {
      selectEvrFromDep();
    } else if (chosenOption === "View All Roles") {
      selectEvrFromRoles();
    } else if (chosenOption === "View All Employees") {
      selectEvrFromEmployees();
    } else if (chosenOption === "Add New Department") {
      newDepartment();
    } else {
      console.log("Processing Choice...");
      setTimeout(() => {
        console.log("====================");
        console.log("See You Later Boss!");
      }, 1500);
    }
  } catch (err) {
    console.error(`There was an error at ${err}`);
  }
}

repeatQuestion();
