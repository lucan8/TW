//Path for templates acces
const check_src = '../static/pictures/check.png';
const cross_src = '../static/pictures/red_cross.png';
const symbols = '!@#$%^&*_-';

window.onload = (e) =>{
    var submit_err = document.getElementById('submit_err');

    let input_containers = document.getElementsByClassName('input_container');
    const verifs = [verifUsername, verifEmail, verifPassword];

    for (let i = 0; i < input_containers.length; ++i)
        input_containers[i].children[0].oninput = (event) =>{
            var err_msg;
            err_msg = verifs[i](event.currentTarget.value);

            if (!err_msg)
                setInputImg(input_containers[i].children[1], check_src, 'Valid');
            else
                setInputImg(input_containers[i].children[1], cross_src, err_msg);
        }
    document.getElementById('auth_form').onsubmit = (e) =>{
        Array.from(input_containers).forEach( (input_cont) =>{
            if (input_cont.children[1].title != 'Valid'){
                e.preventDefault();

                submit_err.innerHTML = input_cont.children[1].title;
                submit_err.classList.add('hide');
                
                //Giving time for the animation to finish before removing the hide class and err_msg
                setTimeout(() => {
                    submit_err.classList.remove('hide');
                    submit_err.innerHTML = '';
                }, 3000);
                return;
            }
        });

    }
}

function setInputImg(img, src, msg){
    img.src = src;
    img.title = msg;
}

function verifUsername(username){
    if (!username)
        return 'Incomplete username!';
    if (username.match(' '))
        return 'No white spaces!';
}

//Find way to return response
function verifEmail(email){
    if (!email)
        return 'Incomplete email!';

    let httpReq = new XMLHttpRequest();
    let res;
    httpReq.open('POST', 'register/verif_email');
    httpReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpReq.send(JSON.stringify({'email': email}));
    httpReq.onreadystatechange = () => {
        res = httpReq.responseText;
        console.log(res);
    }
    console.log(res);
    return res;
}

function verifPassword(password){
    console.log(password);
    if (!password)
        return "Incomplete password!";

    if (password.match(' '))
        return 'No white spaces!';

    if (!(password.match('[a-z]') && password.match('[A-Z]') &&
        password.match(['[0-9]'] && password.match('[' + symbols + ']')))
        ){
            return `Password must contain: small letter,
                    big letter, digit, symbol(` + symbols + ')!';
        }
}

