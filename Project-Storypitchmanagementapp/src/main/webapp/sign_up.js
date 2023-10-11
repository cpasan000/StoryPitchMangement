let url = "http://localhost:8080/Project_1/controller";

async function submitSignUp() {
    let flag = "/sign_up_author";

    let obj = {
        id: -1,
        firstName: document.getElementById("first_name").value,
        lastName: document.getElementById("last_name").value,
        bio: document.getElementById("sign_up_bio").value,
        points: 100,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }

    let confirm_password = document.getElementById("confirm");
    let mismatch_text = document.getElementById("mismatch_text");
    if (confirm_password.value != obj.password) {
        mismatch_text.style.display = "block";
    } else {
        mismatch_text.style.display = "none";

        fetch(url + flag, {
            method: "POST",
            body: JSON.stringify(obj)
        })
        .then(response => response.text())
        .then(data => window.location.href = data);
    }
}