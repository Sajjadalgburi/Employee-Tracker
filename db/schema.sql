DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

-- Creating department table
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the department
    name VARCHAR(30) NOT NULL -- Name column for department
);

-- Creating role table
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the role
    title VARCHAR(30) NOT NULL, -- To hold role title
    salary DECIMAL(10) NOT NULL, -- Salary for the respective employee role (fixed decimal definition)
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) -- Holds reference to department role that it belongs to
);

-- Creating employee table
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for the employee
    first_name VARCHAR(30) NOT NULL, -- To hold employee first name
    last_name VARCHAR(30) NOT NULL, -- To hold employee last name
    role_id INT,
    manager_id INT NULL, -- Employee's can have managers but this field can still be null if no manager is assigned
    FOREIGN KEY (role_id) REFERENCES role(id), -- To hold reference to employee role
    FOREIGN KEY (manager_id) REFERENCES employee(id) -- To hold reference to employee's manager
);
