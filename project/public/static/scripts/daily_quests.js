window.onload = (e) =>{
    const add_quest = document.getElementById('add_quest');
    const input_quest = document.getElementById('quest_name');
    const quests_list = document.getElementById('quests_list');

    add_quest.onclick = (e) =>{
        const new_quest = document.createElement('li');
        const new_quest_text = document.createTextNode(input_quest.value);
        new_quest.appendChild(new_quest_text);

        const remove_anc = document.createElement('a');
        remove_anc.href = '/remove_quest';
        const remove_text = document.createTextNode('|Remove|');
        remove_anc.appendChild(remove_text);

        new_quest.appendChild(remove_anc);
        quests_list.appendChild(new_quest);
    }
}