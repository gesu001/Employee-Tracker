DROP TABLE employees_view;
CREATE TABLE employees_view AS
SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    ORDER By employees.id;
SELECT * FROM employees_view;

SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = 'Mike Chan';