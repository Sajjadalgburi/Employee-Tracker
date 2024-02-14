DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

-- Creating department table
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the department
    name VARCHAR(30) NOT NULL, -- Name column for department
)

