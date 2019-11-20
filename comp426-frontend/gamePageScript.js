//Note for anyone viewing, add the following before your get request to avoid the CORS issue
//https://cors-anywhere.herokuapp.com/

//API Documentation: https://api-docs.igdb.com/#about

let gameID = 551;


let getGame = async function () {
    let API_KEY = "ea8883099be2c2944a4d34a9752d94f0";
    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },

        data: `fields name, age_ratings, cover, collection, popularity, rating , release_dates, summary, videos, websites; where id = ${gameID};`
    })
    renderGame(result.data);

}

let renderGame = async function (data) {
    let game = {
        name: data[0].name,
        age_ratings: data[0].age_ratings,
        cover: data[0].cover,
        collection: data[0].collection,
        popularity: data[0].popularity,
        rating: data[0].rating,
        release_dates: data[0].release_dates,
        summary: data[0].summary,
        videos: data[0].videos,
        websites: data[0].websites
    }
    console.log(game);
    $("#gameInfo").append(`<div>${game.name}</div>`);
}



$(document).ready(function () {
    getGame();
});
