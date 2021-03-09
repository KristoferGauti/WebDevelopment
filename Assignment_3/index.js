/*
    TODO 
    Change the date on cards to be the current date today
    Maybe check on returning no tasks array in the board response
    The request for create a board, if successful, shall return the new board (all attributes, including id and tasks array).
    ERROR try catch in every single HTTP requests (response.status(X) where X is a status code)
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

// ############# HELPER FUNCTIONS #############
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

// ############# ENDPOINTS #############
/*
 * An endpoint to a favicon icon so we dont get a favicon error
 */
app.get('/favico.ico', (req, res) => {
    res.sendFile(path.join(__dirname, "modSolutionA2", "/favicon.ico"));
});

/*
 * Display the home page
 */
app.get("/", (request, resonse) => {
    resonse.status(200).sendFile(staticFilesPath + "/solution.html");
});

/*
 * Get all boards
 */
app.get("/api/v1/boards", (request, response) => {
    response.status(200).send(boards);
});

/*
 * Get a board (id)
 */
app.get("/api/v1/boards/:id", (request, response) => {
    let responseBoard = getData(boards, request.params.id);
    response.status(200).send(responseBoard);
});

/*
 * Get all tasks from a board (id)
 */
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

/*
 *  Load task (tid) to a board (bid)
 */
app.get("/api/v1/boards/:bid/tasks/:tid", (request, response) => {
    let responseTask;
    for (board of boards) {
        if (board.id == request.params.bid) {
            for (task of tasks) {
                if (task.id == request.params.tid && 
                    board.tasks.includes(request.params.tid)) {
                    responseTask = task
                }
            }
        }
    }
    response.status(200).send(responseTask)
});

/*
 * Create a new task to a board (id)
 */
app.post("/api/v1/boards/:id/tasks", (request, response) => {
    newTaskId = generateId(tasks)
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

/*
 * Create a board, with a generated id
 */
app.post("/api/v1/boards", (request, response) => {
    let newBoardId = generateId(boards);
    const responseBoard = {
        id: newBoardId, 
        name: request.body.name, 
        description: "", 
        tasks: [] 
    }
    boards.push(responseBoard);
    response.status(200).send(responseBoard);
});

app.put("/api/v1/boards/:id", (request, response) => {
    let updatedBoard = getData(boards, request.params.id);
    updatedBoard.name = request.body.name;
    updatedBoard.description = request.body.description;
    response.status(200).send(updatedBoard);
});

/*
 * Delete a board (id)
 */
app.delete("/api/v1/boards/:id", (request, response) => {
    let responseBoard;
    if (!boardContainsTasks(request.params.id)) {
        for (let i = 0; i <= boards.length-1; i++) {
            if (boards[i].id == request.params.id) {
                responseBoard = boards[i]
                boards.splice(i, 1);
            }
        }
        response.status(200).send(responseBoard);
    }
    response.status(404).send()
});

/*
 * Delete all boards
 */
app.delete("/api/v1/boards", (request, response) => {
    for (board of boards) {
        for (taskId of board.tasks) {
            let task = getData(tasks, taskId);
            if (task.id == taskId) {
                let index = board.tasks.indexOf(task.id)
                board.tasks[index] = task
            }
        }
    }
    let deletedItems = [...boards];
    boards = boards.slice(boards.length);
    tasks = tasks.slice(tasks.length);
    response.status(200).send(deletedItems);
});

/*
 * Update a task (tid) attributes 
 * taskName, archived and/or boardId on a board (bid)
 */
app.patch("/api/v1/boards/:bid/tasks/:tid", (request,response) => {
    let appendBoardIdBoolean = false;
    let newTask;
    for (let i = 0; i < tasks.length; i++){
        if (parseInt(tasks[i].id) == parseInt(request.params.tid)){
            newTask = getData(tasks,tasks[i].id);
            if (request.body.hasOwnProperty("boardId")) {
                appendBoardIdBoolean = true;
                newTask.boardId = request.body.boardId;
            }
            if (request.body.hasOwnProperty("taskName")) {
                newTask.taskName = request.body.taskName;
            }
            if (request.body.hasOwnProperty("archived")) {
                newTask.archived = request.body.archived;
            }
        }
    } 

    /*
    if the boardId is changed we need to modify the 
    tasks array in the board objects 
    */   
    if (appendBoardIdBoolean) {
        let oldBoardId = request.params.bid;
        let taskId = request.params.tid;
        for (board of boards) {
            if (board.tasks.includes(taskId)) {
                let dropBoard = getData(boards, request.body.boardId);
                let index = board.tasks.indexOf(taskId);
                board.tasks.splice(index, 1);
                dropBoard.tasks.push(taskId);
            }
            //console.log(board.tasks)
        }
        //console.log("\n")
    }
    response.status(200).send(newTask);
});

/**
 * Starts the server
 */
app.listen(port, () => {
    console.log(`Event app listening on port: ${port}`);
});