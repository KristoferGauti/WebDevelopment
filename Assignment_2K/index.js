//The Global variables
let URL = "https://veff-boards-h4.herokuapp.com/api/v1/boards/";
let mainTag = document.getElementsByTagName("main");
let Inputs = document.getElementsByClassName("Input");

/**
 * Uses the axios API to send a http get request and 
 * loads all the boards to the body tag
 */
function loadAllBoards(){
    axios.get(URL)
    .then((response) => {
        for (board of response.data) {
            createCard(board, true);
            getTasks(board.id);
        }

    }).catch((error) => {console.log("ERROR! from getting the boards.", error)});
}
/**
 * Uses axios API to to send a http get request to fetch 
 * all tasks from the database (URL)
 * @param {*} boardId is the id of a given board
 */
function getTasks(boardId) {
    axios.get(`${URL}${boardId}/tasks`)
    .then((response) => {
        for (task of response.data) {
            if (task.archived == false) createTask(task, true, board);
        }
    }).catch((error) => {console.log("ERROR! from getting the tasks.", error)});
}
/**
 * Uses axios API to send a http post request to 
 * post a board to the database (URL). It also sets 
 * the boardTag id attribute to the board id provided from
 * the database
 * @param {*} boardName is the name of the given board 
 * @param {*} boardTag is the element holds the board title and board body
 */
function postBoard(boardName, boardTag) {
    axios.post(URL,
        {
            name: boardName,
            description: ""
        }
    ).then((response) => {
        boardTag.setAttribute("id", `${response.data.id}`);
    }).catch((error) => {console.log("ERROR! from posting boards.", error)});
}
/**
 * Uses axios API to send a http post request to 
 * post a task to the database (URL). It also sets 
 * the taskDiv id attribute to the task id provided from
 * the database
 * @param {*} boardId is the id of a given board
 * @param {*} taskValue is the input value or the task name
 * @param {*} taskDiv is the container which wraps around the taskvalue
 */
function postTask(boardId, taskValue, taskDiv) {
    axios.post(`${URL}${boardId}/tasks`,
        {
            taskName: taskValue
        }
    ).then((response) => {
        taskDiv.setAttribute("id", `${response.data.id}`);
    }).catch((error) => {console.log("ERROR! from posting tasks.", error)});
}

/**
 * Deletes the board from the database and removes 
 * the board div element from the DOM
 * @param {*} board is a div element that represents a board
 */
function deleteBoard(board) {
    axios.delete(`${URL}${board.id}`,
        {}
    ).then(() => {
        board.remove();
    }).catch((error) => {console.log("ERROR! from deleting boards.", error)});
}

/**
 * Deletes the task from the database and removes 
 * the task div element from the DOM
 * @param {*} task is a div container which wraps around a task name
 * @param {*} boardId is the id of a given board
 * @param {*} taskId is the id of a given task
 */
function deleteTask(task, boardId, taskId) {
    axios.patch(`${URL}${boardId}/tasks/${taskId}`,
        {
            archived: true
        }
    ).then(() => {
        task.remove();
    }).catch((error) => {console.log("ERROR! from deleting task", error)});
}

/**
 * Uses axios API to send a patch request to modify/move a given task
 * from a board to another 
 * @param {*} fromBoardId is the board id of that board that the draggable task came from
 * @param {*} draggableTaskId is the task id of that task that is a draggable element
 * @param {*} toBoardId is the board id where the draggable task was dropped into
 */
function patchTask(fromBoardId, draggableTaskId, toBoardId) {
    if (fromBoardId != toBoardId) {
        axios.patch(`${URL}${fromBoardId}/tasks/${draggableTaskId}`,
            {
                boardId: toBoardId
            }
        ).then(() => {
        }).catch((error) => {console.log("ERROR! from patching draggable task", error)});
    }
}

/**
 * Creates a board with the title provided by the user which
 * input a task name in the inputElem. It also sets a dragover 
 * event listener in order for the user to drag tasks
 * @param {*} inputElem is the element in which the user has input a value
 * @param {*} fromBackend is a boolean determining if it must load from the database or not
 */
function createCard(inputElem, fromBackend) {
    let divTag = document.createElement("div");
    let deleteBtn = document.createElement("div");
    let titleTag = document.createElement("p");
    let taskForm = document.createElement("form");
    let taskInput = document.createElement("input");

    divTag.setAttribute("class", "card");
    deleteBtn.setAttribute("class", "Ex");
    titleTag.setAttribute("class", "title");
    taskForm.setAttribute("onsubmit", "return false;");
    taskForm.setAttribute("autocomplete", "off");
    taskForm.setAttribute("method", "POST");
    taskInput.setAttribute("type", "text");
    taskInput.setAttribute("class","Input taskInput");
    taskInput.setAttribute("name","taskInput");
    taskInput.style.marginLeft = "0";
    taskInput.setAttribute("placeholder","Create new task");
    if (fromBackend) {
        divTag.setAttribute("id", `${inputElem.id}`); //where inputElem is the board
        titleTag.innerText = inputElem.name;
    }
    else {
        postBoard(inputElem.value, divTag); // where inputElem is the board div element
        titleTag.innerText = inputElem.value;
    }
    Inputs[0].value = "";

    divTag.appendChild(deleteBtn);
    divTag.appendChild(titleTag);
    divTag.appendChild(taskForm);
    taskForm.appendChild(taskInput);
    mainTag[0].appendChild(divTag);

    divTag.addEventListener("dragover", (event) =>{
        event.preventDefault();
        const draggable = document.querySelector(".dragging");
        divTag.append(draggable);
    });

    deleteBtn.addEventListener("click", (event) => {
        let board = event.target.parentElement;
        if (!board.innerHTML.includes("class=\"task\"")) deleteBoard(board);
    });

    [Inputs[0], taskInput].forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && elem.classList.contains("taskInput")) {
                createTask(event.target, false);
                event.target.value = "";
            }
        });
    });

    //To prevent reloading the page
    return false;
}
/**
 * Creates a task and adds event listeners for the 
 * drag and drop functionality and also for the task delete 
 * functionality. It also loads the tasks from the backend or calls 
 * the post request function to post tasks to the database
 * @param {*} task is the task input element
 * @param {*} loadFromBacked is a boolean to check wether we must load from the database or not
 * @param {*} board is the board div element
 */
function createTask(task, loadFromBacked) {
    let deleteBtn = document.createElement("div");
    let taskDiv = document.createElement("div");
    let taskParagraph = document.createElement("p");

    let fromboardId;
    taskDiv.addEventListener("dragstart", (event) => {
        taskDiv.classList.add("dragging");
        fromboardId = event.target.parentElement.id;
    });
    taskDiv.addEventListener("dragend", () => {
        taskDiv.classList.remove("dragging");
        let toBoardId = taskDiv.parentElement.id;
        let taskId = taskDiv.id;
        patchTask(fromboardId, taskId, toBoardId);
    });

    deleteBtn.addEventListener("click", (event) => {
        let boardId = event.target.parentElement.parentElement.id;
        let taskId = event.target.parentElement.id;
        deleteTask(event.target.parentElement, boardId, taskId);
    });

    taskDiv.setAttribute("class", "task");
    taskDiv.setAttribute("draggable", "true");
    deleteBtn.setAttribute("class", "Ex");

    taskParagraph.style = "width: 80%;";
    taskDiv.appendChild(taskParagraph);
    taskDiv.appendChild(deleteBtn);

    let mainTag = document.getElementsByTagName("main")[0];
    if (loadFromBacked){
        taskDiv.setAttribute("id", `${task.id}`);
        mainTag.childNodes.forEach((board) => {
            if (board.id == task.boardId) {
                taskParagraph.innerText = task.taskName;
                board.appendChild(taskDiv);
            }
        });
    }
    else {
        let board = task.parentNode.parentNode;
        postTask(board.id, task.value, taskDiv);
        taskParagraph.innerText = task.value;
        board.appendChild(taskDiv);
    }  
}