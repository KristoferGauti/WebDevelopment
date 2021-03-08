/*
    TODO 
    Change the date on cards to be the date today
    update 
*/


//required modules
const express = require('express');
const path = require("path");

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

function getData(arr, id) {
    let data;
    for (let i = 0; i <= arr.length-1; i++) {
        if (arr[i].id == id) {
            data = arr[i]
        }
    }
    return data
}

function boardContainsTasks(boardId){
    for (task of tasks){
        if (task.boardId == boardId && !task.archived){return true;}
    }
    return false;
}

function generateId(arr) {
    let newId = 0;
    // take the newid and for each board check it's id. It newid matches a id, break for loop and do it again
    let idNotFound = true;

    while (idNotFound){
        idNotFound = false;
        for (item of arr){
            if (parseInt(item.id) === parseInt(newId)) {
                newId++; 
                idNotFound = true; 
                break;
            } 
        }
    }
    return newId
}

//Your endpoints go here
app.get('/favico.ico', (req, res) => {
    res.sendFile(path.join(__dirname, "modSolutionA2", "/favicon.ico"));
});

app.get("/", (request, resonse) => {
    resonse.status(200).sendFile(staticFilesPath + "/solution.html");
});

app.get("/api/v1/boards", (request, response) => {
    response.status(200).send(boards);
});

app.get("/api/v1/boards/:id", (request, response) => {
    let responseBoard = getData(boards, request.params.id);
    response.status(200).send(responseBoard);
});

app.get("/api/v1/boards/:id/tasks", (request, response) => {
    let responseTasks = [];
    let taskIds;
    for (board of boards) {
        if (board.id == request.params.id) {
            taskIds = board.tasks
        }
    }
    for (task of tasks) {
        for (taskId of taskIds) {
            if (task.id == taskId) responseTasks.push(task)
        }
    }
    response.status(200).send(responseTasks);
});

app.get("/api/v1/boards/:bid/tasks/:tid", (request, response) => {
    let responseTask;
    for (let i = 0; i <= boards.length-1; i++) {
        if (tasks[i].id == request.params.tid) {
            responseTask = tasks[i]
        }
    }
   
    response.status(200).send(responseTask);
});

app.post("/api/v1/boards/:id/tasks", (request, response) => {
    newTaskId = generateId(tasks)
    console.log(newTaskId);

    const responseTask = {
        id: String(newTaskId), 
        boardId: request.params.id, 
        taskName: request.body.taskName, 
        dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)), 
        archived: false
    }
    tasks.push(responseTask);
    let theBoard = getData(boards, responseTask.boardId)
    theBoard.tasks.push(responseTask.id)
    response.status(200).send(responseTask)
});

app.post("/api/v1/boards", (request, response) => {
    let newBoardId = generateId(boards);
    const responseBoard = {
        "id": newBoardId, 
        "name": request.body.name, 
        "description": "", 
        "tasks": [] 
    }
    boards.push(responseBoard);
    response.status(200).send(responseBoard);
});

app.put("/api/v1/boards", (request, response) => {
    console.log(request.body)
    //Implement later!!!!!!!!!!
});

app.delete("/api/v1/boards/:id", (request, response) => {
    let responseBoard;
    if (!boardContainsTasks(request.params.id)){
        for (let i = 0; i <= boards.length-1; i++) {
            if (boards[i].id == request.params.id) {
                responseBoard = boards[i]
                boards.splice(i, 1);
            }
        }
        response.status(200).send(responseBoard);
    }
});

app.patch("/api/v1/boards/:id/tasks/:id", (request,response) => {
    console.log("Executed!")
    for (let i = 0; i < tasks.length; i++){
        if (parseInt(tasks[i].id) == parseInt(request.params.id)){
            tasks[i].archived = true;
        }
    }
    response.send(tasks);
})


//Start the server
app.listen(port, () => {
    console.log(`Event app listening on port: ${port}`);
});