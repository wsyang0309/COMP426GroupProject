import apicalypse from 'apicalypse';
import axios from 'axios';

let API_KEY = "ea8883099be2c2944a4d34a9752d94f0";


let getGames = async function () {
    console.log("Entered");
    axios({
        url: "https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },

        data: "fields *;"
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.error(err);
        });
}

getGames();
