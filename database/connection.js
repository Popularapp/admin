var mysql = require('mysql');

var mysqlconnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "",
    database : "popularapp_new",
    multipleStatements: true
});

mysqlconnection.connect((err)=>{
    if(!err) {
        console.log("connected");
    }
    else {
        console.log("Not connected");
    }
});

module.exports = mysqlconnection;
