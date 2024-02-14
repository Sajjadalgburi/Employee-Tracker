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
