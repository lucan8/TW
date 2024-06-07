var XP_MULTIPLIER = 10;
window.onload = (e) =>{
    const XP = document.getElementById("XP");
    const LVL = document.getElementById("LVL");
    setLVLBar(XP, LVL);
    
    const add_quest = document.getElementById('add_quest');
    const input_quest = document.getElementById('quest_input');
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
                new_quest.classList.add('quest')
                
                const quest_name_div = document.createElement('div');
                quest_name_div.classList.add('quest_name');

                const quest_name = document.createTextNode(input_quest.value);
                quest_name_div.appendChild(quest_name);

                //Creating remove quest btn
                const remove_btn = document.createElement('button');
                remove_btn.type = 'submit';
                remove_btn.classList.add('remove_quest');

                const remove_text = document.createTextNode('Remove');
                remove_btn.appendChild(remove_text);

                remove_btn.onclick = (ev) => {
                    removeQuest(ev.currentTarget);
                };
                
                new_quest.append(quest_name_div);
                new_quest.appendChild(remove_btn);
                quests_list.appendChild(new_quest);
            }
        }
    }

    function removeQuest(rem_btn){
        const quest = rem_btn.parentNode;
        
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

//Param: elements with is's 'xp' and 'lvl' 
function setLVLBar(XP, LVL){
    //Setting the LVL of the user
    LVL.textContent = Math.floor(XP.textContent / XP_MULTIPLIER) + 1;
    
    //Setting up the xp bar's progress
    let XP_goal = LVL.textContent * XP_MULTIPLIER;
    //Percentage for the XP bar
    XP.style.width = ((1.0 * XP.textContent / XP_goal.textContent * 100).
                                                toFixed(2)).toString() + "%";
}

function capitalize(word){
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}