window.onload= function(){
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(
        "<?xml version='1.0' encoding='UTF-8'?><cinema><film category='science-fiction'><title lang='en'>Life</title><year>2004</year><director>Alex</director><producer>Joe</producer><screenwriter>Chris</screenwriter><actor>Susan</actor><actor>John</actor></film><film category='drama'><title lang='en'>Love</title><year>2002</year><director>Marcel</director><producer>Alexander</producer><screenwriter>Aurelius</screenwriter><actor>Zenon</actor><actor>Josh</actor></film></cinema>",
        "text/xml"
    );
    xml_cinema = xmlDoc.getElementsByTagName('cinema')[0];
    html_cinema = document.createElement('ol');

    html_cinema.id = 'cinema'
    
    document.getElementById('cinema_container').appendChild(html_cinema);
    xml_films = xml_cinema.childNodes;

    for (xml_film of xml_films){
        html_film = document.createElement('li');
        
        html_cinema.appendChild(html_film);
        xml_film_info = xml_film.childNodes;

        title = document.createTextNode(xml_film_info[0].textContent);
        html_film.appendChild(title);

        html_film_info = document.createElement('ol');
        
        html_film.appendChild(html_film_info);

        for (i = 1; i < xml_film_info.length; ++i){
            html_f_info = document.createElement('li');
            html_f_info.appendChild(document.createTextNode(
                                                    xml_film_info[i].tagName + ': ' +  
                                                    xml_film_info[i].textContent));
            html_film_info.appendChild(html_f_info);
        }
    }
}

