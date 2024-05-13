
window.onload = function(){
  for (elem of document.getElementsByTagName("option"))
    elem.value =  elem.innerHTML;

  social_creds = document.getElementById('creds');
  range_creds = document.getElementById('range_creds');

  range_creds.onchange = function(event){
    social_creds.innerHTML = event.target.value
  }
  /* Adăugați cod pentru schimbarea culorii de fundal și 
     pentru eticheta cu valoarea creditului social      */
     
  /* ... */

}

