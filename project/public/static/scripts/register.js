//Path for templates acces
const check_src = '../static/pictures/check.png';
const cross_src = '../static/pictures/red_cross.png';
const symbols = '!@#$%^&*_-';

window.onload = (e) =>{
    var err_div = document.getElementById('err_div');

    let input_containers = document.getElementsByClassName('input_container');
    const verifs = [verifUsername, verifEmail, verifPassword];

    for (let i = 0; i < input_containers.length; ++i)
        input_containers[i].children[0].oninput = (event) =>{
            var err_msg;
            //Email is exception because it sends ajax request and can't return the response
            if(verifs[i].name == 'verifEmail')
                verifs[i](event.currentTarget.value, input_containers[i].children[1]);
            else{
                err_msg = verifs[i](event.currentTarget.value);

                if (!err_msg)
                    setInputImg(input_containers[i].children[1], check_src, 'Valid');
                else
                    setInputImg(input_containers[i].children[1], cross_src, err_msg);
                }
        }
    document.getElementById('auth_form').onsubmit = (e) =>{
        Array.from(input_containers).forEach( (input_cont) =>{
            if (input_cont.children[1].title != 'Valid'){
                e.preventDefault();

                err_div.innerHTML = input_cont.children[1].title;
                err_div.classList.add('hide');
                
                //Giving time for the animation to finish before removing the hide class and err_msg
                setTimeout(() => {
                    err_div.classList.remove('hide');
                    err_div.innerHTML = '';
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

function verifEmail(email, res_img){
    if (!email){
        setInputImg(res_img, cross_src, 'Incomplete email!');
        return;
    }

    let httpReq = new XMLHttpRequest();
    //Sending ajax to verificate the email uniqness
    httpReq.open('POST', 'register/verif_email');
    httpReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpReq.send(JSON.stringify({'email': email}));

    httpReq.onreadystatechange = () => {
        const res = httpReq.responseText;
        //Changing the the img dependent on response
        if (res == 'OK')
            setInputImg(res_img, check_src, 'Valid');
        else
            setInputImg(res_img, cross_src, res);
    }
}

function verifPassword(password){
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

