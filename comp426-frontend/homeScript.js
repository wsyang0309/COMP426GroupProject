//Note for anyone viewing, add the following before your get request to avoid the CORS issue
//https://cors-anywhere.herokuapp.com/

//API Documentation: https://api-docs.igdb.com/#about

/*
Syntax for SAVING data to localStorage:

localStorage.setItem("key", "value");
Syntax for READING data from localStorage:

var lastname = localStorage.getItem("key");
Syntax for REMOVING data from localStorage:

localStorage.removeItem("key");
*/

const API_KEY = "ea8883099be2c2944a4d34a9752d94f0";

let $posters = $(`#gamePosters`);

let start = async function() {
    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },

        data: `fields name,rating,cover,first_release_date; where rating > 90 & first_release_date >1546300800;limit 20;`
    })

    for(let i=0;i<result.data.length;i++) {
        addCover(result.data[i].cover, result.data[i].id)
        
    }

}

let addCover = async function (cover,id) {

    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/covers",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields url, height, width, image_id; where id=${cover};`
    })
   // Clickable posters
    //$('#gamePosters').prepend(`<a href=""><img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" class="posters" id=${id}/></a>`)
    $('#gamePosters').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" onclick="handlePosterClick(${id})" class="posters" id=${id}/></a>`)
    //$('#gamePosters').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" class="posters" id=${id}/>`)
    //console.log("game id is "+id);
    //$posters.on('click',`#${id}`, handlePosterClick);
    function handlePosterClick(gameid) {
        console.log("game id is " + gameid) + " after clicking";
        localStorage.setItem("id", gameid);
        window.location.href = "gamePage.html";
    }
}
/*
let handlePosterClick = function(gameid) {
    event.preventDefault();
    
    console.log("game id is " + gameid) + " after clicking";
    localStorage.setItem("id", gameid);
    window.location.href = "gamePage.html";
}
*/

/*
function handlePosterClick(gameid) {
    console.log("game id is " + gameid) + " after clicking";
    localStorage.setItem("id", gameid);
    window.location.href = "gamePage.html";
}
*/

$(document).ready(function () {
    start();
});