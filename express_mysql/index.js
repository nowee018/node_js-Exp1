const { application } = require("express");
const express = require("express");
const app = express();

const port = 3000;

const mysql = require('mysql');




app.get('/', (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`서버가 가동중입니다. ${port}!`);
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,


});
con.connect(function (err) {
    if (err) console.log('error');
    console.log('Connected');
});
