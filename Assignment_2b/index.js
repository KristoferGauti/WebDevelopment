// The input, to create the board
let boardForm = document.getElementById("createBoard");
// The frame that will contain each board(in main)
let boardBox = document.getElementById("boardFrame");

boardForm.addEventListener("submit", (event) =>{ 
    // evemt.target -> form[upper text, input,lower text]
    createBoard(event.target.children[1].value, false);
    event.preventDefault();  
});

// Getting the boards via tasks
axios.get("https://veff-boards-h5.herokuapp.com/api/v1/boards")
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


function createBoard(boardObject, isFromDatabase) {
    // board element
    let board = document.createElement("div");
    board.setAttribute("class","board");
    board.setAttribute("id",boardObject.id);

    // Delete button
    let deleteButton = document.createElement("div");
    deleteButton.setAttribute("class","deleteButton");
    
    deleteButton.addEventListener("submit", (event) =>{ 

    });

    board.append(deleteButton);

    // <p> inputText </p>
    let boardText = document.createElement("p");

    if (isFromDatabase) boardText.innerHTML = boardObject.name;
    else boardText.innerHTML = boardObject;

    board.append(boardText);

    // <form> id="createTask"> </form>
    let taskInput = document.createElement("form"); // create element of type input
    taskInput.setAttribute("id","taskForm");

    // <input id="inputText" placeholder="Create a task" type="text"> </input>
    let theInput = document.createElement("input");
    theInput.setAttribute("id","inputText"); // call the input as a class
    theInput.setAttribute("placeholder","Create a task");
    theInput.setAttribute("type","text");

    //<form> 
    // <input> </input>
    //</form>
    taskInput.append(theInput);

    taskInput.addEventListener("submit", (event) =>{ 
        let task = createTask(event.target.children[0],false,null)
        board.append(task);
    });

    board.append(taskInput);
    boardBox.append(board);
}



function createTask(taskObject, isFromDatabase, boardId){
    let taskFrame = document.createElement("div");
    taskFrame.setAttribute("class","taskFrame");

    let deleteButton = document.createElement("div");
    deleteButton.setAttribute("class","deleteButton");

    

    let taskText = document.createElement("p");
    taskText.setAttribute("class","task");

    // FROM CLIENT
    if (!isFromDatabase){ 
        taskText.innerHTML = taskObject.value;
        taskFrame.appendChild(taskText);
        taskFrame.append(deleteButton);
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
    
function getTask(boardId){
    axios.get("https://veff-boards-h5.herokuapp.com/api/v1/boards/" + boardId + "/tasks")
    .then(response => {
        for (task of response.data){
            createTask(task,true,boardId);
        }
    })
    .catch(error => {
        console.log(error);
    })
}
