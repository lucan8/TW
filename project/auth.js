const express = require('express');
const router = express();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try{
        const user = await getUser(req.body.email);
        if (user && await bcrypt.compare(req.body.password, user.password)){
            req.session.user_id = user.user_id;
            res.redirect('/');
        }
        else
            res.redirect('/login');
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try{
        if (await createUser(req.body.username, req.body.email, req.body.password))
            res.redirect('/login');
        else
            res.redirect('/register');
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }

});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log(err);
    })
    console.log(req.session);
    res.redirect('/login');
});