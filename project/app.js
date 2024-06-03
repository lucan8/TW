//SESSIONS EXPIRE EITHER AFTER 30 DAYS OR WHEN USER LOGS OUT
const bcrypt  = require('bcrypt');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const session = require("express-session");
const mySQLStore = require('express-mysql-session')(session);
const path = require('path');
const { Console } = require('console');
//TO DO:Get user does not work yet...
//TO DO: Make a custom query that prints the query string and returns only the first elem
const sql_options = {
    host:'localhost',
    user:'root',
    password:'1234',
    database:'task_hero'
};

const session_store_options = {
    // Host name for database connection:
    host: 'localhost',
    // Port number for database connection:
    port: 3306,
    // Database user:
    user: 'root',
    // Password for the above database user:
    password: '1234',
    // Database name:
    database: 'task_hero',
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
    // How frequently expired sessions will be cleared; 15 minutes:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session, 30days
    expiration: 30 * 24 * 60 * 60 * 1000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions_test',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const pool = mysql.createPool(sql_options).promise();
const sessionStore = new mySQLStore(session_store_options, pool);

const session_options = {
    secret:'lorem sus',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie:{maxAge : 30 * 24 * 60 * 60 * 1000}
};

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : false}))
//Maybe set the store for this as well
app.use(session(session_options))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/templates'));

async function myQuery(q, wildcards){
    console.log(q, wildcards);
    return (await pool.query(q, wildcards))[0];
}

//Think more about this
const isAuth = (req, res, next) =>{
    if (req.session.user_id)
        next();
    else
        res.redirect('/login');
}

async function getUser(email){
    return (await myQuery('SELECT * FROM users WHERE email = ?', [email]))[0];
}

//Returns true if user is succesfully created, false otherwise
async function createUser(name, email, password){
    const hashed_pass = await bcrypt.hash(password, 10);
    return await myQuery("INSERT INTO users(user_id, username, email, password) VALUES(?, ?, ?, ?)",
                [await getMaxUserId() + 1, name, email, hashed_pass]);
}

async function getMaxUserId(){
    const max_id = (await myQuery("SELECT MAX(user_id) AS max_id FROM users"))[0];

    if (max_id)
        return max_id.max_id;
    return 0;
}

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});

app.get('/', isAuth, (req, res) => {
    res.render('index');
});

app.get('/about_us', (req, res) => {
    res.render('about_us');
});

//MAKE USER AUTH ROUTER
app.get('/login', (req, res) => {
    res.render('login', {email: '', password: '', err_msg : ''});
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await getUser(email);
        //No matching email, sending err msg
        if (!user)
            res.render('login', {email: email, password: password, err_msg : 'Incorrect email'});
        //Password does not match, sending err msg
        else if (!(await bcrypt.compare(password, user.password)))
            res.render('login', {email: email, password: password, err_msg : 'Incorrect password'});

        else {//Creating session for user and redirecting to home page
            req.session.user_id = user.user_id;
            res.redirect('/');
        }
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try{
        await createUser(username, email, password)
        .then(()=>res.redirect('/login'));
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/register/verif_email', async (req, res) =>{
    const {email} = req.body;
    try{
        const user = await getUser(email);
        if (user)
            res.send('Email in use!');
        else
            res.send({});
    } catch(e){
        console.log(e);
        res.sendStatus(500)
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
    });
    res.redirect('/login');
});

//MAKE DAILY_QUESTS ROUTER
app.get('/daily_quests', isAuth, (req, res) => {
    res.render('daily_quests');
});

//MAKE TASKS ROUTER
app.get('/tasks', isAuth, (req, res) => {
    res.render('tasks');
});


