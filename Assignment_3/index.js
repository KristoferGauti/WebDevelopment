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
    { 
        "id": '0',
        "name": "Planned", 
        "description": "Everything that's on the todo list.", 
        "tasks": ["0","1","2"] 
    },
    { 
        "id": '1', 
        "name": "Ongoing", 
        "description": "Currently in progress.", 
        "tasks": [] 
    },
    { 
        "id": '3', 
        "name": "Done", 
        "description": "Completed tasks.", 
        "tasks": ["3"] 
    }
];

var tasks = [
    { 
        "id": '0', 
        "boardId": '0', 
        "taskName": "Another task", 
        "dateCreated": new Date().toISOString(), 
        "archived": false 
    },
    { 
        "id": '1', 
        "boardId": '0', 
        "taskName": "Prepare exam draft", 
        "dateCreated": new Date().toISOString(), 
        "archived": false 
    },
    {
        "id": '2', 
        "boardId": '0', 
        "taskName": "Discuss exam organisation", 
        "dateCreated": new Date().toISOString(),
        "archived": false 
    },
    { 
        "id": '3', 
        "boardId": '3', 
        "taskName": "Prepare assignment 2", 
        "dateCreated": new Date().toISOString(), 
        "archived": true 
    }
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

function validTaskRequest(request){
    if (request.body.hasOwnProperty("taskName")) 
        if ((typeof request.body.taskName !== "string")) return false;
    if (request.body.hasOwnProperty("archived"))
        if (typeof request.body.archived !== "boolean") return false;
    if (request.body.hasOwnProperty("boardId"))
        if (typeof request.body.boardId !== "string") return false;
    
    if (Object.keys(request.body).length == 0) return false;

    return true;
}

function validBoardRequest(request){
    if (request.body.hasOwnProperty("name")) 
    {
        if ((typeof request.body.name !== 'string') ||
            (request.body.name == ""))
            return false;
    }
    if (request.body.hasOwnProperty("description"))
    {
        if (typeof request.body.description !== 'string') return false;
    }
    if (Object.keys(request.body).length == 0) return false;
    return true;
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
    let taskIds = [];
    for (board of boards) {
        taskIds.push(board.tasks);
        delete board["tasks"];
    }

    response.status(200).send(boards);

    for (let i = 0; i <= boards.length-1; i++) {
        boards[i]["tasks"] = taskIds[i]
    }
});

/*
 * Get a board (id)
 */
app.get("/api/v1/boards/:id", (request, response) => {
    let responseBoard = getData(boards, request.params.id);
    if (responseBoard) response.status(200).send(responseBoard);
    else response.status(404).send("Board does not exist");
});

/*
 * Get all tasks from a board (id)
 */
app.get("/api/v1/boards/:id/tasks", (request, response) => {
    if(getData(boards, request.params.id)){
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

        if (request.body.hasOwnProperty("sort")) {
            if (request.body["sort"] == "id")
                responseTasks.sort((task1, task2) => {
                    if (task1.id > task2.id) return 1;
                    else return -1;
                });
            else if (request.body["sort"] == "taskName") {
                responseTasks.sort((task1, task2) => {
                    if (task1.taskName > task2.taskName) return 1;
                    else return -1;
                });
            }
            else {
                responseTasks.sort((task1, task2) => {
                    if (task1.dateCreated > task2.dateCreated) return 1;
                    else return -1;
                });
            }
        }

        response.status(200).send(responseTasks);
    }
    else response.status(404).send("Board does not exist");
});

/*
 *  Load task (tid) to a board (bid)
 */
app.get("/api/v1/boards/:bid/tasks/:tid", (request, response) => {
    bdata = getData(boards, request.params.bid);
    if (bdata){
        let responseTask;
        for (board of boards) {
            if (board.id == request.params.bid) {
                if(board.tasks.includes(request.params.tid)){
                    for (task of tasks) {
                        if (task.id == request.params.tid && 
                            board.tasks.includes(request.params.tid)) {
                            responseTask = task
                        }
                    }
                }
                else response.status(404).send("Task does not exist");
            }
        }
        response.status(200).send(responseTask)
    }
    else response.status(404).send("Board does not exist");
});

/*
 * Create a new task to a board (id)
 */
app.post("/api/v1/boards/:id/tasks", (request, response) => {
    if (validTaskRequest(request)){
        newTaskId = generateId(tasks)
        const responseTask = {
            "id": String(newTaskId), 
            "boardId": String(request.params.id), 
            "taskName": request.body.taskName, 
            "dateCreated": new Date().toISOString(), 
            "archived": false
        }
        tasks.push(responseTask);
        let theBoard = getData(boards, responseTask.boardId)
        theBoard.tasks.push(responseTask.id)
        response.status(201).send(responseTask)
    }
    else response.status(400).send("Invalid attribute value type");
});

/*
 * Create a board, with a generated id
 */
app.post("/api/v1/boards", (request, response) => {
    if (validBoardRequest(request)){
        let newBoardId = generateId(boards);
        const responseBoard = {
            "id": newBoardId, 
            "name": request.body.name, 
            "description": request.body.description, 
            "tasks": [] 
        }
        boards.push(responseBoard);
        response.status(201).send(responseBoard);
    }
    else response.status(400).send("Invalid attribute value type");
});

app.put("/api/v1/boards/:id", (request, response) => {
    if ((Object.keys(request.body).length <= 1) || (!validBoardRequest(request))) 
        response.status(400).send("The request is invalid");
    else if (!boardContainsTasks(request.params.id)) {
        let updatedBoard = getData(boards, request.params.id);
        updatedBoard.name = request.body.name;
        updatedBoard.description = request.body.description;
        response.status(200).send(updatedBoard);
    }
    else response.status(404).send("The tasks, on this board, are not archived");
});

/*
 * Delete a board (id)
 */
app.delete("/api/v1/boards/:id", (request, response) => {
    let responseBoard;
    if (!getData(boards, request.params.id)) {
        response.status(404).send("The board does not exist");
    }
    else if (!boardContainsTasks(request.params.id)) {
        for (let i = 0; i <= boards.length-1; i++) {
            if (boards[i].id == request.params.id) {
                responseBoard = boards[i];
                boards.splice(i, 1);
            }
        }
        response.status(200).send(responseBoard);
    }
    else response.status(404).send("The board contains tasks");
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

app.delete("/api/v1/boards/:bid/tasks/:tid", (request, response) => {
    let deletedTask;
    let sentResponse = false;
    for (board of boards) {
        if (board.id == request.params.bid) {
            for (task of tasks) {
                if (task.id == request.params.tid) {
                    let taskIndex = board.tasks.indexOf(task.id);
                    deletedTask = tasks.splice(taskIndex, 1);
                    board.tasks.splice(taskIndex, 1);
                    response.status(200).send(deletedTask);
                    sentResponse = true;
                    break
                }
            }
            response.status(404).send("Task does not exist");
            sentResponse = true;
            break;
        }
    }
    if (!sentResponse) response.status(404).send("Board does not exist");
    
});

/*
 * Update a task (tid) attributes 
 * taskName, archived and/or boardId on a board (bid)
 */
app.patch("/api/v1/boards/:bid/tasks/:tid", (request,response) => {
    let appendBoardIdBoolean = false;
    let outOfBoundsBoard = false;
    let outOfBoundsTask = false;
    let newTask;

    if (!getData(boards, request.params.bid)) outOfBoundsBoard = true;
    else if (!getData(tasks, request.params.tid)) outOfBoundsTask = true;

    if (validTaskRequest(request) && !outOfBoundsBoard && !outOfBoundsTask){
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].id == request.params.tid) {
                newTask = getData(tasks,tasks[i].id);
                if (request.body.hasOwnProperty("boardId")) {
                    appendBoardIdBoolean = true;
                    newTask.boardId = String(request.body.boardId);
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
            let taskId = request.params.tid;
            for (board of boards) {
                if (board.tasks.includes(taskId)) {
                    let index = board.tasks.indexOf(taskId);
                    board.tasks.splice(index, 1);
                }
            }
            for (board of boards) {
                if (board.id == request.body.boardId) {
                    board.tasks.push(taskId);
                }
            }
        }
        response.status(200).send(newTask);
    }
    else if (outOfBoundsBoard) response.status(404).send("Board does not exist");
    else if (outOfBoundsTask) response.status(404).send("Task does not exist");
    else response.status(400).send("Invalid attribute value type");
});

app.use("*", (request, response) => {
    response.status(405).send("Invalid HTTP request");
})

/**
 * Starts the server
 */
app.listen(port, () => {
    console.log(`Event app listening on port: ${port}`);
});