const express = require('express');
const db = require('../db');
const utils = require('../utils');

const multer = require('multer');


const upload = multer({ dest: 'images' });
const app = express.Router();



app.get('/get-category', (request, response) => {
    const query = `SELECT id, title, details, image FROM category;`;
    db.pool.query(query, (error, categories) => {
        response.send(utils.createResult(error, categories));
    });
});

app.post('/add-category', upload.single('icon'), (request, response) => {
    const { title, details } = request.body; 
    const fileName = request.file ? request.file.filename : null; 

    if (!fileName) {
        return response.status(400).send(utils.createErrorResult("File upload failed. Please provide a valid file."));
    }

    const statement = `INSERT INTO category (title, details, image) VALUES (?, ?, ?)`;
    db.pool.execute(
        statement,
        [title, details, fileName],
        (error, result) => {
            response.send(utils.createResult(error, result));
        }
    );
});

module.exports = app;
