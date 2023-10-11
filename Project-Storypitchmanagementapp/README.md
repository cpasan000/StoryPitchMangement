# Project: Story Pitch Management App
## Story Pitch Management System
The purpose of the Story Pitch Management System (SPMS) is to provide an organized pipeline for story pitches so that more new and creative stories can be given the opportunity to be published.
Authors are able to submit story pitches, and are limited in the amount of pitches they can have at any time based on a points system. Each type of story (Novel, Novella, Short Story, or Article) has a predetermined point cost, and Authors have a maximum point alotment of 100 points.
This limitation prevents one Author from overwhelming the system with several story pitches at one time. Any story pitch that an Author does not have sufficient points for is saved for future submission, and is automatically submitted to the approval committees when enough points become available.
Each genre of story has a committee of Editors that process story pitches for their respective genres. The approval process is as follows:
- An Author submits a story pitch.
- The pitch is sent to the Assistant Editor for approval.
- If the Assistant Editor approves the pitch, the pitch gets sent to an Editor that is NOT a member of the relevant genre committee for approval.
  - This removes any bias that this second editor might have toward the pitch given their expertise in the genre.
- If this General Editor approves the story pitch, it is sent to the Senior Editor for final approval.
- If the Senior Editor approves the pitch, the Author must submit a draft of the story for proofreading.
- When a draft is submitted for proofreading, it is sent to one or more Editors for approval, based on the type of story.
  - Novels/Novellas must be approved by the majority of the relavent genre committee.
  - Short Stories must be approved by the Senior Editor, plus one General Editor from the relavent genre committee.
  - Articles only need to be approved by the Senior Editor.
- When a draft has been approved, the pitch is marked as complete and the point cost for the story type is given back to the Author.
  - If the Author has pitches in the system that are waiting for points, they are automatically submitted based on the new point alotment.
  
## Technologies Used
- The back end was written in Java utilizing multiple apis.
  - Apis used include:
    - JUnit for unit testing
    - Log4j for logging
    - PostgreSQL for database management
    - The Javax servlet api
    - Google GSON for JSON manipulation
    - Tomcat for server hosting
- The front end was written in HTML utilizing CSS and Bootstrap for styling and JavaScript for DOM manipulation and dynamic element loading.

## Features
- Authors can submit story pitches.
- Authors have a predetermined maximum point alotment of 100 points.
- Story types cost different amounts of points:
  - Novels: 50
  - Novellas: 25
  - Short Stories: 20
  - Articles: 15
- Each story pitch must be approved by three levels of Editors before a draft can be submitted.
- Once a draft is sumbitted it must be proofread and approved by various amounts of Editors based on story type
- After a draft is approved, the points for that story type are awarded to the Author, and any story pitches that are awaiting submission will be automatically submitted for approval.

## Getting Started
- To begin using this software, you must first install [Spring Tool Suite](https://spring.io/tools).
- You also need to have [Apache Maven](https://maven.apache.org/) installed.
- You must also [download](https://git-scm.com/downloads) and [install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) Git.
- You will also need to [download and install Tomcat 9](https://tomcat.apache.org/download-90.cgi).
- When you have all of the software installed and have cloned the repository, open Spring Tool Suite and Import an Existing Maven Project.
  - In the window that pops up, navigate to the directory you cloned the repository into and click on the `pom.xml` file.
  - Maven will read the file, and will download all of the required dependencies.
- After Maven has finished building the project, click the green Run button at the top of STS to run the program.

## Usage
- With the program running in Spring Tool Suite, in your browser, navigate to `http://localhost:8080/Project_1`
- To login as an Author, you can either use the premade username of "andy" and password of "weir", or you can make your own login information.
- Once logged in, you will be redirected to a page with buttons to view submitted proposals, create new proposals, or view information requests.
  - On the view proposals page, click on a row to open the proposal associated with it.
- To log in as an Editor, logout to get back to the Author Login page, and click the button "Editor Login".
  - To log in as the Assistant Editor use username "sydney" and password "porter".
  - To log in as the General Editors use:
    - username "alex" password "luna"
    - username "erika" password "fomich"
    - username "bennett" password "kerbow"
  - To log in as the Senior Editor use username "emmett" password "riddle".

