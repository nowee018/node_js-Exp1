const { application, response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const mysql = require('mysql');




// Router 설정 =============================================

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

const postsRouter = require('./routes/post.router')
app.use("/api/v1/posts", postsRouter)




/// DB Connection ===================================================
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'soo*2852',
    database: 'study_db', /*databse 작성 */

});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected');

});

// REST API (get) ===============================================
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', (request, response) => {
    const sql = "SELECT * FROM User"

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        response.send(result)
    });

});

// con.query(sql, function (err, result, fields) {
//     //if (err) console.log('error');

//     console.log(result);
// });

// /*테이블 검색 데이터를 브라우저에 표시*/
// /*insert 문*/
// const sql = "INSERT INTO users(name, game, score, date) VALUES('kevin','cer', 20, 0102 )"
// app.get('/', (request, response) => {


//     con.query(sql, function (err, result, fields) {
//         if (err) throw ('error');

//         console.log(result);
//     })
// });

// /*insert 문 */

