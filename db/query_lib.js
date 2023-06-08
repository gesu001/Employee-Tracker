
class DBQuery {
    constructor(db){
      this.db = db;
    }

//View All Departments
viewDepartments() {
    const sql =`SELECT * FROM departments`
    return this.db.promise().query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)})
};

//View All Roles
viewRoles () {
    const sql =`SELECT * FROM roles`
    return this.db.promise().query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)})
};

//View All Employees
viewEmployees () {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    ORDER By employees.id`;
    return this.db.promise().query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)})
};

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

getDepartments () {
    db.promise().query(`SELECT * FROM departments`)
    .then((results) => {
        //console.log(results)
        const departArr = results[0].map((obj) => obj.department_name);
        //console.log(departArr);
        return departArr;
    }) 
}
  

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