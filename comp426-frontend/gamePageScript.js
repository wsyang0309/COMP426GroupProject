//Note for anyone viewing, add the following before your get request to avoid the CORS issue
//https://cors-anywhere.herokuapp.com/

//API Documentation: https://api-docs.igdb.com/#about

//let gameID = 103329;
let gameID = localStorage.getItem("id");
console.log(gameID);
const API_KEY = "ea8883099be2c2944a4d34a9752d94f0";

let start = async function () {

    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },

        data: `fields artworks , similar_games, name, age_ratings, cover, popularity, rating , storyline, first_release_date, summary, videos; where id = ${gameID};`
    })

    renderGame(result.data);
    $('title').html(`${result.data[0].name}`);
}

let renderGame = async function (data) {
    let game = {
        id: data[0].id,
        name: data[0].name,
        artworks: data[0].artworks,
        similar_games: data[0].similar_games,
        age_ratings: data[0].age_ratings,
        cover: data[0].cover,
        popularity: data[0].popularity,
        rating: data[0].rating,
        first_release_date: data[0].first_release_date,
        summary: data[0].summary,
        videos: data[0].videos,
        storyline: data[0].storyline,
    }
    console.log(game);

    addCover(game.cover);
    createDetails(game);
    createSimilarGames(game.similar_games)
    addArtwork();
    addVideos();
    addReviews();
}
let addReviews = async function () {

    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/private/reviews",
        method: "POST",
        headers: {
            "Accept": "application/json",
            "user-key": API_KEY,

        },
        data: `fields conclusion,content,created_at,game,likes,title,user,user_rating,views;limit 50; where game=${gameID};`
    })

    let createReviews = async function (item) {

        let getRating = await axios({
            url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/private/rates",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "user-key": API_KEY
            },
            data: `fields rating ;limit 50; where id=${item.user_rating};`
        })
        let rating = getRating.data[0].rating;

        let review = `
        <div class="reviewBox">
        <p class="subtitle">Review Title: ${item.title}</p>
        <p>My Rating: ${rating}</p>
        <p>Times liked: ${item.likes}</p>
        <p>Date Reviewed: ${fixDate(item.created_at)}</p>

        <p>The Review: </p>
        <p>${item.content}</p>
        </div>`
        return review;
    }

    for (let i = 0; i < result.data.length; i++) {
        let reviewHTML = await createReviews(result.data[i]);
        $('#reviews').append(reviewHTML);
    }
}


let addVideos = async function () {
    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/game_videos",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields game,name,video_id; where game=${gameID};`
    })


    for (let i = 0; i < result.data.length; i++) {
        let video = `<iframe width="504" height="378" class="column" allowfullscreen
        src="https://www.youtube.com/embed/${result.data[i].video_id}">
        </iframe>`
        $('#videos').append(video);

    }


}
let addCover = async function (id) {

    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/covers",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields url, height, width, image_id; where id=${id};`
    })
    $('#cover').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" class="media" />`)
}

let createDetails = function (game) {
    let details =
        `
    <div class="myBox">
    <p class="subtitle">${game.name}</p>
    <p>Popularity: ${Math.round(game.popularity)}</p>
    <p>Critics Rating: ${Math.round(game.rating)}</p>
    <p>Release Date: ${fixDate(game.first_release_date)}</p>
    <p>Summary: </p>
    <p>${game.summary}</p>
    <p>Plot: </p>
    <p>${game.storyline}</p>
    </div>
    
    
    
    `
    $("#details").append(details);
}
let createSimilarGames = async function (games) {
    let names = [];

    for (let i = 0; i < games.length; i++) {
        let result = await axios({
            url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'user-key': API_KEY
            },

            data: `fields name; where id=${games[i]};`
        })
        names.push(result.data[0].name);
    }


    let createList = function (list) {
        let ret = `<div class="myBox"><p class="subtitle">List of Similar Games</p><ol>`;

        for (let i = 0; i < list.length; i++) {
            ret += `<li>${list[i]}</li>`
        }
        ret += "</ol></div>"
        return ret;
    }
    $("#similar").append(createList(names));
}
let fixDate = function (unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    let date = new Date(unix_timestamp * 1000);
    let month = date.getMonth();
    let day = date.getDay() + 1;
    let year = date.getFullYear();
    let formattedDate = month + '/' + day + '/' + year;
    return formattedDate;
}

let addArtwork = async function () {
    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/artworks",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields alpha_channel,animated,game,height,image_id,url,width; where game=${gameID};`
    })

    for (let i = 0; i < result.data.length; i++) {
        let image = `<img src="//images.igdb.com/igdb/image/upload/t_720p/${result.data[i].image_id}.jpg" class="column pics" />`
        $('#artwork').append(image);
    }
}

//Saving Game to user profile
function handleSaveGame(e) {
    var retrievedData = localStorage.getItem("saved");
    var saved_games = new Set(JSON.parse(retrievedData));
    saved_games.add(localStorage.getItem("id"));
    localStorage.setItem("saved", JSON.stringify(Array.from(saved_games)));
    window.location.href = "gamePage.html";
}

$(document).ready(function () {
    if(localStorage.getItem("jwt") != null) {
        var retrievedData = localStorage.getItem("saved");
        var saved_games = new Set(JSON.parse(retrievedData));
        if(saved_games.has(localStorage.getItem("id"))) {
            $('#save').append($(`<button class="button is-small is-success">Saved</button>`));
        } else {
            $('#save').append($(`<button class="button is-small is-danger" id="save_game">Save Game</button>`));
            $(document).on('click','#save_game', handleSaveGame);
        }
    }
    start();
});