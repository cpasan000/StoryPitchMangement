let url = "http://localhost:8080/Project_1/controller";

async function populateLabels() {
    let flag = "/get_editor_main_labels";

    fetch(url + flag, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        let logged_in_label = document.getElementById("logout_button_label");
        let proposals_label = document.getElementById("proposals_button_label");
        let info_label = document.getElementById("info_button_label");
        let drafts_label = document.getElementById("drafts_button_label");

        logged_in_label.innerHTML = "Logged in as: " + data[0];
        proposals_label.innerHTML = "Pending: " + data[1];
        info_label.innerHTML = "Pending: " + data[2];
        drafts_label.innerHTML = "Pending: " + data[3];
    })
}

function viewProposals() {
    window.location.href = "editor_story_list.html";
}

function viewInfoRequests() {
    window.location.href = "info_request_list.html";
}

function viewDrafts() {
    window.location.href = "draft_list.html";
}

async function logout() {
    let flag = "/logout";

    fetch(url + flag, {
        method: "POST"
    })
    .then(response => response.text())
    .then(data => window.location.href = data);
}