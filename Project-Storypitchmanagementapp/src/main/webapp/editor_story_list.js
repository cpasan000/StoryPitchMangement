let url = "http://localhost:8080/Project_1/controller"
let time_limit = 1.21e+9;   // 2 weeks in milliseconds
let logged_in;

/*
        Fill in the list of proposals on editor_story_list.html
*/
function fillProposals() {
    // getLoggedIn();
    console.log("filling proposal table");
    let flag = "/get_proposals";

    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url + flag, true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                console.log("fillProposals() ready/OK");
                // let rt = xhttp.responseText;
                // let json = JSON.parse(rt);

                let strs = xhttp.responseText.split("|");
                logged_in = strs[0];
                console.log(strs[1]);
                let stories = JSON.parse(strs[1]);

                // console.log(json);

                let lock = false;
                let senior = logged_in == "senior";
                let general = logged_in == "general";
                let assistant = logged_in == "assistant";
                let author = logged_in == "author"

                let table = document.getElementById("proposals");
                for (let story of stories) {
                // for (let story of json) {
                    let overdue = checkOverdue(story);
                    if (overdue) lock = true;
                    // let lockOthers = shouldLockOthers(story);

                    let tr = document.createElement("tr");
                    
                    // Author
                    let td = document.createElement("td");
                    // if (story.modified && story.request != null) 
                    if ((overdue && !author) || (author && story.modified && story.request != null)) {
                        td.setAttribute("class", "green red-background");
                    } else {
                        td.setAttribute("class", "green purple-background");
                    }
                    td.innerHTML = story.author.firstName + " " + story.author.lastName;

                    console.log("Author: " + author);
                    console.log("Assistant: " + assistant);
                    console.log("General: " + general);
                    console.log("Senior: " + senior);
                    console.log("Overdue: " + overdue);
                    console.log("Lock: " + lock);

                    if ((author || senior) || ((overdue == lock) && (assistant || general))) {
                        td.onclick = () => {
                            handleRowClick(story);
                        }
                    }

                    tr.appendChild(td);

                    // Title
                    td = document.createElement("td");
                    if ((overdue && !author) || (author && story.modified && story.request != null)) {
                        td.setAttribute("class", "green red-background");
                    } else {
                        td.setAttribute("class", "green purple-background");
                    }
                    td.innerHTML = story.title;

                    if ((author || senior) || ((overdue == lock) && (assistant || general))) {
                        td.onclick = () => {
                            handleRowClick(story);
                        }
                    }

                    tr.appendChild(td);

                    // Story Name
                    td = document.createElement("td");
                    if ((overdue && !author) || (author && story.modified && story.request != null)) {
                        td.setAttribute("class", "green red-background");
                    } else {
                        td.setAttribute("class", "green purple-background");
                    }
                    td.innerHTML = story.type.name;

                    if ((author || senior) || ((overdue == lock) && (assistant || general))) {
                        td.onclick = () => {
                            handleRowClick(story);
                        }
                    }

                    tr.appendChild(td);

                    // Approval Status
                    td = document.createElement("td");
                    if ((overdue && !author) || (author && story.modified && story.request != null)) {
                        td.setAttribute("class", "green red-background");
                    } else {
                        td.setAttribute("class", "green purple-background");
                    }
                    td.innerHTML = getPrettyStatus(story.approvalStatus);

                    if ((author || senior) || ((overdue == lock) && (assistant || general))) {
                        td.onclick = () => {
                            handleRowClick(story);
                        }
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
    if (status == "approved_assistant") { return "Approved by Assistant Editor"; }
    if (status == "approved_editor") { return "Approved by General Editor"; }
    if (status == "approved_senior") { return "Waiting for Draft"; }
    if (status == "Approved") { return "Approved"; }
    if (status == "denied") { return "Denied"; }
    if (status == "cancelled") { return "Cancelled"; }
}

/*
        Handle row clicks on editor_story_list.html
*/
async function handleRowClick(story) {
    let flag = "/save_story_to_session";
    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
    .then(response => response.text())
    .then(data => window.location.href = "story_form_static.html");
}

/*
        Utility functions for editor_story_list.html
 */
function getDateDifference(submitted) {
    const current = new Date();
    submitted = new Date(submitted);
    return current - submitted;
}

function checkOverdue(story) {
    console.log(story.title + " has approval status " + story.approvalStatus);
    return getDateDifference(story.submissionDate) > time_limit;
}

function listBack() {
    if (logged_in == "author") {
        window.location.href = "author_main.html";
    } else {
        window.location.href = "editor_main.html";
    }
}



/*
        Fill fields on story_form_static.html
*/
function populateStaticForm() {
    let flag = "/get_story_from_session";
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + flag, true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        console.log("Clicked " + xhttp.responseText);
        let strs = xhttp.responseText.split("|");
        logged_in = strs[0];
        let story = JSON.parse(strs[1]);

        let isSenior = isSeniorStatus(story);

        if (isSenior) {
            let update_button = document.getElementById("update_button");
            update_button.style.display = "inline";
            update_button.onclick = () => {
                updateDetails(story);
            }
        }

        if (story.response != null) {
            let response_button = document.getElementById("response_button");
            response_button.style.display = "inline";
            response_button.onclick = () => {
                let modal_response = document.getElementById("modal_response");
                modal_response.style.display = "block";

                let request_label = document.getElementById("request_label");
                request_label.innerHTML = "You asked " + story.receiverName + " for the following information:";

                let request = document.getElementById("request");
                request.innerHTML = story.request;

                let response = document.getElementById("response");
                response.innerHTML = story.response;
            }
        }

        let sf_sub_date = document.getElementById("sf_submission_date");
        let sf_title = document.getElementById("sf_title");
        let sf_author_name = document.getElementById("sf_author_name");
        let sf_author_bio = document.getElementById("sf_author_bio");
        let sf_author_points = document.getElementById("sf_author_points");
        let sf_genre = document.getElementById("sf_genre");
        let sf_type = document.getElementById("sf_type");
        let sf_description = document.getElementById("sf_description");
        let sf_tagline = document.getElementById("sf_tagline");
        let sf_completion_date = document.getElementById("sf_completion_date");
        let sf_status = document.getElementById("sf_status");

        let approveBtn = document.getElementById("approve_button");
        let denyBtn = document.getElementById("deny_button");
        let infoBtn = document.getElementById("info_button");
        let draftBtn = document.getElementById("draft_button");

        if (logged_in == "author") {
            infoBtn.style.display = "none";

            denyBtn.value = "Cancel";

            if (story.approvalStatus == "approved_senior") {
                draftBtn.style.display = "inline";

                let modal_draft = document.getElementById("modal_draft");
                draftBtn.onclick = () => {
                    modal_draft.style.display = "block";
                }

                let draft_title = document.getElementById("draft_title");
                draft_title.innerHTML = story.title;

                let submit_draft_button = document.getElementById("submit_draft_button");
                submit_draft_button.onclick = () => {
                    modal_draft.style.display = "none";
                    let draft_box = document.getElementById("draft_box");
                    story.draft = draft_box.value;
                    let sf_draft = document.getElementById("sf_draft");
                    sf_draft.innerHTML = story.draft;
                    sf_draft.style.display = "block";
                    console.log("Submitting draft: " + draft_box.value);
                    submitDraft(story);
                }

                if (story.modified) {
                    approveBtn.style.display = "inline";
                    // denyBtn.style.display = "inline";
                    denyBtn.value = "Deny Changes";
                }
            }
        } else {
            approveBtn.style.display = "inline";
            denyBtn.style.display = "inline";
            infoBtn.style.display = "inline";
        }

        approveBtn.onclick = () => {
            approve(story);
        }

        if (story.approvalStatus == "approved_senior") {
            let sf_draft_label = document.getElementById("sf_draft_label");
            let sf_draft = document.getElementById("sf_draft");
            
            console.log("about to swap box: " + story.draft)
            /* 
             * Allow Author to modify draft if changes have been requested
             */
            if (story.modified && story.request != null) {
                sf_draft_label.style.display = "block";
                let sf_draft_modifiable = document.createElement("textarea")
                sf_draft_modifiable.setAttribute("class", "purple light-grey-background");
                sf_draft_modifiable.setAttribute("name", "sf_draft_modifiable");
                sf_draft_modifiable.setAttribute("id", "sf_draft_modifiable");
                sf_draft_modifiable.setAttribute("cols", "30");
                sf_draft_modifiable.setAttribute("rows", "10");
                document.getElementById("main_div").replaceChild(sf_draft_modifiable, sf_draft);
                sf_draft_modifiable.value = story.draft;

                let request_label = document.getElementById("sf_draft_change_request_label");
                let request = document.getElementById("sf_draft_change_request");

                request_label.style.display = "block";
                request.style.display = "block";

                request.innerHTML = story.request;

                let update_draft_btn = document.getElementById("update_draft_button");
                update_draft_btn.style.display = "inline";
                update_draft_btn.onclick = () => {
                    story.draft = sf_draft_modifiable.value;
                    updateDraft(story);
                }
            }

            sf_draft_label.style.display = "block";
            sf_draft.style.display = "block";

            sf_draft.innerHTML = story.draft;
        }

        if (isSenior) {
            var sf_title_editable = document.createElement("input");
            sf_title_editable.setAttribute("type", "text");
            sf_title_editable.setAttribute("name", "story_title");
            sf_title_editable.setAttribute("id", "sf_title");
            sf_title_editable.style.display = "block";
            sf_title.parentNode.replaceChild(sf_title_editable, sf_title);

            var sf_tagline_editable = document.createElement("input");
            sf_tagline_editable.setAttribute("type", "text");
            sf_tagline_editable.setAttribute("name", "tagline");
            sf_tagline_editable.setAttribute("id", "sf_tagline");
            sf_tagline_editable.style.display = "block";
            sf_tagline.parentNode.replaceChild(sf_tagline_editable, sf_tagline);

            var sf_completion_date_editable = document.createElement("input");
            sf_completion_date_editable.setAttribute("type", "text");
            sf_completion_date_editable.setAttribute("name", "completion_date");
            sf_completion_date_editable.setAttribute("id", "sf_completion_date");
            sf_completion_date_editable.style.display = "block";
            sf_completion_date.parentNode.replaceChild(sf_completion_date_editable, sf_completion_date);
        }

        let overdue = checkOverdue(story);

        sf_sub_date.innerHTML = story.submissionDate;

        if (overdue) {
            sf_sub_date.innerHTML += "    ** High Priority **";
        }



        if (isSenior) {
            sf_title_editable.value = story.title;
            sf_tagline_editable.value = story.tagLine;
            sf_completion_date_editable.value = story.completionDate;
        } else {
            sf_title.innerHTML = story.title;
            sf_tagline.innerHTML = story.tagLine;
            sf_completion_date.innerHTML = story.completionDate;
        }
        sf_author_name.innerHTML = story.author.firstName + " " + story.author.lastName;
        sf_author_bio.innerHTML = story.author.bio;
        sf_author_points.innerHTML = story.author.points;
        sf_genre.innerHTML = story.genre.name;
        sf_type.innerHTML = story.type.name + " (" + story.type.points + " points)";
        sf_description.innerHTML = story.description;
        sf_status.innerHTML = getPrettyStatus(story.approvalStatus);



        if (overdue) {
            sf_sub_date.setAttribute("class", "red light-grey-background");
        } else {
            sf_sub_date.setAttribute("class", "purple light-grey-background");
        }

        if (isSenior) {
            sf_title_editable.setAttribute("class", "purple light-grey-background");
            sf_tagline_editable.setAttribute("class", "purple light-grey-background");
            sf_completion_date_editable.setAttribute("class", "purple light-grey-background");
        } else {
            sf_title.setAttribute("class", "purple light-grey-background");
            sf_tagline.setAttribute("class", "purple light-grey-background");
            sf_completion_date.setAttribute("class", "purple light-grey-background");
        }
        
        sf_author_name.setAttribute("class", "purple light-grey-background");
        sf_author_bio.setAttribute("class", "purple light-grey-background");
        sf_author_points.setAttribute("class", "purple light-grey-background");
        sf_genre.setAttribute("class", "purple light-grey-background");
        sf_type.setAttribute("class", "purple light-grey-background");
        sf_description.setAttribute("class", "purple light-grey-background");
        sf_status.setAttribute("class", "purple light-grey-background");



        /*
                Approve proposal
        */
        async function approve(story) {
            let flag = "/approve_story";

            if (logged_in == "author" && story.modified) {
                story.modified = false;
            } else {
                story.request = null;
                story.response = null;
                story.requestorName = null;
                story.receiverName = null;
            }

            fetch(url + flag, {
                method: "POST",
                body: JSON.stringify(story)
            })
            .then(response => sf_status.innerHTML = "Approved")
        }

        

        /* Handle Modal Reason */
        let modal_reason = document.getElementById("modal_reason");
        denyBtn.onclick = () => {
            // deny(story);
            modal_reason.style.display = "block";
        }

        let sendReasonBtn = document.getElementById("send_reason_button");
        sendReasonBtn.onclick = () => {
            let reason = document.getElementById("reason").value;
            if (reason.length > 0) {
                modal_reason.style.display = "none";
                deny(story, reason);
            }
        }
        
        /* Handle Modal Info */
        let modal_info = document.getElementById("modal_info");
        infoBtn.onclick = () => {
            modal_info.style.display = "block";
        }

        let sendInfoBtn = document.getElementById("send_info_button");
        sendInfoBtn.onclick = () => {
            let prompt = document.getElementById("prompt").value;
            let person = document.getElementById("person_select").value;
            if (prompt.length > 0) {
                modal_info.style.display = "none";
                story.request = prompt;
                requestInfo(story, person);
            }
        }



        /* Fill Persons Dropdown */
        let ps = document.getElementById("person_select");
        // Delete children of the ps element to prevent duplicates
        while (ps.firstChild) {
            ps.removeChild(ps.firstChild);
        }

        makeOption(story.author, true, ps);

        if (story.approvalStatus == "approved_assistant") {
            makeOption(story.assistant, false, ps);
        }

        if (story.approvalStatus == "approved_editor") {
            makeOption(story.editor, false, ps);
        }
    }
}

function makeOption(person, selected, ps) {
    let option = document.createElement("option");
    if (selected) {
        option.setAttribute("selected", selected);
    }
    option.setAttribute("value", person.firstName + " " + person.lastName);
    option.innerHTML = person.firstName + " " + person.lastName;
    ps.appendChild(option);
}

/*
        Deny proposal
*/
async function deny(story, reason) {
    let flag = "/deny_story";
    story.approvalStatus = "denied";    // this is not strictly needed as the approval status is set in Java, but I'll leave it here anyway
    story.reason = reason;
    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Denied story " + data);
        story = data;

        let reason_box_label = document.getElementById("label_for_sf_reason");
        let reason_box = document.getElementById("sf_reason");

        reason_box_label.style.display = "block";
        reason_box.style.display = "block";

        reason_box.innerHTML = story.reason;
    });
}

/*
        Request Info about proposal
*/
async function requestInfo(story, person) {
    let flag = "/request_info";
    let packet = [JSON.stringify(story), JSON.stringify(person)];

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(packet)
    })
}

/*
        Utility functions for story_form_static.html
*/
function sfBack() {
    window.location.href = "editor_story_list.html";
}

function closeInfoModal() {
    let modal_info = document.getElementById("modal_info");
    modal_info.style.display = "none";
}

function closeReasonModal() {
    let modal_reason = document.getElementById("modal_reason");
    modal_reason.style.display = "none";
}

function closeResponseModal() {
    let modal_response = document.getElementById("modal_response");
    modal_response.style.display = "none";
}

function closeDraftModal() {
    let modal_draft = document.getElementById("modal_draft");
    modal_draft.style.display = "none";
}

function isSeniorStatus(story) {
    return story.approvalStatus == "approved_editor";
}

async function updateDetails(story) {
    let flag = "/update_details";
    var sf_title_editable = document.getElementById("sf_title");
    var sf_tagline_editable = document.getElementById("sf_tagline");
    var sf_completion_date_editable = document.getElementById("sf_completion_date");

    story.title = sf_title_editable.value;
    story.tagLine = sf_tagline_editable.value;
    story.completionDate = sf_completion_date_editable.value;
    story.modified = true;

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}

async function submitDraft(story) {
    let flag = "/submit_draft";
    story.draft = document.getElementById("draft_box").value;

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}

async function updateDraft(story) {
    let flag = "/update_draft";
    
    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story)
    })
}