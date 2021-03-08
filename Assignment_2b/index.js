// ************* A LINK FOR A CHOOSEN GROUP OF BOARDS ************* //
let link = "https://veff-boards-h3.herokuapp.com/api/v1/boards/";

// The frame that will contain each board(in main)
let boardBox = document.getElementById("boardFrame");

// The input, to create the board
let boardInput = document.getElementById("createBoard");

boardInput.addEventListener("submit", (event) => {
    event.preventDefault();
    // evemt.target -> form[upper text, input,lower text]
    createBoard(event.target.children[1], false);
    event.target.children[1].value = "";
});

// ****** GET BOARDS ****** //

axios.get(link)
    .then(response => {
        for (board of response.data) {
            createBoard(board, true);
            getTask(board.id);
        }
    })
    .catch(error => {
        console.log(error);
    })

// ******************  FUNCTIONS  ****************** //


// ******** DRAGING FUNCTIONS ******** //

function drop(event) {
    event.preventDefault();
    var data = event.target;
    data.appendChild(document.getElementById(data));
}

function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}


// ******** CREATE FUNCTIONS ******** //

function createBoard(boardObject, isFromDatabase) {
    // BOARD ELEMENT
    let board = document.createElement("div");
    board.setAttribute("class", "board");

    board.addEventListener("dragover", (event) => {
        event.preventDefault();
        let movedElement = document.querySelector(".movedElement");
        board.appendChild(movedElement);
    })

    // DELETE BOTTON
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");

    deleteButton.addEventListener("click", (event) => {

        deleteBoard(event.target.parentElement);
        event.preventDefault();
    });

    board.append(deleteButton);

    // TEXT PARAGRAPH
    let boardText = document.createElement("p");

    // FROM DATABASE
    if (isFromDatabase) {
        board.setAttribute("id", boardObject.id);
        boardText.innerHTML = boardObject.name;
    }
    // FROM CLIENT 
    else {
        boardText.innerHTML = boardObject.value;
        postBoard(boardObject, board);
    }

    board.append(boardText);

    let taskInput = document.createElement("form");

    taskInput.setAttribute("class", "taskForm");

    let theInput = document.createElement("input");
    theInput.setAttribute("class", "taskInput");
    theInput.setAttribute("placeholder", "Create a task");
    theInput.setAttribute("type", "text");

    taskInput.append(theInput);

    taskInput.addEventListener("submit", (event) => {
        event.preventDefault();
        let task = createTask(event.target.children[0], false, board.id);
        board.append(task);
        event.target.children[0].value = "";
    });

    board.append(taskInput);
    boardBox.append(board);
}

function createTask(taskInput, isFromDatabase, boardId) {
    let taskFrame = document.createElement("div");
    taskFrame.setAttribute("class", "taskFrame");
    taskFrame.setAttribute("id", taskInput.id);
    taskFrame.setAttribute("draggable", "true");

    taskFrame.addEventListener("dragstart", (event) => {
        taskFrame.classList.add("movedElement"); // adding a class "dragableElement" into the taskFrame element
        boardIdFrom = event.target.parentElement.id;
    })

    taskFrame.addEventListener("dragend", (event) => {
        taskFrame.classList.remove("movedElement");

        patch(boardIdFrom, event.target.id, event.target.parentElement.id);
    })

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "deleteButton");

    deleteButton.addEventListener("click", (event) => {
        deleteTask(event.target.parentElement.parentElement, taskFrame);
    });

    let taskText = document.createElement("p");
    taskText.setAttribute("class", "taskInputText");

    // FROM CLIENT
    if (!isFromDatabase) {
        taskText.innerHTML = taskInput.value;
        taskFrame.appendChild(taskText);
        taskFrame.append(deleteButton);
        postTask(taskInput, boardId, taskFrame);
        return taskFrame;
    }
    // FROM DATABASE
    else {
        let boardList = document.getElementById("boardFrame").childNodes;
        for (var i = 0; i < boardList.length; i++) {
            if (boardList[i].id == boardId) {
                taskText.innerHTML = taskInput.taskName;
                taskFrame.appendChild(taskText);
                boardList[i].append(taskFrame);
                taskFrame.append(deleteButton);
                return null;
            }
        }
    }
}


// ******** GET, POST, DELETE and PATCH FUCNTIONS ******** //

function getTask(boardId) {
    axios.get(link + boardId + "/tasks")
        .then(response => {
            for (task of response.data) {
                createTask(task, true, boardId);
            }
        })
        .catch(error => {
            console.log(error);
        })
}

function postBoard(boardObject, boardElement) {

    axios.post(link, {
            name: boardObject.value,
            description: ""
        })
        .then((response) => {
            boardElement.setAttribute("id", response.data.id);
        })
        .catch((error) => console.log(error))
}

function postTask(inputElement, boardId, taskElem) {

    axios.post(link + boardId + '/tasks', {
            taskName: inputElement.value,
        })
        .then((response) => {
            taskElem.setAttribute("id", response.data.id);

        })
        .catch((error) => {
            console.log(error)
        })
}

function deleteBoard(board) {
    axios.delete(link + board.id, {})
        .then((response) => {
            board.remove();
        })
        .catch((error) => {
            // THE ERROR IS EXECUTED WHEN THE BOARD CONTAINS TASKS
            // SO AT FIRST, THE TASKS ARE REMOVED AND THEN THE BOARD IS REMOVED
            for (var i = 0; i < board.childElementCount; i++) {
                if (board.childNodes[i].className == "taskFrame"){
                    deleteTask(board, board.childNodes[i]);
                } 
            }
            deleteBoard(board);
        })
}

function deleteTask(board, task) {
    axios.delete(link + board.id + "/tasks/" + task.id, {})
    .then((response) => {
        task.remove();

    }).catch((error) => {
        console.log(error)
    });
}

function patch(boardId, taskId, newBoardId) {
    axios.patch(link + boardId + "/tasks/" + taskId, {
            boardId: newBoardId,
        })
        .then((response) => {
        })
        .catch((error) => {
            console.log(error);
        })
}