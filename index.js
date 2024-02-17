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

const availableDepartment = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM department");
    return rows.map(({ id, name }) => ({ id, name }));
  } catch (error) {
    console.error("Error executing query:", error.message);
    return []; // return an empty array if there's an error
  } finally {
    if (connection) connection.release();
  }
};

const insertIntoRole = async (newRoleTitle, salary, department_id) => {
  let connection;
  try {
    connection = await pool.getConnection();
    // Corrected query syntax
    const [rows, fields] = await connection.execute(
      `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
      [newRoleTitle, salary, department_id]
    );
    console.log("\nResults:");
    console.log(rows);
    console.log("\n");
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const newRole = async () => {
  try {
    const { newRoleTitle, salary, department } = await inquirer.prompt([
      {
        type: "input",
        name: "newRoleTitle",
        message: "What is the Name of the New Role?",
        validate: function (value) {
          if (!value.trim()) {
            return "Role name cannot be empty!";
          }
          if (/\d/.test(value)) {
            return "Role name cannot contain numbers!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the Salary for this Role?",
        validate: function (value) {
          if (!value.trim()) {
            return "Role salary cannot be empty!";
          }
          if (!/^\d+$/.test(value)) {
            return "Salary should only contain numbers!";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department",
        message: "Select a department:",
        choices: async () => {
          try {
            const departments = await availableDepartment();
            return departments.map((dep) => dep.name);
          } catch (error) {
            console.error("Error fetching departments:", error.message);
            return []; // return an empty array if there's an error
          }
        },
      },
    ]);

    // Find the selected department by name
    const selectedDepartment = (await availableDepartment()).find(
      (dep) => dep.name === department
    );

    const { id: department_id } = selectedDepartment;

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const upperCase = capitalize(newRoleTitle);

    // Pass department name instead of department object
    insertIntoRole(newRoleTitle, salary, department_id);

    console.log(`\nAdded ${upperCase} to the Database\n`);
  } catch (err) {
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
      await selectEvrFromDep();
    } else if (chosenOption === "View All Roles") {
      await selectEvrFromRoles();
    } else if (chosenOption === "View All Employees") {
      await selectEvrFromEmployees();
    } else if (chosenOption === "Add New Department") {
      await newDepartment();
    } else if (chosenOption === "Add New Role") {
      await newRole();
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

// Calling the ASCII ART for nice ART!
// Art();

repeatQuestion();
