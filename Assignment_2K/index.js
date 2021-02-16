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
    let taskUrl = `${URL}${boardId}/tasks`;
    axios.get(taskUrl)
    .then((response) => {
        console.log(response, "\n\n");
        for (task of response.data) {
            createTask(task, true);
        }
    }).catch((error) => {console.log("ERROR! from getting the tasks.", error)});
}

function postBoard(boardName) {
    axios.post(`${URL}`,
        {
            name: boardName,
            description: ""
        }
    ).then((response) => {
        //console.log(response);
    }).catch((error) => {console.log("ERROR! from posting boards.", error)})
}

function postTask(boardId, name) {
    axios.post(`${URL}${boardId}/tasks`,
        {
            taskName: name
        }
    ).then((response) => {
        //console.log(response);
    }).catch((error) => {console.log("ERROR! from posting tasks.", error)})
}

function deleteBoard(board) {
    board.style.visibility = "hidden";
    //console.log(board);

    axios.delete(`${URL}${board.id}`,
        {

        }
    ).then((response) => {
        console.log(response);
    }).catch((error) => {console.log("ERROR! from posting tasks.", error)});
}

function createCard(inputElem, fromBackend) {
    let divTag = document.createElement("div");
    let deleteBtn = document.createElement("div");
    let titleTag = document.createElement("p");
    let taskForm = document.createElement("form");
    let taskInput = document.createElement("input");

    divTag.setAttribute("class", "card");
    divTag.setAttribute("id", `${board.id}`)
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
    if (fromBackend) titleTag.innerText = inputElem.name;
    else {
        postBoard(inputElem.value);
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

    taskDiv.setAttribute("class", "task");
    deleteBtn.setAttribute("class", "Ex");

    taskParagraph.style = "width: 80%;";
    taskDiv.appendChild(taskParagraph);
    taskDiv.appendChild(deleteBtn);

    if (loadFromBacked){
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
        postTask(board.id, task.value);
        taskParagraph.innerText = task.value;
        board.appendChild(taskDiv);
        event.target.value = "";
    }  
}

function executeEventListener(elementList) {
    let deleteBtn = document.getElementsByClassName("Ex");
    let boardItemCounter = 0;
    elementList.forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && elem.classList.contains("taskInput")) {
                createTask(event.target, false);
            }
        });
    });
    
    Array.prototype.slice.call(deleteBtn).forEach((button) => {
        divTask = document.createElement("div").setAttribute("class","task");
        button.addEventListener("click", (event) => {
            boardItemCounter += 1;
            if (boardItemCounter == 1) {
                deleteBoard(event.target.parentElement);
            }
        });
    });
    
}

