//Note for anyone viewing, add the following before your get request to avoid the CORS issue
//https://cors-anywhere.herokuapp.com/

//API Documentation: https://api-docs.igdb.com/#about

const API_KEY = "ea8883099be2c2944a4d34a9752d94f0";

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

    console.log(result);
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
   
    $('#gamePosters').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" class="posters" id=${id}/>`)
}

$(document).ready(function () {
    start();
});