const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'database-1.cddobvflxr9s.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'soo*7618',
    database: 'scoreboard'
});


module.exports = pool.promise()
