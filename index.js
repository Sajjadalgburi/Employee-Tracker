const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
require("dotenv").config();
const Art = require("./UI/EmpolyeeManager");
const cTable = require("console.table");

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
    console.log("Results:\n");
    console.table(rows);
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
    console.log("Results:\n");
    console.table(rows);
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
    console.log("Results:\n");

    console.table(rows);
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
    console.log("Results:\n");

    console.table(rows);
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
    console.log("Results:\n");

    console.table(rows);
    console.log("\n");
    // Prompting user for further action
    repeatQuestion();
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

const availableRole = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM role");
    return rows.map(({ id, title }) => ({ id, title }));
  } catch (error) {
    console.error("Error executing query:", error.message);
    return []; // return an empty array if there's an error
  } finally {
    if (connection) connection.release();
  }
};

const availableManager = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM employee");
    return rows.map(({ id, first_name, last_name, manager_id }) => ({
      id,
      first_name,
      last_name,
      manager_id,
    }));
  } catch (error) {
    console.error("Error executing query:", error.message);
    return []; // return an empty array if there's an error
  } finally {
    if (connection) connection.release();
  }
};

const insertIntoEmployee = async (
  first_name,
  last_name,
  role_id,
  manager_id
) => {
  let connection;
  try {
    connection = await pool.getConnection();
    // Corrected query syntax
    const [rows, fields] = await connection.execute(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
      [first_name, last_name, role_id, manager_id]
    );
    console.log("Results:\n");

    console.table(rows);
    console.log("\n");
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const newEmployee = async () => {
  try {
    const { first_name, last_name, role_id, manager_choice } =
      await inquirer.prompt([
        // input prompts for first_name, last_name, and role_id
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
          validate: function (value) {
            if (!value.trim()) {
              return "First name cannot be empty!";
            }
            if (/\d/.test(value)) {
              return "First name cannot contain numbers!";
            }
            return true;
          },
        },
        // input prompt for last_name
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
          validate: function (value) {
            if (!value.trim()) {
              return "Last name cannot be empty!";
            }
            if (/\d/.test(value)) {
              return "Last name cannot contain numbers!";
            }
            return true;
          },
        },
        // list prompt for role_id
        {
          type: "list",
          name: "role_id",
          message: "What is the employee's role?",
          choices: async () => {
            try {
              const RoleName = await availableRole();
              return RoleName.map((role) => role.title);
            } catch (error) {
              console.error("Error fetching RoleName:", error.message);
              return [];
            }
          },
        },
        // list prompt for manager_choice
        {
          type: "list",
          name: "manager_choice",
          message: "Does the employee have a manager?",
          choices: ["None", "Yes"],
        },
      ]);

    let manager_id = null;
    if (manager_choice === "Yes") {
      const { manager_name } = await inquirer.prompt([
        {
          type: "list",
          name: "manager_name",
          message: "Who is the employee's manager?",
          choices: async () => {
            try {
              const managerNames = await availableManager();
              return managerNames.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id, // manager ID is used as the value
              }));
            } catch (error) {
              console.error("Error fetching managerName:", error.message);
              return [];
            }
          },
        },
      ]);
      manager_id = manager_name;
    }

    const selectedRole = (await availableRole()).find(
      (role) => role.title === role_id
    );

    const { id: title } = selectedRole;

    await insertIntoEmployee(first_name, last_name, title, manager_id);

    // Prompting user for further action
    // repeatQuestion();
    console.log(`\nAdded ${first_name} ${last_name} to the Database\n`);
  } catch (err) {
    console.error("Error inserting employee:", err.message);
  }
};

const availableEmployee = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute("SELECT * FROM employee");
    return rows.map(({ id, first_name, last_name }) => ({
      id,
      first_name,
      last_name,
    }));
  } catch (error) {
    console.error("Error executing query:", error.message);
    return []; // return an empty array if there's an error
  } finally {
    if (connection) connection.release();
  }
};

const updateRole = async (employeeId, roleId) => {
  // Changed 'title' parameter to 'roleId'
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(
      `UPDATE employee SET role_id = ? WHERE id = ?`, // Updated 'title' to 'role_id'
      [roleId, employeeId] // Updated the parameters accordingly
    );
    console.log("Results:\n");
    console.table(rows);
    console.log("\n");
  } catch (error) {
    console.error("Error executing query:", error.message);
  } finally {
    if (connection) connection.release();
  }
};

const updateEmployeeRole = async () => {
  try {
    const { employee, newRole } = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: async () => {
          try {
            const employees = await availableEmployee();
            return employees.map(({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            }));
          } catch (error) {
            console.error("Error fetching employee name:", error.message);
            return [];
          }
        },
      },
      {
        type: "list",
        name: "newRole",
        message: "Which role do you want to assign the selected employee?",
        choices: async () => {
          try {
            const roles = await availableRole();
            return roles.map((role) => role.title);
          } catch (error) {
            console.error("Error fetching RoleName:", error.message);
            return [];
          }
        },
      },
    ]);

    const selectedRole = (await availableRole()).find(
      (role) => role.title === newRole
    );

    if (!selectedRole) {
      console.error("Selected role does not exist.");
      return;
    }

    const { id: roleId } = selectedRole;

    await updateRole(employee, roleId);

    console.log(`\nUpdated Employee's Role\n`);
  } catch (err) {
    console.error("Error updating employee:", err.message);
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
    } else if (chosenOption === "Add New Employee") {
      await newEmployee().then(() => repeatQuestion());
    } else if (chosenOption === "Update Employee Role") {
      await updateEmployeeRole().then(() => repeatQuestion());
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
Art();

repeatQuestion();
