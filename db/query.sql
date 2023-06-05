--View All Departments--
SELECT *
FROM departments;
--View All Role--
SELECT roles.id, roles.title, departments.department_name, roles.salary
FROM roles
LEFT JOIN departments
ON roles.department_id = departments.id;

--View All Employees--
SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name, employees.manager_id AS manager
FROM employees
JOIN roles
ON employees.role_id = roles.id
JOIN departments
ON roles.department_id = departments.id;

--add department--
INSERT INTO departments (department_name)
VALUES ("Service");
--add role--
INSERT INTO roles (title, salary, department_id)
VALUES ("Customer Service", 50000, 5),
--add employee--
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Harry", "Potter", 9, NULL),
--update employee role--
UPDATE employees
SET role_id = 5
WHERE id = 1;


