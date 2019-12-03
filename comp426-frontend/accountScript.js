$(document).ready(() => {
    $(document).on('click','#login_button', handleLogin);
    $(document).on('click','#signup_button', handleCreateAccount);
});

const accountRoot = new axios.create({
    baseURL: "http://localhost:3000/account"
});

async function handleLogin(e) {
    let username = $("#username").val();
    let password = $("#password").val();
    let $message = $('#message');
    let $nav_list = $('#nav_list');

    const loginUser = await $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/account/login',
        "data":{
            "name": username,
            "pass": password,
        }
    }).then(response => {
        console.log(response.jwt);
        localStorage.setItem("jwt", response.jwt);
        window.location.href = "index.html";
    }).catch(() => {
        $message.html('<span class="has-text-danger">Check your username and password again. Sign up if you have not done yet.</span>');
    });
}

async function handleCreateAccount(e) {
    let username = $("#username").val();
    let password = $("#password").val();
    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let $message = $('#message');
    let $nav_list = $('#nav_list');

    const result = await accountRoot.post('/create', {
        "name": username,
        "pass": password,
        "data": {
            "fname": fname,
            "lname": lname,
        }
    }).then(() => {
        $message.html('<span class="has-text-success">Sign up success! You will now be redirectred to the login page.</span>');
        setTimeout(()=>{
            window.location.href = "login.html";
        }, 2000);
    }).catch(() => {
        $message.html('<span class="has-text-danger">* indicates required items. Make sure your sign-up information are typed in correctly.</span>');
    });
}