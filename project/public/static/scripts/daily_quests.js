window.onload = (e) =>{
    const add_quest = document.getElementById('add_quest');
    const input_quest = document.getElementById('quest_name');
    const quests_list = document.getElementById('quests_list');
    const err_div = document.getElementById('err_div');

    //Adding event listener for already existing quests remove btns
    for (let rm_b of document.getElementsByClassName('remove_quest'))
        rm_b.onclick = (ev) =>{
            removeQuest(ev.currentTarget);
        }


    add_quest.onclick = (e) =>{
        //Sending quest name to be inserted into the database
        const httpReq = new XMLHttpRequest();
        httpReq.open('POST', '/daily_quests/add');
        httpReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpReq.send(JSON.stringify({'quest_name': capitalize((input_quest.value).trim())}));

        httpReq.onreadystatechange = (e) =>{
            const res = e.currentTarget.responseText;
            //If we get an error message we show it to the user
            if (res != 'OK'){
                err_div.innerHTML = res;
                err_div.classList.add('hide');

                setTimeout(() => {
                    err_div.classList.remove('hide');
                    err_div.innerHTML = '';
                }, 3000);
            }
            else{ //Creating new quest dynamically with js
                const new_quest = document.createElement('li');
                new_quest.setAttribute('name', input_quest.value);

                const new_quest_text = document.createTextNode(input_quest.value);
                new_quest.appendChild(new_quest_text);
                
                //Creating remove quest btn
                const remove_btn = document.createElement('button');
                remove_btn.type = 'submit';
                remove_btn.classList.add('remove_quest');

                const remove_text = document.createTextNode('Remove');
                remove_btn.appendChild(remove_text);

                remove_btn.onclick = (ev) => {
                    removeQuest(ev.currentTarget);
                };
        
                new_quest.appendChild(remove_btn);
                quests_list.appendChild(new_quest);
            }
        }
    }

    function removeQuest(rem_btn){
        const quest = rem_btn.parentNode;
        console.log(quest, quest.getAttribute("name"));
        //Removing from database
        const httpReq = new XMLHttpRequest();
        httpReq.open('POST', '/daily_quests/remove');
        httpReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpReq.send(JSON.stringify({'quest_name': (quest.getAttribute("name"))}));

        httpReq.onreadystatechange = (e) =>{
            console.log(e.currentTarget.responseText);
        }
        //Removing from page
        quest.parentNode.removeChild(quest);
    }
}

function capitalize(word){
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}