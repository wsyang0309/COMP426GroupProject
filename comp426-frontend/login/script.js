$(document).ready(() => {
    $(document).on('click','#login_button', handleLogin);
    $(document).on('click','#signup_button', handleCreateAccount);
});

const accountRoot = new axios.create({
    baseURL: "http://localhost:3000/account"
});

async function handleLogin(e) {
    let email = $("#email").val();
    let password = $("#password").val();
    let $message = $('#message');

    const result = await accountRoot.post('/login', {
        "name": email,
        "pass": password
    }).then(() => {
        $message.html('<span class="has-text-success">Success! You are now logged in.</span>');
    }).catch(() => {
        $message.html('<span class="has-text-danger">Check your username and password again. Sign up if you have not done yet.</span>');
    });
    console.log(result);
}

async function handleCreateAccount(e) {
    let email = $("#email").val();
    let password = $("#password").val();
    const result = await accountRoot.post('/create', {
        "name": email,
        "pass": password
    });
    console.log(result);
}