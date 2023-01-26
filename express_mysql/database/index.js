const mysql = require('mysql2')
const pool = mysql.createPool({
    host: '182.225.149.130',
    user: 'admin',
    password: 'soo*7618',
    database: 'scoreboard'
});


module.exports = pool.promise()
