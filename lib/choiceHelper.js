const sql = require('../db/query_lib')

const getDeptChoices = () => {
    //const results = 
    sql.getDepartments()
    .then(([results]) => {
      const departArr = results.map((obj) => obj.department_name)
      return departArr;
      //const departArr = results.map((obj) => obj.title);
     // return departArr
      })

  
  
    //const departArr = results[0].map((obj) => obj.department_name);
    //console.log(departArr);
    //return departArr;
  }
  
  const getRoleChoices = async () => {
    const results = await sql.getRoles();
    const roleArr = results[0].map((obj) => obj.title);
    //console.log(departArr);
    return roleArr;
  }

  const getManagerChoices = async () => {
    const results = await sql.getManagers();
    
    const managerArr = results[0].map((obj) => obj.manager);
    //console.log(departArr);
    return managerArr;
  }
  
  const getEmployeeChoices = async () => {

    const results = await sql.getEmployeeFullName();
    
    const employeeArr = results[0].map((obj) => obj.manager);
    //console.log(departArr);
    return employeeArr;
  }
  
  module.exports = { getDeptChoices, getRoleChoices, getManagerChoices, getEmployeeChoices };