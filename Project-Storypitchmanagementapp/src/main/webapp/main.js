let url = "http://localhost:8080/Project_1/controller";

async function login(source) {
    console.log("Logging in from source " + source);
    let flag;

    if (source == 'Editor') {
        flag = "/editor_login";
    } else if (source == 'Author') {
        flag = "/author_login";
    }

    let loginObj = {
        username: document.getElementById("Username").value,
        password: document.getElementById("Password").value
    }

    console.log("Login info: " + loginObj);
    let json = JSON.stringify(loginObj);
    console.log("json: " + json);

    fetch(url + flag, {
        method: "POST",
        body: json
    })
    .then(response => response.text())
    .then(data => window.location.href = data);
}