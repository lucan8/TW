//SESSIONS EXPIRE EITHER AFTER 30 DAYS OR WHEN USER LOGS OUT
const bcrypt  = require('bcrypt');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const session = require("express-session");
const mySQLStore = require('express-mysql-session')(session);
const path = require('path');

//Tabele vor fii create automat cand rulati codul
const sql_options = {
    host:'localhost',
    user:'root',
    password:'1234',
    database: 'task_hero'
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
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const pool = mysql.createPool(sql_options).promise();

const app = express();
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'public/templates'));

async function myQuery(q, wildcards){
    console.log(q, wildcards);
    return (await pool.query(q, wildcards))[0];
}

//Creating the tables if needed
//MAKE THIS FUNCTION
myQuery(`CREATE DATABASE IF NOT EXISTS task_hero;`);
myQuery(`CREATE TABLE IF NOT EXISTS users(
        user_id int PRIMARY KEY NOT NULL,
        username varchar(100) NOT NULL,
        password varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        xp int NOT NULL DEFAULT 0);`
       );
myQuery(`CREATE TABLE IF NOT EXISTS daily_quests(
        user_id	int NOT NULL,
        d_quest_id int NOT NULL,
        quest_name varchar(50) NOT NULL UNIQUE,        
        quest_details varchar(100),
        PRIMARY KEY(user_id, d_quest_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
        );`
       );
       
myQuery(`CREATE TABLE IF NOT EXISTS daily_quest_completion(
        user_id	int NOT NULL,
        date date NOT NULL,
        nr_completed int NOT NULL DEFAULT 0,
        nr_tasks int NOT NULL,
        PRIMARY KEY(user_id, date),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
        );`
      )

const sessionStore = new mySQLStore(session_store_options, pool);
const session_options = {
    secret:'lorem sus',
    store: sessionStore,
    saveUninitialized: false,
    resave: false,
    cookie:{maxAge : 30 * 24 * 60 * 60 * 1000}
};
app.use(session(session_options));

const isAuth = (req, res, next) =>{
    if (req.session.user_id)
        next();
    else
        res.redirect('/login');
}
async function getUser(email){
    return (await myQuery("SELECT * FROM users WHERE email = ?", [email]))[0];
}

//Returns true if user is succesfully created, false otherwise
async function createUser(name, email, password){
    const hashed_pass = await bcrypt.hash(password, 10);
    return await myQuery("INSERT INTO users(user_id, username, email, password) VALUES(?, ?, ?, ?)",
                [await getMaxUserId() + 1, name, email, hashed_pass]);
}

async function removeUser(user_id){
    await myQuery("DELETE FROM users WHERE user_id = ?",
                  [user_id])[0];
}

async function getMaxUserId(){
    const max_id = (await myQuery("SELECT MAX(user_id) AS max_id FROM users"))[0].max_id;

    if (max_id)
        return max_id;
    return 0;
}

async function getQuest(user_id, quest_name){
    return (await myQuery("SELECT * FROM daily_quests WHERE user_id = ? AND quest_name = ?",
                          [user_id, quest_name]))[0];
}

async function getAllQuests(user_id){
    let quests_aux = (await myQuery("SELECT quest_name FROM daily_quests WHERE user_id = ?",
                      [user_id]));
    let quests = [];
    for (let q of quests_aux)
        quests.push(q.quest_name);

    return quests;
}
async function createQuest(user_id, quest_name){
    await myQuery("INSERT INTO daily_quests(user_id, d_quest_id, quest_name) VALUES(?,?,?)",
                  [user_id, await getMaxQuestId(user_id) + 1, quest_name])[0];
}

async function removeQuest(user_id, quest_name){
    await myQuery("DELETE FROM daily_quests WHERE user_id = ? AND quest_name = ?",
                  [user_id, quest_name])[0];
}

async function getMaxQuestId(user_id){
    const max_id = (await myQuery("SELECT MAX(d_quest_id) AS max_id FROM daily_quests WHERE user_id = ?",
                    [user_id]))[0].max_id;
    console.log(max_id);

    if (max_id)
        return max_id;
    return 0;
}

app.listen(3000, (err)=>{
    if (err)
        console.log(err);
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
        createUser(username, email, password)
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
            res.send(200);
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
app.get('/daily_quests', isAuth, async(req, res) => {
    res.render('daily_quests', {quests: await getAllQuests(req.session.user_id)});
});

app.post('/daily_quests/add', isAuth, async (req, res) =>{
    const user_id = req.session.user_id;
    const quest_name = req.body.quest_name;
    try{
        if (await getQuest(user_id, quest_name))
            res.send('Task already exists!');
        else{
            await createQuest(user_id, quest_name);
            res.sendStatus(200);
        }
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})
app.post('/daily_quests/remove', isAuth, async (req, res) =>{
    const user_id = req.session.user_id;
    const quest_name = req.body.quest_name;
    try{
        await removeQuest(user_id, quest_name);
        res.sendStatus(200);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})
//MAKE TASKS ROUTER
app.get('/tasks', isAuth, (req, res) => {
    res.render('tasks');
});


