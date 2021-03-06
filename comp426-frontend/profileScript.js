let myStorage = window.localStorage;
const API_KEY = "ea8883099be2c2944a4d34a9752d94f0";

let showWelcome = async function() {
    const user = await $.ajax({
        method: 'GET',
        url: "http://localhost:3000/account/status",
        headers: {
            "Authorization": "Bearer " + myStorage.getItem("jwt"),
        },
    });
    
    const currUser = user.user;
    let first_name = currUser.data.fname == ""? "Smart ATG User" : currUser.data.fname;
    let profile = $(`
        <div>
            <p>Welcome, `+ first_name +`!</p>
        </div>
    `);

    $('#welcome_title').append(profile);
}

async function renderSaved() {
    var retrievedData = localStorage.getItem("saved");
    var saved = JSON.parse(retrievedData);
    for (let i = 0; i < saved.length; i++) { 
        let game = await axios({
            url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'user-key': API_KEY
            },
    
            data: `fields name, cover; where id = ${saved[i]};`
        });

        let game_data = game.data[0];

        let result = await axios({
            url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/covers",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'user-key': API_KEY
            },
            data: `fields url, height, width, image_id; where id=${game_data.cover};`
        });
        
        let box = $(`
            <div class="saved_game" id="${saved[i]}">
                <img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" class="saved_game_cover" id="cover_${saved[i]}"/><br>
                <span>${game_data.name}</span><br>
                <button class="button is-small" id="button_${saved[i]}">remove</button>
            </div>
        `);
        $(document).on('click','#button_'+saved[i], handleRemove);
        $(document).on('click','#cover_'+saved[i], handleCoverClick);
        $('#library').append(box);
    }
}

let handleCoverClick =  function() {
    let gameid = this.parentNode.id;
    localStorage.setItem("id", gameid);
    window.location.href = "gamePage.html";
}

let handleRemove = function() {
    var retrievedData = localStorage.getItem("saved");
    var saved_games = new Set(JSON.parse(retrievedData));
    saved_games.delete(this.parentNode.id);
    localStorage.setItem("saved", JSON.stringify(Array.from(saved_games)));
    window.location.href = "profilePage.html";
}

let handleLogOut = function() {
    localStorage.removeItem("jwt");
}

$(document).ready(function () {
    $(document).on('click','#log_out', handleLogOut);
    showWelcome();
    renderSaved();
});