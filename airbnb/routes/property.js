const express = require('express');
const utils = require('../utils');
const db = require('../db');
const jwt = require('jsonwebtoken');
//multer is used to upload files to a server
const multer =require('multer');
//create various types of route like login register 
const app = express.Router();
const JWT_SECRET = "megha";

app.post('/',(request,response)=>{
    console.log(request.body)
    const { categoryId,title , details, address , contactNo, ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent } = request.body;
     const queryText = `INSERT INTO property (categoryId,title , details, address , contactNo, ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent) 
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`

        db.pool.query(queryText,[categoryId,title , details, address , contactNo,
        ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,
        isParking,guests,bedrooms,beds,bathrooms,rent
        ], 
        (err, result) => {
        response.setHeader("Content-Type", "application/json");
              
        if (err) {
                response.send(utils.createErrorResult(err));
                } else {
                response.send(utils.createSuccessResult(result));
                }
    });
});


app.get('/',(request,response)=>{
    const query=`select id ,title,details,rent,profileImage from property;`
    db.pool.query(query,(error,properties)=>{
        response.send(utils.createResult(error,properties))
    })
})
app.get('/',(request,response)=>{
    const{id}=request.params
    const query = `select * from property where id=?;`
    db.pool.query(query[id],(error,properties)=>{
        response.send(utils.createResult(error,properties[0]))
    })
})

// app.post("/add-property", (request, response) => {
//     console.log("reached")
//    // console.log(request.body)
//     const { categoryId,title , details, address , contactNo, ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent } = request.body;
//     const queryText = `INSERT INTO property (categoryId,title , details, address , contactNo, ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent) 
//                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`


//     db.pool.query(queryText,[categoryId,title , details, address , contactNo, ownerName,isLakeView,isTv,isAc ,isWifi,isMinibar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent], (err, result) => {
//         response.setHeader("Content-Type", "application/json");
  
//         if (err) {
//             response.send(utils.createErrorResult(err));
//         } else {
//             response.send(utils.createSuccessResult(result));
//         }
//     });
// });
// app.get("/get-property", (request, response) => {
//     const queryText = `SELECT * from property;`

//     db.pool.query(queryText, (err, result) => {
//         response.setHeader("Content-Type", "application/json");

//         if (err) {
//             return response.status(500).send(utils.createErrorResult(err));
//         }

//         if (result.length === 0) {
//             return response.status(404).send(utils.createErrorResult("User not found"));
//         }

//         return response.status(200).send(utils.createSuccessResult(result));
//     });
// });
module.exports = app;