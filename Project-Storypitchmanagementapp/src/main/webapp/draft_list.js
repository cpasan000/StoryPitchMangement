let url = "http://localhost:8080/Project_1/controller";

function fillTable() {
    let flag = "/get_draft_requests";

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + flag, true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                let stories = JSON.parse(xhttp.responseText);

                let table = document.getElementById("table");
                let rows = table.querySelectorAll("[name=\"dynamic\"]");
                console.log(rows);
                for (let elem of rows) {
                    elem.remove();
                }
                for (let story of stories) {
                    let tr = document.createElement("tr");
                    tr.setAttribute("name", "dynamic");
                    
                    // Author
                    let td = document.createElement("td");
                    td.setAttribute("class", "green purple-background");
                    td.innerHTML = story.author.firstName + " " + story.author.lastName;
                    td.onclick = () => {
                        handleRowClick(story);
                    }
                    tr.appendChild(td);

                    // Title
                    td = document.createElement("td");
                    td.setAttribute("class", "green purple-background");
                    td.innerHTML = story.title;
                    td.onclick = () => {
                        handleRowClick(story);
                    }
                    tr.appendChild(td);

                    // Story Name
                    td = document.createElement("td");
                    td.setAttribute("class", "green purple-background");
                    td.innerHTML = story.type.name;
                    td.onclick = () => {
                        handleRowClick(story);
                    }
                    tr.appendChild(td);

                    // Approval Status
                    td = document.createElement("td");
                    td.setAttribute("class", "green purple-background");
                    td.innerHTML = getPrettyStatus(story.approvalStatus);
                    td.onclick = () => {
                        handleRowClick(story);
                    }
                    tr.appendChild(td);
                    
                    table.appendChild(tr);
                }
            }
        }
    }
}

function getPrettyStatus(status) {
    if (status == "waiting") { return "Waiting for Points"; }
    if (status == "submitted") { return "Submitted"; }
    if (status == "approved_assistant") { return "Approved by Assistant"; }
    if (status == "approved_editor") { return "Approved by General"; }
    if (status == "approved_senior") { return "Waiting for Draft"; }
    if (status == "Approved") { return "Draft Approved"; }
}

function handleRowClick(story) {
    let modal_draft = document.getElementById("modal_draft");
    modal_draft.style.display = "block";

    let title = document.getElementById("df_title");
    let author_name = document.getElementById("df_author_name");
    let genre = document.getElementById("df_genre");
    let type = document.getElementById("df_type");
    let draft = document.getElementById("df_draft");

    title.innerHTML = story.title;
    author_name.innerHTML = story.author.firstName + " " + story.author.lastName;
    genre.innerHTML = story.genre.name;
    type.innerHTML = story.type.name;
    draft.innerHTML = story.draft;

    console.log(story.approvalStatus);

    let approveBtn = document.getElementById("approve_button");
    // let denyBtn = document.getElementById("deny_button");
    let changeBtn = document.getElementById("change_button");

    approveBtn.onclick = () => {
        approve(story);
    }

    // denyBtn.onclick = () => {
    //     deny(story);
    // }

    changeBtn.onclick = () => {
        story.draft = draft.value;
        story.modified = true;

        let label = document.getElementById("df_request_label");
        let box = document.getElementById("df_request");
        let btn = document.getElementById("df_submit_request");

        label.style.display = "inline";
        box.style.display = "inline";
        btn.style.display = "inline";

        btn.onclick = () => {
            story.request = box.value;
            change(story);
        }
        
        // change(story);
    }
}

function listBack() {
    window.location.href = "editor_main.html";
    fillTable();
}

function closeModal() {
    let modal_draft = document.getElementById("modal_draft");
    modal_draft.style.display = "none";
    fillTable();
}

async function approve(story) {
    let flag = "/approve_draft";

    closeModal();

    //TODO: these were intended to prevent approving the same draft twice, but they break the modal for the other pending drafts
    // let approveBtn = document.getElementById("approve_button");
    // let changeBtn = document.getElementById("change_button");
    
    approveBtn.style.display = "none";
    changeBtn.style.display = "none";

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}

async function deny(story) {
    let flag = "/deny_draft";

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}

async function change(story) {
    let flag = "/request_draft_change";

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}