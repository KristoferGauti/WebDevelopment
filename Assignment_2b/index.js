// The input, to create the board
let boardForm = document.getElementById("createBoard");
// The frame that will contain each board(in main)
let boardBox = document.getElementById("boardFrame");

let link = "https://veff-boards-h3.herokuapp.com/api/v1/boards/";

boardForm.addEventListener("submit", (event) =>{ 
    // evemt.target -> form[upper text, input,lower text]
    createBoard(event.target.children[1].value, false);
    event.preventDefault();  
});

// Getting the boards containing tasks
axios.get(link)
    .then(response => {
        for (board of response.data){
            createBoard(board, true);
            getTask(board.id);
    }
    })
    .catch(error => {
        console.log(error);
    })

// ******************  FUNCTIONS  ****************** //

function drop(event,boardId){
    event.preventDefault();
    var data = event.dataTransfer.getData(boardId);
    event.target.appendChild(document.getElementById(data));
}

function drag(event){
    event.dataTransfer.setData("id",event.target.id);
}

function allowDrop(event){
    event.preventDefault();
}



function createBoard(boardObject, isFromDatabase) {
    // board element
    let board = document.createElement("div");
    board.setAttribute("class","board");
    board.setAttribute("id",boardObject.id);
    //board.setAttribute("ondrop",drop(event,board.id));
    //board.setAttribute("ondragover",allowDrop(event));


    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class","deleteButton");
    
    deleteButton.addEventListener("click", (event) =>{ 
        deleteBoard(event.target.parentElement);
    });

    board.append(deleteButton);

    // <p> inputText </p>
    let boardText = document.createElement("p");

    if (isFromDatabase) boardText.innerHTML = boardObject.name;
    else{   
        boardText.innerHTML = boardObject;
        postBoard(boardObject);} 

    board.append(boardText);

    // <form> id="createTask"> </form>
    let taskInput = document.createElement("form"); // create element of type input
    //taskInput.setAttribute("autocomplete", "off");
    taskInput.setAttribute("id","taskForm");

    // <input id="inputText" placeholder="Create a task" type="text"> </input>
    let theInput = document.createElement("input");
    theInput.setAttribute("id","taskInput"); // call the input as a class
    theInput.setAttribute("placeholder","Create a task");
    theInput.setAttribute("type","text");

    //<form> 
    // <input> </input>
    //</form>
    taskInput.append(theInput);

    taskInput.addEventListener("submit", (event) =>{ 
        let task = createTask(event.target.children[0],false,board.id);
        board.append(task);
        event.preventDefault();
    });

    board.append(taskInput);
    boardBox.append(board);
}

function createTask(taskObject, isFromDatabase, boardId){
    let taskFrame = document.createElement("div");
    taskFrame.setAttribute("class","taskFrame");
    taskFrame.setAttribute("id",taskObject.id);
    taskFrame.setAttribute("draggable", "true");
    //taskFrame.setAttribute("ondragstart",drag(event));

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class","deleteButton");

    deleteButton.addEventListener("click", (event) =>{ 
        deleteTask(event.target.parentElement.parentElement.id, taskObject.id);

    });

    

    let taskText = document.createElement("p");
    taskText.setAttribute("class","task");

    // FROM CLIENT
    if (!isFromDatabase){ 
        taskText.innerHTML = taskObject.value;
        taskFrame.appendChild(taskText);
        taskFrame.append(deleteButton);
        postTask(taskObject,boardId);

        return taskFrame;  
    }
    // FROM DATABASE
    else{
        let boardList = document.getElementById("boardFrame").childNodes;
        for (var i=0; i< boardList.length; i++){
            if (boardList[i].id == boardId) {
                taskText.innerHTML = taskObject.taskName;
                taskFrame.appendChild(taskText);
                boardList[i].append(taskFrame);
                taskFrame.append(deleteButton);
                return null;
            }
        } 
    }
}

function postBoard(boardDescription){

    axios.post(link, {
        name: boardDescription,
        description: ""
    })
    .then((response)=>{
        console.log("Board Created");
    })
    .catch((error) => console.log(error))
}

function deleteBoard(board){
    console.log(board.id);
    axios.delete(link + board.id, {})
    .then((response)=>{
        console.log("Deleating board works");
    })
    .catch((error)=>{console.log(error)})
}

function deleteTask(boardId, taskId){
    axios.delete(link + boardId + "/tasks/" + taskId,
        {}
    ).then((response) => {
        console.log("deleting task successful");
    }).catch((error) => {console.log(error)});
}

function postTask(taskObject, boardId){
    console.log(taskObject.value);
    axios.post(link + boardId + '/tasks', {
        taskName: taskObject.value
    })
    .then((response) =>{
        taskObject.setAttribute("id",response.data.id);
    })
    .catch((error)=>{console.log(error)})


}

function getTask(boardId){
    axios.get(link + boardId + "/tasks")
    .then(response => {
        for (task of response.data){
            createTask(task,true,boardId);
        }
    })
    .catch(error => {
        console.log(error);
    })
}

//function patch

