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


    divTag.appendChild(deleteBtn);
    divTag.appendChild(titleTag);
    divTag.appendChild(taskForm);
    taskForm.appendChild(taskInput);
    mainTag[0].appendChild(divTag);

    executeEventListeners([Inputs[0], taskInput]);
    //To prevent reloading the page
    return false;
}

function createTask(){
    console.log("You just created a task")
}

function executeEventListeners(elementList) {
    /**
     * If user creates board and then creates a task and creates 
     * a board again, everything will flop, fix this!
     */
    elementList.forEach((elem) => {
        elem.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                console.log("enter presssed");
                if(elem.classList.contains("taskInput")) {
                    createTask();
                }
                elem.value = "";
            }
        });
    })
}

