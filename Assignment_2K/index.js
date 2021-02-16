let mainTag = document.getElementsByTagName("main");
let Inputs = document.getElementsByClassName("Input");
let boardIdList = [];

function loadAllBoards(){
    let boardUrl = "https://veff-boards-h3.herokuapp.com/api/v1/boards";
    

    axios.get(boardUrl)
    .then((response) => {
        console.log(response)
        for (board of response.data) {
            boardIdList.push(board.id);
            createCard(board, true);
        }
        getTasks(response);
    }).catch((error) => {console.log("ERROR! from getting the boards.", error)});
}

function getTasks(boardResponse) {
    let taskUrl = `https://veff-boards-h3.herokuapp.com/api/v1/boards/${board.id}/tasks`;
    axios.get(taskUrl)
    .then((response) => {
        console.log(response, "\n\n");
        let divTag = document.getElementsByClassName("card")[0];
        for (task of response.data) {
            createTask(task, divTag, boardResponse, response);
        }
    }).catch((error) => {console.log("ERROR! from getting the tasks.", error)});
}

function createCard(inputElem, fromBackend) {
    let divTag = document.createElement("div");
    let deleteBtn = document.createElement("div");
    let titleTag = document.createElement("p");
    let taskForm = document.createElement("form");
    let taskInput = document.createElement("input");

    divTag.setAttribute("class", "card");
    divTag.setAttribute("id", `${boardIdList[boardIdList.length - 1]}`)
    deleteBtn.setAttribute("class", "Ex");
    titleTag.setAttribute("class", "title");
    taskForm.setAttribute("onsubmit", "return false;");
    taskForm.setAttribute("autocomplete", "off");
    taskForm.setAttribute("method", "GET");
    taskInput.setAttribute("type", "text");
    taskInput.setAttribute("class","Input taskInput");
    taskInput.setAttribute("name","taskInput");
    taskInput.style.marginLeft = "0"
    taskInput.setAttribute("placeholder","Create new task");
    if (fromBackend) titleTag.innerText = inputElem.name;
    else titleTag.innerText = inputElem.value;
    Inputs[0].value = "";

    divTag.appendChild(deleteBtn);
    divTag.appendChild(titleTag);
    divTag.appendChild(taskForm);
    taskForm.appendChild(taskInput);
    mainTag[0].appendChild(divTag);

    executeEventListener([Inputs[0], taskInput], divTag);

    //To prevent reloading the page
    return false;
}

function createTask(task, parentElement, boardResponse, taskResponse) {
    let deleteBtn = document.createElement("div");
    let taskDiv = document.createElement("div");
    let taskParagraph = document.createElement("p");

    taskDiv.setAttribute("class", "task");
    deleteBtn.setAttribute("class", "Ex");

    taskParagraph.style = "width: 80%;";
    taskDiv.appendChild(taskParagraph);
    taskDiv.appendChild(deleteBtn);
    if (!boardResponse) {
        taskParagraph.innerText = task.value;
        parentElement.appendChild(taskDiv);
        event.target.value = "";
    }
    else {
        let mainTag = document.getElementsByTagName("main")[0];
        mainTag.childNodes.forEach((board) => {
            if (board.id == task.id) {
                taskParagraph.innerText = task.taskName;
                board.appendChild(taskDiv);
                event.target.value = "";
            }
        });
    }
    
}

function executeEventListener(elementList, parentElement) {
    elementList.forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && elem.classList.contains("taskInput")) {
                createTask(event.target, parentElement, null);
            }
        });
    })
}

