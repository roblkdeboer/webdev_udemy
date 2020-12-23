// Detecting clicking

// querySelectorAll to find the length of the list of all elements with the drum class
// For loop to go through i until all elements of the drum class have an event listener added
for (var i = 0; i < document.querySelectorAll(".drum").length; i++) {
    document
        .querySelectorAll(".drum")
    [i].addEventListener("click", clickSound);
}

function clickSound() {
    var buttoninnerHTML = this.innerHTML;
    // Send the innerHTML of the element that was clicked to the makeSound function
    makeSound(buttoninnerHTML);
    buttonAnimation(buttoninnerHTML);
}

// Detecting keyboard presses

document.addEventListener("keydown", function (event) {
    // Send the key pressed to the makeSound function
    makeSound(event.key);
    buttonAnimation(event.key);
});

// Decides wahat sound to play based on the input

function makeSound(key) {
    switch (key) {
        case "w":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();
            break;

        case "a":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();
            break;

        case "s":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();
            break;

        case "d":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();
            break;

        case "j":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();
            break;

        case "k":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();
            break;

        case "l":
            var kick = new Audio("sounds/kick-bass.mp3");
            kick.play();
            break;

        default:
            console.log(buttoninnerHTML);
            break;
    }
}

function buttonAnimation(currentKey) {

    var activeButton = document.querySelector("." + currentKey)
    activeButton.classList.add("pressed");
    
    setTimeout(function() {
        activeButton.classList.remove("pressed");
    }, 100)

}