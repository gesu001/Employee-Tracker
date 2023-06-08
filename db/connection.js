const mysql = require('mysql2');


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


module.exports = db;