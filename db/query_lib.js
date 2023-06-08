const db = require('./connection');

class DBQuery {
    constructor(db){
      this.db = db;
    }

//View All Departments
getDepartments() {
    return this.db.promise().query(`SELECT * FROM departments`)
};

//View All Roles
getRoles () {
    return this.db.promise().query(`SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.id`)
};

//View All Employees
getEmployees () {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    ORDER By employees.id`;
    return this.db.promise().query(sql)
};

getDepartmentId (data) {
    const values = [data.name];
    return this.db.promise().query(`SELECT id FROM departments WHERE department_name = ?`, values)
}

getRoleId (data) {
    const values = [data.title];
    return this.db.promise().query(`SELECT id FROM roles WHERE title=?`, values);
}


getEmployeeId (data) {
    const values = [data.manager];
    return this.db.promise().query(`SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) =?`, values)
}

getManagers () {
return this.db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE manager_id IS NULL`);
}

getEmployeeFullName () {
    return this.db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS fullName FROM employees`);
    }

//add department
addDepartment (data) {
    const values = [data.name];
    return this.db.promise().query(`INSERT INTO department (department_name) VALUES(?)`, values, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.log(results);
        };
    })
};

//add role
addRole (data) {
    const values = [data.title, data.salary, data.department_id];
    return this.db.promise().query(
        `INSERT INTO role 
        (title, salary, department_id) 
        VALUES(?,?,?)`,
        values, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(results);
            };
        })
};

//add employee
addEmployee () {
    const values = [data.firstName, data.lastName, data.role_id, data.manager_id];
    return this.db.promise().query(
        `INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
        VALUES(?,?,?,?)`,
        values, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(results);
            };
        })
};

// update employee's role
updateEmpRoleById(data) {
    const values = [data.role_id, data.emp_id];
    return this.db.promise().query(
        `UPDATE employee
         SET role_id = ?
         WHERE id = ?`,
        values, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(results);
            };
        })
  };
}

module.exports = new DBQuery(db);