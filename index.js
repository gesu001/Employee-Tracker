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
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Departments', 'Quit'],
}];
//add department

const addDepartment = [
{
    type: 'input',
    name: 'department',
    message: 'What is the name of the department?',
}];
//add role

const addRole = [
{
    type: 'input',
    name: 'role',
    message: 'What is the name of the role?',
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
    choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service',]
}];
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
    .then((answer) => {
        //console.log(answer);
        //console.log(answer.menu);
        //let selection = answer.manu
        if(answer.menu === 'View All Employees') {
            const sql ='SELECT * FROM employees'
            db.query(sql, (err, results) => {
                 console.table(results)
                 return init();
                  });
        } else if(answer.menu === 'View All Roles') {
            const sql ='SELECT * FROM roles'
            db.query(sql, (err, results) => {
                console.table(results)
                 return init();
                  });
        } else if(answer.menu === 'View All Departments') {
            const sql ='SELECT * FROM departments'
            db.query(sql, (err, results) => {
                console.table(results)
                 return init();
                  });
        };     

    }) 
    
}
// Function call to initialize app
init();
