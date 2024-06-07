var XP_MULTIPLIER = 10;
window.onload = (e) =>{
    const XP = document.getElementById("XP");
    const LVL = document.getElementById("LVL");
    setLVLBar(XP, LVL);
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