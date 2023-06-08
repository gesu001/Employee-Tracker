// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require("console.table");
const sql = require('./db/query_lib');
const choiceHelper = require('./lib/choiceHelper');

//View All Departments
const viewDepartments = () => {
    sql.getDepartments()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        init();
    })  
};

//View All Roles
const viewRoles = () => {
    sql.getRoles()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        init();
    })  
};

//View All Employees
const viewEmployees = () => {
    sql.getEmployees()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        init();
    })  
};


//add department

const addDepartment = () => {
    inquirer
    .prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
    }])
    .then((answer)=>{
        const sql =`INSERT INTO departments (department_name) VALUES (?)`
        db.query(sql, answer.department, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            //console.table(results)
            //console.log(results);
            viewDepartments()
            init();
        } 
      })
    })
};

//add role
const addRole = () => {
    const getDepartments = () =>
        db.promise().query(`SELECT * FROM departments`)
        .then((results) => {
            //console.log(results)
            const departArr = results[0].map((obj) => obj.department_name);
            //console.log(departArr);
            return departArr;
        })   

    inquirer
    .prompt([
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: getDepartments
    }
    ]).then(ans => {
        db.promise().query(`SELECT id FROM departments WHERE department_name = ?`, ans.department)
            .then(result => {
                console.log(result)
                let departmentId = result[0].map(obj => obj.id);
                console.log(departmentId[0])
                //console.log(departmentId[0])
                return departmentId[0]
            })
            .then((departmentId) => {
                db.promise().query(`INSERT INTO roles(title, salary, department_id)
            VALUES(?, ?, ?)`, [ans.title, ans.salary, departmentId]);
                init()
            })
    })

};

//add employee
const addEmployee = () => {
    const getRoles = () =>
        db.promise().query(`SELECT * FROM roles`)
        .then((results) => {
            //console.log(results)
            const roleArr = results[0].map((obj) => obj.title);
            //console.log(roleArr);
            return roleArr;
        })   
        const getManagers = () =>
        db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employees`)
        .then((results) => {
            //console.log(results)
            const managerArr = results[0].map((obj) => obj.manager);
            //console.log(managerArr);
            return managerArr;
        });

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
        },
        {
            type: 'list',
            name: 'title',
            message: "What is the employee's role?",
            choices: getRoles,
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: getManagers,
        }
    ]).then((answer) => {
        console.log(answer)
        db.promise().query(`SELECT id FROM roles WHERE title = ?`, answer.title)
            .then(result => {
               // console.log(result)
                let roleId = result[0].map(obj => obj.id);
                console.log(roleId[0])
                console.log(roleId[0])
                return roleId[0]
            })

        db.promise().query(`SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) ='${answer.manager}'`)
        .then(result => {
            //console.log(result)
            let employeeId = result[0].map(obj => obj.id);
            console.log(employeeId[0])
            console.log(employeeId[0])
            return employeeId[0]
            })
        })
        .then(db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES(?, ?, ?, ?)`, [answer.firstName, answer.lastName, roleId[0], employeeId[0]], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                //console.table(results)
                //console.log(results);
                viewEmployees();
                init();
            } 
        }))

};

// update employee's role
const updateRole = [
{
    type: 'list',
    name: 'employeeName',
    message: "Which employee's role do you want to update?",
    choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown','Sarah Lourd', 'Tom Allen'],
}];


function init() {
    inquirer
    .prompt([
    {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
    }])
    .then(answer => {
     switch (answer.menu) {
        case 'View All Departments': viewDepartments();
        break;
        case 'View All Roles': viewRoles();
        break;
        case 'View All Employees': viewEmployees();
        break;
        case 'Add Department': addDepartment();
        break;
        case 'Add Role': addRole();
        break;
        case 'Add Employee': addEmployee();
        break;
        case 'Update Employee Role': updateRole();
        break;
        case 'Quit':
            process.exit();
        default:
            break;
     }
    })
    .catch(err => console.error(err)); 
}
// Function call to initialize app
init();

