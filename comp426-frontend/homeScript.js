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
    addNews();
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
    $('#gamePosters').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" onclick="handlePosterClick(${id})" class="posters" id=${id}/></a>`)
    
    function handlePosterClick(gameid) {
        console.log("game id is " + gameid) + " after clicking";
        localStorage.setItem("id", gameid);
        window.location.href = "gamePage.html";
    }
}

let addNews = async function() {
    let pulses = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/pulses",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: "fields author,category,created_at,ignored,image,published_at,pulse_image,pulse_source,summary,tags,title,uid,updated_at,videos,website; where created_at > 1546300800; limit 30;"
      })
    
    console.log(pulses)
    for(let i=0;i<pulses.data.length;i++) {
        if (pulses.data[i].summary !== undefined) {
            $('#news').append(`
                    <div id=posts class=${pulses.data.id}>
                        <h2 id="author">${pulses.data[i].author}</h2>
                        <h3 id="ptitle">${pulses.data[i].title}</h3>
                        <img id="pimg" src="${pulses.data[i].image}">
                        <p id="psum">${pulses.data[i].summary}</p>
                        
                    </div>`)
        }
        
        
    }

}

$(document).ready(function () {
    start();
});