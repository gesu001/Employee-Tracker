// Import packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require("console.table");
const sql = require('./db/query_lib');
const db = require('./db/connection');

//View All Departments
const viewDepartments = () => {
    sql.getDepartments()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        console.log(
          "------------------------------------------------------------------"
        );
        init();
    })  
};

//View All Roles
const viewRoles = () => {
    sql.getRoles()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        console.log(
          "------------------------------------------------------------------"
        );
        init();
    })  
};

//View All Employees
const viewEmployees = () => {
    sql.getEmployees()
    .then(([rows]) => {
        //console.log(rows)
        console.table(rows)
        console.log(
          "------------------------------------------------------------------"
        );
        init();
    })  
};


//add department
const addDepartment = () => {
    inquirer
    .prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
    }])
    .then((data)=>{
        sql.addDepartment(data)
        .then(() => {
          console.log("Added Department!")
          console.log(
            "------------------------------------------------------------------"
          );
        //  viewDepartments();
          init();
        });
    })
};

// add role
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
                //console.log(result)
                let departmentId = result[0].map(obj => obj.id);
                //console.log(departmentId[0])
                //console.log(departmentId[0])
                return departmentId[0]
            })
            .then((departmentId) => {
                db.promise().query(`INSERT INTO roles(title, salary, department_id)
            VALUES(?, ?, ?)`, [ans.title, ans.salary, departmentId]);
              console.log('Added Role!')
              console.log(
                "------------------------------------------------------------------"
              );
            //  viewRoles();
              init();
            })
    })

};

//add employee
const addEmployee = () => {
    inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      const input = [answer.firstName, answer.lastName];
      const roleSql = `SELECT roles.id, roles.title FROM roles`;
      db.query(roleSql, (error, data) => {
        if (error) throw error;
        //console.log(data)
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        //console.log(roles);
        inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles,
          },
        ]).then((roleChoice) => {
          const role = roleChoice.role;
          input.push(role);
          const managerSql = `SELECT * FROM employees`;
          db.query(managerSql, (error, data) => {
            if (error) throw error;
            //console.log(data)
            const managers = data.map(({ id, first_name, last_name }) => ({
              name: first_name + " " + last_name,
              value: id,
            }));
            //console.log(managers)
            inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managers,
              },
            ]).then((managerChoice) => {
               // console.log(managerChoice)
              const manager = managerChoice.manager;
              //console.log(manager)
              input.push(manager);
              //console.log(input)
              const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
              db.query(sql, input, (error) => {
                if (error) throw error;
                console.log("Employee added successfully!");
                console.log(
                  "------------------------------------------------------------------"
                );
                //viewEmployees();
                init();
              });
            });
          });
        });
      });
    });
  };

//update role

const updateRole = () => {

  db.query(`SELECT * FROM employees`, (error, data) => {
    if (error) throw error;
    //console.log(data)
    const employeeChoice = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
      }));
    //console.log(employeeChoice)
  inquirer
  .prompt([
      {
          type: "list",
          name: "employee",
          message: "Which employee's role do you want to update?",
          choices: employeeChoice,
      }
    ])
  .then((employeeChoice) => {
    const employeeId = employeeChoice.employee
    const input = [employeeId]
    const roleSql = `SELECT roles.id, roles.title FROM roles`;
      db.query(roleSql, (error, data) => {
        if (error) throw error;
        //console.log(data)
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        //console.log(roles);
        inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message:  "Which role do you want to assign the selected employee?",
            choices: roles,
          }
        ])
        .then((roleChoice) => {
          const roleId = roleChoice.role;
          input.push(roleId);
         // console.log(input)
          const sql = `UPDATE employees
                       SET role_id = ${roleId}
                       WHERE id = ${employeeId}`;

          db.query(sql, input, (error) => {
          if (error) throw error;
          console.log("Role updated successfully!");
          console.log(
            "------------------------------------------------------------------"
          );
         // viewEmployees();
          init();
          });
        })
      })
    })
  })
};

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

