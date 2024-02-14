DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

-- Creating department table
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the department
    name VARCHAR(30) NOT NULL, -- Name column for department
);

-- Creating role table
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the role
    title VARCHAR(30) NOT NULL, -- To hold role title
    salary DECIMAL NOT NULL, -- Salary for the respective employee role 
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) -- Hold's reference to department role that it belongs to
);

