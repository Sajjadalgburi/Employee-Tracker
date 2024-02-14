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
