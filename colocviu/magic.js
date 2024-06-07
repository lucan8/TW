window.onload = (e) =>{
    const canvas = document.getElementById('ball');
    const ctx_ball = canvas.getContext('2d');
    const info_msg = document.getElementById('info_msg');
    drawBall();
    canvas.onclick = (e) =>{
        fetch('/ball_resp').then(async (res) =>{
        let choices = await res.json();
        var keys = Object.keys(choices);
        let resp = keys[ keys.length * Math.random() << 0];
        let color = choices[resp];
        ctx_ball.beginPath();
        ctx_ball.arc(150, 75, 30, 0, 2 * Math.PI);
        ctx_ball.fillStyle = color;
        ctx_ball.fill();
        ctx_ball.stroke();
        ctx_ball.closePath();
        info_msg.innerHTML = resp;
        });
    }
    function drawBall(){
        ctx_ball.beginPath();
        ctx_ball.arc(150, 75, 70, 0, 2 * Math.PI);
        ctx_ball.fillStyle = "black";
        ctx_ball.fill();
        ctx_ball.stroke();
        ctx_ball.closePath();
        
        ctx_ball.beginPath();
        ctx_ball.arc(150, 75, 30, 0, 2 * Math.PI);
        ctx_ball.fillStyle = "white";
        ctx_ball.fill();
        ctx_ball.stroke();
        ctx_ball.closePath();

        ctx_ball.fillStyle = 'black';
        ctx_ball.font = '30px Arial'
        ctx_ball.fillText('8', 145, 90);
        ctx_ball.stroke();
    }
}
