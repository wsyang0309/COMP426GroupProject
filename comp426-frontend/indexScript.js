$(document).ready(() => {
    $(document).on('click','#login_button', handleLogin);
    $(document).on('click','#signup_button', handleCreateAccount);
});

const accountRoot = new axios.create({
    baseURL: "http://localhost:3000/account"
});

let myStorage = window.localStorage;

async function handleLogin(e) {
    let username = $("#username").val();
    let password = $("#password").val();
    let $message = $('#message');
    let $nav_list = $('#nav_list');

    const loginUser = await $.ajax({
        method: 'post',
        url: 'http://localhost:3000/account/login',
        "data":{
            "name": username,
            "pass": password,
        }
    });
    
    myStorage.setItem('jwt', loginUser.jwt);

    console.log(myStorage.getItem('jwt'));
    // loginUser.then(() => {
    //     $message.html('<span class="has-text-success">Success! You are now logged in. </span>');
    //     $nav_list.append('<li><a href="homePage.html">Homepage</a></li>');
    // }).catch(() => {
    //     $message.html('<span class="has-text-danger">Check your username and password again. Sign up if you have not done yet.</span>');
    // });
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
        $message.html('<span class="has-text-success">Success! You are now signed up. You can now direct to our home page.</span>');
        $nav_list.empty();
        $nav_list.append('<li><a href="homePage.html">Homepage</a></li>');
    }).catch(() => {
        $message.html('<span class="has-text-danger">* indicates required items. Make sure your sign-up information are typed in correctly.</span>');
    });
}