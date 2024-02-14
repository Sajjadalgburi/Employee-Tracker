const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const Art = require("./UI/EmpolyeeManager"); ///

// Connect to database
const db = mysql.createConnection(
  {
    // livehost
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    // Database name
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

// Calling the ASCII ART for nice ART!
Art;

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

inquirer
  .prompt([
    {
      type: "list",
      name: "chosenOption",
      message: "What Would You Like to Choose?",
      choices: UserChoices,
    },
  ])
  .then((answers) => {
    if (answers.chosenOption === "View All Departments") {
    } else {
      console.log("Processing Choice...");
      setTimeout(() => {
        console.log("====================");
        console.log("See You Later Boss!");
      }, 1500);
    }
  })
  .catch((error) => {
    console.error("There was an error!");
  });
