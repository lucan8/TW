//No magic numbers
var XP_MULTIPLIER = 10;

export function setXP(){
    //Getting XP and LVL
    let XP = document.getElementById("XP").textContent.split(' ')[1]; //XP
    let LVL = document.getElementById("LVL").textContent.split(' ')[1]; //LVL
    
    let XP_goal = LVL * XP_MULTIPLIER;

    //Percentage for the XP bar
    console.log(XP);
    document.getElementById("XP").style.width = ((1.0 * XP / XP_goal * 100).toFixed(2)).toString() + "%";
}
