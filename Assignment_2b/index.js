// form becomes a html element that can be appended a event listener
let boardForm = document.getElementById("createBoard");


boardForm.addEventListener("submit", (event) =>{ 

    // event.target is the one who commited the event
    // evemt.target -> form[upper text, input,lower text]
    createBoard(event.target.children[1].value);

    // prevents the page from reloading
    event.preventDefault();
    
});


                                
// The box that holds all of the cards
// by getting elemts by id we have them as objects(not as a list)

// boardBox is the frame that will contain each board(in main)
let boardBox = document.getElementById("boardFrame");



function createBoard(inputText) {
    // board element
    let board = document.createElement("div");
    board.setAttribute("class","board");

    // Delete button
    let deleteButton = document.createElement("div");
    deleteButton.setAttribute("class","deleteButton");
    
    deleteButton.addEventListener("submit", (event) =>{ 

        //console.log(event.target);

        //boardBox.remove(event);

    });

    board.append(deleteButton);

    // <p> inputText </p>
    let boardText = document.createElement("p");
    boardText.innerHTML = inputText;

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

        board.append(createTask(event.target.children[0].value));

        event.preventDefault();
    });

    


    board.append(taskInput);

    // Add the card to the card box
    boardBox.append(board);

}



function createTask(nameOfTask){
    let taskFrame = document.createElement("div");
    taskFrame.setAttribute("id","taskFrame");
    

    let taskText = document.createElement("p");
    taskText.setAttribute("class","task");
    taskText.innerHTML = nameOfTask;

    taskFrame.appendChild(taskText);

    return taskFrame;

}


    






