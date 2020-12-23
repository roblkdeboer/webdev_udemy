// Possible button colours
var buttonColours = ["red", "blue", "green", "yellow"];

// Set empty arrays to keep track of the user clicks and what the game pattern clicks too
var gamePattern = [];
var userClickedPattern = [];

// Set initial state of the game
var started = false;
var level = 0;

// Detect when any key press is made to start the gameif the game isn't started
// If not started, it will display the current level 0 and change the state to started
$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// When one of the four coloured buttons is clicked
$(".btn").click(function() {

  // Take the ID of the clicked button and set is as the clicked colour and append it to the clicked pattern array
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  // Play sound assigned to the colour and highlight the clicked box
  playSound(userChosenColour);
  animatePress(userChosenColour);

  // Checks to see if the the sequence entered is correct using the index of the last answer (length-1 = index)
  checkAnswer(userClickedPattern.length-1);
});


function checkAnswer(currentLevel) {

    // If the pattern clicked is the same as the current level's pattern
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      // If the length of the answer is the same as the length of the level's pattern
      if (userClickedPattern.length === gamePattern.length){
        // Start the next level in 1000ms
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      // If wrong, the sound for wrong is played, the page styling is changed to game-over class and the level title header is changed
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");
      
      // Also removes the game over class after 200ms
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      startOver();
    }
}

// To initiate the next sequence/level
function nextSequence() {
  // Increase the level and reset the clicked pattern array
  userClickedPattern = [];
  level++;
  // Change the title to the current level
  $("#level-title").text("Level " + level);
  // Random number generator to select the new colour
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Select the newly selected colour to highlight it
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

// Animate the colour when clicked on with a pressed styling
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Play sound associated with the colour
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
