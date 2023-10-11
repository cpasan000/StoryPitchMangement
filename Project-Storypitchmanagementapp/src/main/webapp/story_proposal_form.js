let url = "http://localhost:8080/Project_1/controller"

function fillDropdowns() {
    console.log("fillStoryTypeDropdown");
    let flag = "/get_story_types";

    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + flag, true);
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                let rt = xhttp.responseText;
                let jsons = JSON.parse(rt);
                let stj = JSON.parse(jsons[0]);
                let gj = JSON.parse(jsons[1]);
                let author = JSON.parse(jsons[2]);

                let sts = document.getElementById("story_type_select");
                let gs = document.getElementById("genre_select");
                let point_counter = document.getElementById("point_counter");

                for (let i in stj) {
                    let story_type = stj[i];
                    let option = document.createElement("option");
                    if (i == 0) {
                        option.setAttribute("selected", "selected");
                    }
                    option.setAttribute("value", story_type.name);
                    option.setAttribute("cost", story_type.points);
                    option.innerHTML = story_type.name;
                    sts.appendChild(option);
                }

                point_counter.innerHTML = "Point Cost: " + stj[0].points;
                sts.onchange = () => {
                    point_counter.innerHTML = "Point Cost: " + sts.children[sts.selectedIndex].getAttribute("cost");
                }

                for (let i in gj) {
                    let genre = gj[i];
                    let option = document.createElement("option");
                    if (i == 0) {
                        option.setAttribute("selected", "selected");
                    }
                    option.setAttribute("value", genre.name);
                    option.innerHTML = genre.name;
                    gs.appendChild(option);
                }

                let author_name = document.getElementById("author_name");
                let author_bio = document.getElementById("author_bio");
                let author_points = document.getElementById("points_available");

                author_name.innerHTML = author.firstName + " " + author.lastName;
                author_bio.innerHTML = author.bio;
                author_points.innerHTML = "Available Points: " + author.points;
                if (author.points < stj[0].points) {
                    console.log("appending the thing!!!")
                    let author_points_notice = document.getElementById("points_available_notice");
                    author_points_notice.innerHTML = " ** This proposal will be saved for future submission! **";
                }
            }
        }
    }
}

async function submitForm() {
    let flag = "/submit_story_form";

    let story_form = {
        title: document.getElementById("story_title").value,
        genre: document.getElementById("genre_select").value,
        type: document.getElementById("story_type_select").value,
        description: document.getElementById("description").value,
        tagLine: document.getElementById("tagline").value,
        completionDate: document.getElementById("date").value,
        submissionDate: null
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    story_form.submissionDate = today;

    fetch(url + flag, {
        method: "POST",
        body: JSON.stringify(story_form)
    })
    .then(response => window.location.href = "author_main.html");
}