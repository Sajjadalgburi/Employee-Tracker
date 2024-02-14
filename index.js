const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    // livehost
    host: "localhost",
    // MySQL username,
    user: DB_USER,
    // MySQL password
    password: DB_PASSWORD,
    // Database name
    database: DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);
