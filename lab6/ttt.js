let nume = prompt("Hai sa jucam X si 0!Cum te cheama?");

let user_choice = prompt("Bună" +  nume + "Cu ce vrei să joci? X sau 0? X începe primul");
let computer_choice;
let curr_player;
let curr_turn = 'X'

if (user_choice == 'X'){
    computer_choice = '0';
    curr_player = "human";
}
else{
    computer_choice = 'X';
    curr_player = "computer";
}

let table = Array(['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']);

while(true){
    move(table, curr_turn, curr_player);

    winner = win(table);

    if (winner){
        if (winner == user_choice)
            alert("Bravo " + nume + " ai câștigat!");
        else
            alert("Ai pierdut :(");
        break;
    }
    else if (draw(table)){
        alert("Remiza!");
        break;
    }

    //Toggling turns
    if (curr_player == "computer")
        curr_player = "human";
    else
        curr_player = "computer";

    if (curr_turn == "X")
        curr_turn = "0";
    else
        curr_turn = "X";
}



function printtt(table){
    let table_illustration = ''; 

    for (let i = 0; i < table.length; i ++){
        table_illustration += '|';
        for (let j = 0; j < table[i].length; j ++)
            table_illustration += table[i][j] + '|';
        table_illustration += '\n';
    }

    return table_illustration;

}

function valid(table, poz){
    return poz >= 0 && poz <= 8 && table[Math.floor(poz / 3)][poz % 3] == '?';
}

function reprompt(table, player){
    if (player == 'human')
        poz = prompt(printtt(table) + "Unde vrei sa pui urmatorul semn?");
    else
        poz = Math.floor(Math.random() * 9);

    return poz - 1;

}
function move(table, choice, player){
    let poz = reprompt(table, player);

    while(true)
        if (!valid(table, poz)){
            alert("Pozitie incorecta " + player);
            poz = reprompt(table, player);
        }
        else{
            table[Math.floor(poz / 3)][poz % 3] = choice;
            break;
        }
}

function win(table){
    let winLineCol = verifLineCol(table);

    if (winLineCol)
        return winLineCol;

    let winDiag = verifDiag(table);

    if (winDiag)
        return winDiag;

    return false;
}

function draw(table){
    return !win(table) && filledTable(table);
}

function verifLineCol(table){
    for (let i = 0; i < 3; i ++){
        line = {'X':0, '0':0};
        col = {'X':0, '0':0};

        for (let j = 0; j < 3; j++)
            if (table[i][j] != '?'){
                line[table[i][j]] ++;
                col[table[j][i]] ++;
            }

        if (line['X'] == 3 || col['X'] == 3)
            return 'X';

        if(line['0'] == 3 || col['0'] == 3)
            return '0';
    }
    return false
}

function verifDiag(table){
    if (table[0][0] == table[1][1] && table[1][1] == table[2][2] && table[0][0] != '?')
        return table[0][0];

    if(table[0][2] == table[1][1] && table[1][1] == table[2][0] && table[0][2] != '?')
        return table[0][2];

    return false;
}

function filledTable(table){
    for (let i = 0; i < table.length; i ++)
        for (let j = 0; j < table[i].length; j ++)
            if (table[i][j] == '?')
                return false;
    return true;
}




