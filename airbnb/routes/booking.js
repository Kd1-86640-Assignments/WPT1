const express = require('express');
const utils = require('../utils');
const db = require('../db');
const jwt = require('jsonwebtoken');
//multer is used to upload files to a server
const multer =require('multer');
//create various types of route like login register 
const app = express.Router();
const verifyToken=require('../middleware/authmiddleware')
const JWT_SECRET = "megha";
// function verifyToken(request, response, next){
//     const token = request.headers['token'];
//     if (!token) {
//         return response.status(403).send(utils.createErrorResult("No token provided"));
//     }

//     jwt.verify(token, JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return response.status(500).send(utils.createErrorResult("Failed to authenticate token"));
//         }

//         request.name = decoded.name;
//         next();
//     });
// }


app.get('/',verifyToken, (request, response) => {
    const query = `SELECT * from bookings`
    db.pool.query(query, (error, bookings) => {
        response.send(utils.createResult(error, bookings));
    });
});

app.post("/:userId", (request, response) => {
    console.log("reached")
  
    const queryText = `INSERT INTO bookings(userId,propertyId,total, fromDate, toDate) 
                       VALUES(?,?,?,?,?);`

                       const {propertyId, total, fromDate, toDate } = request.body;

    db.pool.query(queryText,[request.params.userId,propertyId,total,fromDate,toDate], (err, result) => {
        response.setHeader("Content-Type", "application/json");
  
        if (err) {
            response.send(utils.createErrorResult(err));
        } else {
            response.send(utils.createSuccessResult(result));
        }
    });
});
module.exports = app;
