const express = require('express');
const resp = require('./resp.json');
const path = require('path');

const app = express();
app.use(express.static(__dirname));

app.listen(3000, (e)=>{
    console.log('Listening on port 3000');
});
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'magic.html'));
});

app.get('/ball_resp', async (req, res) =>{
    res.send(resp);
});