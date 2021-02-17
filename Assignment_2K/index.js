let URL = "https://veff-boards-h2.herokuapp.com/api/v1/boards/";
let mainTag = document.getElementsByTagName("main");
let Inputs = document.getElementsByClassName("Input");

function loadAllBoards(){
    axios.get(URL)
    .then((response) => {
        //console.log(response)
        for (board of response.data) {
            createCard(board, true);
            getTasks(board.id);
        }
    }).catch((error) => {console.log("ERROR! from getting the boards.", error)});
}

function getTasks(boardId) {
    axios.get(`${URL}${boardId}/tasks`)
    .then((response) => {
        //console.log(response, "\n\n");
        for (task of response.data) {
            createTask(task, true);
        }
    }).catch((error) => {console.log("ERROR! from getting the tasks.", error)});
}

function postBoard(boardName, boardTag) {
    axios.post(URL,
        {
            name: boardName,
            description: ""
        }
    ).then((response) => {
        boardTag.setAttribute("id", `${response.data.id}`);
    }).catch((error) => {console.log("ERROR! from posting boards.", error)})
}

function postTask(boardId, taskValue, taskDiv) {
    axios.post(`${URL}${boardId}/tasks`,
        {
            taskName: taskValue
        }
    ).then((response) => {
        console.log(response.data.id);
        taskDiv.setAttribute("id", `${response.data.id}`);
    }).catch((error) => {console.log("ERROR! from posting tasks.", error)})
}

function deleteBoard(board) {
    board.style.display = "none";
    axios.delete(`${URL}${board.id}`,
        {}
    ).then((response) => {
        //console.log(response);
    }).catch((error) => {console.log("ERROR! from posting tasks.", error)});
}

function deleteTask(task, boardId, taskId) {
    task.style.display = "none";
    axios.delete(`${URL}${boardId}/tasks/${taskId}`,
        {}
    ).then((response) => {
        //console.log(response);
    }).catch((error) => {console.log("ERROR! from deleting task", error)});
}

function patchTask(fromBoardId, draggableTaskId, toBoardId) {
    axios.patch(`${URL}${fromBoardId}/tasks/${draggableTaskId}`,
        {
            boardId: toBoardId
        }
    ).then((response) => {
        console.log(response);
    }).catch((error) => {console.log("ERROR! from patching draggable task", error)});
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];
    return draggableElements.reduce((closestElem, childElem) => {
        const box = childElem.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closestElem.offset) return {offset: offset, element: childElem};
        else return closestElem;
    }, {offset: Number.NEGATIVE_INFINITY }).element;
}

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
    taskInput.style.marginLeft = "0"
    taskInput.setAttribute("placeholder","Create new task");
    if (fromBackend) {
        divTag.setAttribute("id", `${inputElem.id}`) //where inputElem is the board
        titleTag.innerText = inputElem.name
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

    executeEventListener([Inputs[0], taskInput]);

    //To prevent reloading the page
    return false;
}

function createTask(task, loadFromBacked) {
    let deleteBtn = document.createElement("div");
    let taskDiv = document.createElement("div");
    let taskParagraph = document.createElement("p");

    let fromboardId;
    taskDiv.addEventListener("dragstart", (event) => {
        taskDiv.classList.add("dragging");
        fromboardId = event.target.parentElement.id;
    });
    taskDiv.addEventListener("dragend", (event) => {
        taskDiv.classList.remove("dragging");
        let toBoardId = taskDiv.parentElement.id;
        let taskId = taskDiv.id;
        patchTask(fromboardId, taskId, toBoardId);
    });

    //console.log(taskDiv); //here 2

    deleteBtn.addEventListener("click", (event) => {
        let boardId = event.target.parentElement.parentElement.id;
        let taskId = event.target.parentElement.id;
        deleteTask(event.target.parentElement, boardId, taskId);
    });

    taskDiv.setAttribute("class", "task");
    deleteBtn.setAttribute("class", "Ex");

    taskParagraph.style = "width: 80%;";
    taskDiv.appendChild(taskParagraph);
    taskDiv.appendChild(deleteBtn);

    
    if (loadFromBacked){
        taskDiv.setAttribute("id", `${task.id}`);
        let mainTag = document.getElementsByTagName("main")[0];
        mainTag.childNodes.forEach((board) => {
            if (board.id == task.boardId) {
                taskParagraph.innerText = task.taskName;
                board.appendChild(taskDiv);
                event.target.value = "";
            }
        });
    }
    else {
        let board = task.parentNode.parentNode;
        postTask(board.id, task.value, taskDiv);
        taskParagraph.innerText = task.value;
        board.appendChild(taskDiv);
        event.target.value = "";
    }  
}

function executeEventListener(elementList) {
    let deleteBtn = document.getElementsByClassName("Ex");

    elementList.forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && elem.classList.contains("taskInput")) {
                createTask(event.target, false);
            }
        });
    });
    
    Array.prototype.slice.call(deleteBtn).forEach((button) => {
        button.addEventListener("click", (event) => {
            let board = event.target.parentElement;
            if (!board.innerHTML.includes("class=\"task\"")) deleteBoard(board);
        });
    });
}

