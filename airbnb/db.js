//here name after require is same as the module but after const it can be anything
const mysql2=require('mysql2');
//pool is used to connect the node application with the database we use pool
//it is connection string
const pool = mysql2.createPool({
    host:'localhost',
    user: 'kd1-86640-megha' ,
    password:'manager' ,
    port:3306,
    database:'airbnb_db',
    connectionLimit:10
});
module.exports={pool}