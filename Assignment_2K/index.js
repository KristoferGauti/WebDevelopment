let mainTag = document.getElementsByTagName("main");
let formTag = document.getElementsByClassName("theForm");
let data = new URLSearchParams();

function getFormData(){
    // (A) get form
    
    
    // // (B) AJAX
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", "boards.html" + data.toString());
    // // What to do when server responds
    // xhr.onload = function(){ console.log(this.response); };
    // xhr.send();
    

    // (C) PREVENT HTML FORM SUBMIT
    
}

function insertCard(){
    data.append("boardInput", document.getElementById("boardInput").value);

    let divTag = document.createElement("DIV");
    let titleTag = document.createElement("P");
    titleTag.setAttribute("class", "title")
    divTag.setAttribute("class", "card");
    for (let inputDataList of data) {
        if (inputDataList[1] != "") {
            titleTag.innerHTML = inputDataList[1];
            divTag.appendChild(titleTag);
            mainTag[0].appendChild(divTag);
        }
    }
    
    //To prevent reloading the page
    return false;
}

function executeEventListeners() {
    
}

executeEventListeners()