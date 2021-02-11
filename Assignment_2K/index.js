let mainTag = document.getElementsByTagName("main");
let Inputs = document.getElementsByClassName("Input");

function loadAllCards(){
    /**
     * Backend stuff finish later
     */
    let url = "https://veff-boards-h1.herokuapp.com/api/v1/boards";

    axios.get(url)
    .then((response) => {
        // for (board of response.data) {
        //     console.log(board.name);
        // }
    }).catch((error) => {console.log("ERROR MY GUY", error)});
}

function insertCard(){
    
    //To prevent reloading the page
    return false;
}
function insertTask(){
    return false;
}

function createCard() {
    let divTag = document.createElement("div");
    let deleteBtn = document.createElement("div");
    let titleTag = document.createElement("p");
    let taskForm = document.createElement("form");
    let taskInput = document.createElement("input");

    divTag.setAttribute("class", "card");
    deleteBtn.setAttribute("class", "Ex");
    titleTag.setAttribute("class", "title");
    taskForm.setAttribute("onsubmit", "return insertTask();");
    taskForm.setAttribute("autocomplete", "off");
    taskForm.setAttribute("method", "GET");
    taskInput.setAttribute("type", "text");
    taskInput.setAttribute("class","Input taskInput");
    taskInput.setAttribute("name","taskInput");
    taskInput.style.marginLeft = "0"
    taskInput.setAttribute("placeholder","Create new task");
    titleTag.innerText = Inputs[0].value;
    Inputs[0].value = "";
    divTag.appendChild(deleteBtn);
    divTag.appendChild(titleTag);
    divTag.appendChild(taskForm);
    taskForm.appendChild(taskInput);
    mainTag[0].appendChild(divTag);

    executeEventListeners([Inputs[0], taskInput], divTag);

    //To prevent reloading the page
    return false;
}

function executeEventListeners(elementList, parentElement) {
    elementList.forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && elem.classList.contains("taskInput")) {
                let deleteBtn = document.createElement("div");
                let taskDiv = document.createElement("div");
                let taskParagraph = document.createElement("p");

                taskDiv.setAttribute("class", "task");
                deleteBtn.setAttribute("class", "Ex");
                taskParagraph.innerText = event.target.value;
                taskParagraph.style = "width: 80%;";
                
                taskDiv.appendChild(taskParagraph);
                taskDiv.appendChild(deleteBtn);
                parentElement.appendChild(taskDiv);
                event.target.value = "";
            }
        });
    })
}

