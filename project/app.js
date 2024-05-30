const bcrypt  = require('bcrypt');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');
//TO DO: Add login, register routes and a login required function
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'task_hero'
}).promise();


const app = express();
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : false}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/templates'));

app.listen(3000)
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about_us', (req, res) => {
    res.render('about_us');
})

//TO DO:
app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

//Find other ways to get data from form
//
app.post('/register', (req, res) => {
    try{
        const hashed_pass = bcrypt.hash(req.body.password);
        pool.query("INSERT INTO users(name, password) VALUES(?, ?)", [req.body.username, hashed_pass]);
        res.redirect('/login');
    } catch(e){
        console.log(e);
        res.status(500)
        res.render('internal_error');
    }
})

app.get('/logout', (req, res) => {
    res.render('register');
    res.end();
})

