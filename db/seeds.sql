-- Seed the department table
INSERT INTO department (name) VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

-- Seed the role table
INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1),  -- Sales Lead in the Sales department
('Salesperson', 80000, 1),  -- Salesperson in the Sales department
('Lead Engineer', 150000, 2),  -- Lead Engineer in the Engineering department
('Software Engineer', 120000, 2),  -- Software Engineer in the Engineering department
('Account Manager', 160000, 3),  -- Account Manager in the Finance department
('Accountant', 125000, 3),  -- Accountant in the Finance department
('Legal Team Lead', 250000, 4),  -- Legal Team Lead in the Legal department
('Lawyer', 190000, 4);  -- Lawyer in the Legal department


-- Seeding the employee table with role_id included
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("John", "Doe", 1, NULL), -- John is a Sales Lead
("Mike", "Chan", 2, 1), -- Mike Chan is a Salesperson managed by John Doe
("Ashley", "Rodriguez", 3, NULL),  -- Ashley is a Lead Engineer
("Kevin", "Tupik", 4, 3), -- Kevin Tupik is a Software Engineer managed by Ashley Rodriguez
("Kunal", "Singh", 5, NULL), -- Kunal is an Account Manager
("Malia", "Brown", 6, 5), -- Malia Brown is an Accountant managed by Kunal Singh
("Sarah", "Lourd", 7, NULL), -- Sarah is a Legal Team Lead
("Tom", "Allen", 8, 7); -- Tom Allen is a Lawyer managed by Sarah Lourd
