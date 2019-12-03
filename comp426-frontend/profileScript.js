let myStorage = window.localStorage;

let showProfile = async function() {
    const user = await $.ajax({
        method: 'GET',
        url: "http://localhost:3000/account/status",
        headers: {
            "Authorization": "Bearer " + myStorage.getItem("jwt"),
        },
    });
    
    const currUser = user.user;
    console.log(currUser);
    let profile = $(`
        <div>
            <p>First Name: `+ currUser.data.fname +`</p>
        </div>
    `);

    $('#root').append(profile);
}

let handleLogOut = function() {
    localStorage.removeItem("jwt");
}

$(document).ready(function () {
    $(document).on('click','#log_out', handleLogOut);
    showProfile();
});