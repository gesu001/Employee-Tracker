// Import packages
const inquirer = require('inquirer');
const express = require('express')

const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '1Kakumisukiya@',
    database: 'employees_db'
  },
  console.log(`Connected to the movies_db database.`)
)

const initQuestion = [{
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
}];

//View All Departments
const viewDepartments = () => {
    const sql =`SELECT * FROM departments`
    db.query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)
        //console.log(results);
        init();
    })
};

//View All Roles
const viewRoles = () => {
    const sql =`SELECT * FROM roles`
    db.query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)
        //console.(results);
        init();
    })
};

//View All Employees
const viewEmployees = () => {
    const sql =`SELECT * FROM employees`
    db.query(sql, (err, results) => {
        err ? console.log(err) : console.table(results)
        //console.log(results);
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
 
// add employee
const addEmployee = [
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
    name: 'role',
    message: "What is the employee's role?",
    choices: ['Sales Lead', 'Salesperson', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer', 'Customer Service',],
},
{
    type: 'list',
    name: 'manager',
    message: "Who is the employee's manager?",
    choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunal Singh', 'Malia Brown', 'Sarah Lourd',],
}];
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
    .prompt(initQuestion)
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
     }
    })
    .catch(err => console.error(err)); 
}
// Function call to initialize app
init();

