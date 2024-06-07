const colors = {'r': 'red', 'g': 'green', 'b': 'blue', 'y': 'yellow'}
localStorage.setItem('counter', 0);
window.onload = (e) =>{
    const body = document.getElementById('body');
    const counter = document.getElementById('counter');
    body.onkeydown = (ev) =>{
        if (!(ev.key in colors)){
            console.log(ev.key);
            return;
        }
        body.appendChild(createDot(body, counter, colors[ev.key]));
    }
}

function createDot(body, counter, color){
    localStorage.setItem('counter', parseInt(localStorage.getItem('counter')) + 1);
    counter.innerHTML = localStorage.getItem('counter');

    let div = document.createElement('div');
    div.style.top = Math.random()*window.innerHeight + 'px';
    div.style.left = Math.random()*window.innerHeight + 'px';
    div.style.right = Math.random()*window.innerHeight + 'px';
    div.style.bottom = Math.random()*window.innerHeight + 'px';
    
    let btn = document.createElement('button');
    btn.style.backgroundColor = color;
    let range = document.createElement('input');

    range.type = 'range';
    range.id = 'size';
    range.min = 20;
    range.max = 150;

    range.onchange = (e) =>{
        btn.style.width = e.currentTarget.value + 'px';
        btn.style.height = e.currentTarget.value + 'px';
    };

    btn.onclick = (e) =>{
        let dot_div = createDot(body, counter, color);
        let new_btn = dot_div.children[0];

        new_btn.style.width = e.currentTarget.style.width;
        new_btn.style.height = e.currentTarget.style.height;

        body.appendChild(dot_div);

    }

    div.appendChild(btn);
    div.appendChild(range);
    return div;
}