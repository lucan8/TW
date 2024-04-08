const http = require("http");
const fs = require("fs");
const path = require("path");

var scripts_dir = path.join(__dirname, 'static/scripts'),
    styles_dir = path.join(__dirname, 'static/styles'),
    pictures_dir = path.join(__dirname, 'static/pictures'),
    temp_dir = path.join(__dirname, 'templates');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

function wrapLayout(file_name){
    fs.readFile()
}
http.createServer((req, res) =>{
    let curr_path = path.join(__dirname, req.url);
    let path_arr = curr_path.split('\\');

    let file_name = path_arr[path_arr.length - 1];
    let f_ext = path.extname(file_name).slice(1);
    
    //Route
    if (file_name.indexOf('.') == -1){

        switch(file_name){
            case '':


        }
        res.setHeader('Content-type', mime.html);

        fs.readFile(path.join(temp_dir, 'layout.html'), 'utf8', (err, data) => {
            console.log(data);
            res.end(data);
        });
    }
    //File
    else{
        let type = mime[f_ext];
        let chosen_path = '';

        switch (type){
            case mime.html:
                chosen_path = temp_dir;
                break;
            case mime.css:
                chosen_path = styles_dir;
                break;
            case mime.js:
                chosen_path = scripts_dir;
                break;
            case undefined:
                chosen_path = '';
                break;
            default:
                chosen_path = pictures_dir;
                break;
        }
        var s = fs.createReadStream(path.join(chosen_path, file_name));

        s.on('open', () => {
            res.setHeader('Content-Type', type);
            s.pipe(res);
        });
        s.on('error', () => {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        });
    }   
    console.log(req.method);
    console.log(curr_path)
  
}).listen(3000, "localhost", ()=>{
    console.log("listening to requests");
});