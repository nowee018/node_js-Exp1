const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'soo*2852',
    database: 'study_db'
});


module.exports = pool.promise()
