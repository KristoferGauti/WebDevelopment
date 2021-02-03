// The form needs a event listener to listen for a submit and prevent the page to restart
let form = document.getElementsByTagName("form");
form[0].addEventListener("submit", (event) =>{ event.preventDefault();});

// The box that holds all of the cards
let cardBox = document.getElementById("cardFrame");




function gunnar() {
    
    // Create a card
    let card = document.createElement("div");
    card.setAttribute("class","card");
    card.innerHTML = "Hello";

    // Add the card to the card box
    cardBox.append(card);
    
}






