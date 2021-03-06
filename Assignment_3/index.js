//required modules
const express = require('express');
const path = require("path");
const fs = require("fs"); //file system

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');
const { response } = require('express');

const app = express();

//Port environment variable already set up to run on Heroku
var port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express where our static files are located
const staticFilesPath = __dirname + "/modSolutionA2"
app.use(express.static(staticFilesPath));

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//The following is an example of an array of three boards. 
var boards = [
    { id: '0', name: "Planned", description: "Everything that's on the todo list.", tasks: ["0","1","2"] },
    { id: '1', name: "Ongoing", description: "Currently in progress.", tasks: [] },
    { id: '3', name: "Done", description: "Completed tasks.", tasks: ["3"] }
];

var tasks = [
    { id: '0', boardId: '0', taskName: "Another task", dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)), archived: false },
    { id: '1', boardId: '0', taskName: "Prepare exam draft", dateCreated: new Date(Date.UTC(2021, 00, 21, 16, 48)), archived: false },
    { id: '2', boardId: '0', taskName: "Discuss exam organisation", dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)), archived: false },
    { id: '3', boardId: '3', taskName: "Prepare assignment 2", dateCreated: new Date(Date.UTC(2021, 00, 10, 16, 00)), archived: true }
];

//Your endpoints go here

app.get("/", (request, resonse) => {
    resonse.sendFile(staticFilesPath + "/solution.html");
});

app.get("/api/v1/boards", (request, response) => {
    response.send(boards);
});

function getTasks(id) {
    for (task of tasks) {
        if (task.boardId == id) {
            console.log(task)
        }
    }
}

app.get("/api/v1/boards/:id/tasks", async (request, response) => {
    task = await getTasks(request.params.id)
    response.send(task)
});


//Start the server
app.listen(port, () => {
    console.log(`Event app listening on port: ${port}`);
});