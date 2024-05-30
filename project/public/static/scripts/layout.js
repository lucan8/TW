//No magic numbers
var XP_MULTIPLIER = 10;

export function setXP(){
    //Getting XP and LVL
    let XP = document.getElementById("XP").textContent;
    let LVL = document.getElementById("LVL").textContent;
    
    let XP_goal = LVL * XP_MULTIPLIER;

    //Percentage for the XP bar
    document.getElementById("XP").style.width = ((1.0 * XP / XP_goal * 100).toFixed(2)).toString() + "%";
}
