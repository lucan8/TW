function drawTable(nrows, ncols) {
/* 
   1. Generați un tabel cu 'nrows' rânduri și 'ncols' coloane 
   și adăugați-l în div-ul cu id-ul 'container'. */
   var table = document.createElement('table');
   table.id = 'drawTable';
   document.getElementById('container').appendChild(table);

   for (let i = 0; i < nrows; ++i){
      let row = table.insertRow();
      for (let j = 0; j < ncols; ++j){
         let cell = row.insertCell();
         cell.classList.add('r' + i);
         cell.classList.add('c' + j);
      }
   }
   
}

function colorCol(column, color) {
   var rows = document.getElementsByClassName('c' + column);

   for (let i = 0; i < rows.length; ++i){
      console.log(rows[i]);
      rows[i].style.backgroundColor = color;
   }

/*
   2. Colorați coloana 'column' din tabla de desenat cu culoarea 'color'.
*/
}

function colorBlockColumns(start , end, color){
   for (let i = start; i < end; ++i){
      colorCol(i, color);
   }
}

function colorRow(row, color) {
   var col = document.getElementsByClassName('r' + row);

   for (let i = 0; i < col.length; ++i)
      col[i].style.backgroundColor = color;
/*
   2. Colorați rândul 'row' din tabla de desenat cu culoarea 'color'.
*/
}

function colorBlockRows(start , end, color){
   for (let i = start; i < end; ++i){
      colorRow(i, color);
   }
}

function rainbow(target) {
   var colors = ["rgb(255, 0, 0)", "rgb(255, 154, 0)", "rgb(240, 240, 0)", "rgb(79, 220, 74)", "rgb(63, 218, 216)", "rgb(47, 201, 226)", "rgb(28, 127, 238)", "rgb(95, 21, 242)", "rgb(186, 12, 248)", "rgb(251, 7, 217)"];

   var row = 0;
   var col = 0;
   var block = 3;
   

   switch (target){
      case "horizontal":
         for (color of colors)
            colorBlockRows(row, row+= block, color);
         break;
      case "vertical":
         for (color of colors)
            colorBlockColumns(col, col+= block, color);
         break;
      default:
            alert("Choose either horizontal/vertical");
            break;
   }
/*
   3. Desenați un curcubeu pe verticală sau orizontală conform argumentului 'target' folosind culorile din 'colors' și funcțiile 'colorCol' și 'colorRow'.     
*/
}

function getNthChild(element, n) {
   return element.children[n];
/*
   4. Întoarceți al n-lea element copil al unui element dat ca argument.
*/
};

function drawPixel(row, col, color) {
   let pixel = document.getElementsByClassName('r' + row + ' c' + col)[0];
   console.log(pixel);

   if (pixel)
      pixel.style.backgroundColor = color;
/*
   5. Colorați celula de la linia 'row' și coloana 'col' cu culoarea `color'.
*/
}

function drawLine(r1, c1, r2, c2, color) {
   if (c2 == c1) //Linie verticala
      for (let i = r1; i <= r2; ++i)
         drawPixel(i, c1, color);
   else if (r2 == r1) //Linie orizontala
      for (let i = c1; i <= c2; ++i)
         drawPixel(r1, i, color);
/*
   6. Desenați o linie (orizontală sau verticală) de la celula aflată 
   pe linia 'r1', coloana 'c1' la celula de pe linia 'r2', coloana 'c2'
   folosind culoarea 'color'. 
   Hint: verificați mai întâi că punctele (r1, c1) și (r2, c2) definesc
   într-adevăr o linie paralelă cu una dintre axe.
*/
}

function drawRect(r1, c1, r2, c2, color) {
   if (r2 < r1 || c2 < c1){
      alert("Rows or columns incorrectly incputed");
      return;
   }
   for (let row = r1; row <= r2; ++row)
      drawLine(row, c1, row, c2, color);
/*
   7. Desenați, folosind culoarea 'color', un dreptunghi cu colțul din 
   stânga sus în celula de pe linia 'r1', coloana 'c1', și cu 
   colțul din dreapta jos în celula de pe linia 'r2', coloana 'c2'.
*/
}

function drawPixelExt(row, col, color) {
   let table = document.getElementById('drawTable');

   if ((row >= 0 && row < table.rows.length) && (col >= 0 && col < table.rows[row].cells.length))
      drawPixel(row, col, color);
   else{
      extendCol(table, row, color);
      extendRow(table, col, color);
   }
/*
   8. Colorați celula de la linia 'row' și coloana 'col' cu culoarea 'color'.
   Dacă celula nu există, extindeți tabla de desenat în mod corespunzător.
*/
}

//Adds rows
function extendCol(table, rowFin, color){
   const nr_initial_rows = table.rows.length;
   const nr_new_rows = rowFin - nr_initial_rows + 1;
   const nr_col = table.rows[0].cells.length;
   
   console.log(nr_initial_rows, nr_new_rows, nr_col);
   for (let i = 0; i < nr_new_rows; ++i){
      let new_row = table.insertRow();
      let row_index = nr_initial_rows + i;

      for (let col_index = 0; col_index < nr_col; ++col_index){
         let new_cell = new_row.insertCell()

         new_cell.classList.add('r' + row_index);
         new_cell.classList.add('c' + col_index);

         drawPixel(row_index, col_index, color);
      }
   }
}

//Adds columns
function extendRow(table, colFin, color){
   const nr_initial_col = table.rows[0].cells.length;
   const nr_new_col = colFin - nr_initial_col + 1;
   const nr_rows = table.rows.length;


   for (let i = 0; i < nr_new_col; ++i){
      let col_index = nr_initial_col + i;

      for (let row_index = 0; row_index < nr_rows; ++row_index){
         let new_cell = table.rows[row_index].insertCell();

         new_cell.classList.add('r' + row_index);
         new_cell.classList.add('c' + col_index);

         drawPixel(row_index, col_index, color);
      }
   }
}

function colorMixer(colorA, colorB, amount){
   let cA = colorA * (1 - amount);
   let cB = colorB * (amount);
   return parseInt(cA + cB);
}

function drawPixelAmount(row, col, color, amount){
   let newColorArray = color.match(/\d+/g);

   console.log(newColorArray);

   let pixel = document.getElementsByClassName('r' + row + ' c' + col)[0];
   let oldColorArray = getComputedStyle(pixel).backgroundColor.match(/\d+/g);

   pixel.style.backgroundColor = 'rgb(' + 
   colorMixer(newColorArray[0], oldColorArray[0], amount) + ',' +
   colorMixer(newColorArray[1], oldColorArray[1], amount) + ',' +
   colorMixer(newColorArray[2], oldColorArray[2], amount) + ')'; 
}

function delRow(row) {
   let table = document.getElementById("drawTable");
   const nr_rows = table.rows.length;
   const nr_col = table.rows[row].cells.length;

   if (row < 0 || row >= nr_rows){
      alert("Row index invalid(" + row + ")");
      return;
   }
   console.log(row, nr_rows, nr_col)
   for (let row_index = row + 1; row_index < nr_rows; ++row_index){
      let curr_row = table.rows[row_index].cells;
      for (let col_index = 0; col_index < nr_col; ++col_index)
         console.log(curr_row[col_index].classList.replace('r' + row_index, 'r' + (row_index - 1)));
   }

   table.deleteRow(row);
}

function delCol(col) {
   let table = document.getElementById("drawTable");
   const nr_col = table.rows[0].cells.length;

   if (col < 0 || col >= nr_col){
      alert("Column index invalid(" + col + ")");
      return;
   }

   for (row of table.rows){
      for (let col_index = col + 1; col_index < nr_col; ++col_index)
         console.log(row.cells[col_index].classList.replace('c' + col_index, 'c' + (col_index - 1)));
      row.deleteCell(col);
   }
}

function shiftRow(row, pos) {
/*
   11. Aplicați o permutare circulară la dreapta cu 'pos' poziții a
   elementelor de pe linia cu numărul 'row' din tabla de desenat. 
*/
}

function jumble() {
/*
   12. Folosiți funcția 'shiftRow' pentru a aplica o permutare circulară
   cu un număr aleator de poziții fiecărei linii din tabla de desenat.
*/
}

function transpose() {
/*
   13. Transformați tabla de desenat în transpusa ei.
*/
}

function flip(element) {
/*
   14. Inversați ordinea copiilor obiectului DOM 'element' primit ca argument.
*/
}

function mirror() {
/*
   15. Oglindiți pe orizontală tabla de desenat: luați jumătatea stângă a tablei, 
   aplicați-i o transformare flip și copiați-o în partea dreaptă a tablei.
*/
}

function smear(row, col, amount) {
/*
   16. Întindeți culoarea unei celule de pe linia 'row' și coloana 'col' în celulele
   învecinate la dreapta, conform ponderii date de 'amount' (valoare între 0 și 1).
   Cu colorarea fiecărei celule la dreapta, valoarea ponderii se înjumătățește. 
   Hint: folosiți funcția 'drawPixelAmount'.
*/
}


window.onload = function(){
   const rows = 12;
   const cols = 12;	
   drawTable(rows, cols);
   /*
   drawRect(0, 0, 2, 3, 'blue');
   drawPixelExt(14, 14, "red");

   drawPixelAmount(0, 0, "rgb(255,0,0)", 0.5);
*/
   delRow(0);
   delCol(0);
   
}


