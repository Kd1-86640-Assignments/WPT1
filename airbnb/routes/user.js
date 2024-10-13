//we require express because we have to implement routing
const express = require('express');
//registration ka functionality send hga register karte huye data send karna hga 
//mysql jo b dega woh user ko send krne k liye
const utils = require('../utils');
//we have to connect db to database from user.js 
const db = require('../db');
//
const jwt = require('jsonwebtoken');
const crypto =require('crypto-js')
const config=require('../config')
//multer is used to upload files to a server
const multer =require('multer');
//create various types of route like login register 
const app = express.Router();
const JWT_SECRET = "megha";


//app is nothing but request 
//every route has two bodies request and response parameters

app.post("/register", (request, response) => {
    console.log("reached")
    const { firstName, lastName, email, password, phoneNumber } = request.body;
    const queryText = `INSERT INTO user (firstName, lastName, email, password, phoneNumber) 
                       VALUES(?,?,?,?,?);`
    // const encryptedPassword=String(crypto.SHA256(password))

    
    db.pool.query(queryText,[firstName,lastName,email,password,phoneNumber],
        (err, result) => {
        response.setHeader("Content-Type", "application/json");
  
        if (err) {
            response.send(utils.createErrorResult(err));
        } else {
            response.send(utils.createSuccessResult(result));
        }
    });
});



app.post("/login", (request, response) => {
    //postaman mai body property k andar save hoga 
    const { email, password } = request.body;
    //select query returns array
    const queryText = `SELECT id, firstName, lastName, phoneNumber,isDeleted FROM user WHERE email = '${email}' AND password = '${password}' `; //we can use ? i splace of $papsword and $email
    // const encryptedPassword =String(crypto.SHA256(password))
    //db.pool.query(statement,[email,encryptedPassword],(error,users)=>{})
    
    db.pool.query(queryText,[email,password], (err, result) => {
        response.setHeader("Content-Type", "application/json");
        //utils doing this below work
        if (err) {
            return response.status(500).send(utils.createErrorResult(err));
        }

        if (result.length === 0) {
            return response.status(401).send(utils.createErrorResult("Invalid email or password"));
        } else{
            const user = result[0]
            if(user.isDeleted){
                response.send(utils.createErrorresults('your account isclosed'))
            }else{
                //create payload
                const payload={id:user.id}
                const token =jwt.sign(payload,config.secret)
                const userData={
                    token,
                    name:`${user['firstName']} ${user['lastName']}`,
                }
                response.send(utils.createSuccessResult(userData))
            }

        }
        //another way of token
            
        //     const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        //     const userData = {
        //     token: token,
        //     name: `${user.firstName} ${user.lastName}`
        // };

        // return response.status(200).send(utils.createSuccessResult(userData));
    });
});


app.get("/all-users", (request, response) => {
    const queryText = `SELECT * FROM user `;

    db.pool.query(queryText, (err, result) => {
        response.setHeader("Content-Type", "application/json");

        if (err) {
            response.status(500).send(utils.createErrorResult(err));
        } else {
            response.status(200).send(utils.createSuccessResult(result));
        }
    });
});


function verifyToken(request, response, next) {
    const token = request.headers['token'];

    if (!token) {
        return response.status(403).send(utils.createErrorResult("No token provided"));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(500).send(utils.createErrorResult("Failed to authenticate token"));
        }

        request.userId = decoded.id;
        next();
    });
}
app.put("/profile/:userId", (request, response) => {
    console.log("hjjj")
    const { firstName, lastName, phone } = request.body;

    const queryText = `UPDATE user SET firstName = ?, lastName = ?, phoneNumber = ?
                       WHERE id = ?`;

    db.pool.query(queryText, [firstName,lastName,phone,request.params.userId],(err, result) => {
        response.setHeader("Content-Type", "application/json");

        if (err) {
            return response.status(500).send(utils.createErrorResult(err));
        }

        return response.status(200).send(utils.createSuccessResult("Profile updated successfully"));
    });
});
app.get("/profile/:id", (request, response) => {
    const queryText = `SELECT firstName, lastName, phoneNumber, email FROM user WHERE id = ?`;

    db.pool.query(queryText,[request.params.id], (err, result) => {
        response.setHeader("Content-Type", "application/json");

        if (err) {
            return response.status(500).send(utils.createErrorResult(err));
        }

        if (result.length === 0) {
            return response.status(404).send(utils.createErrorResult("User not found"));
        }

        return response.status(200).send(utils.createSuccessResult(result));
    });
});
module.exports = app;
