function dicegame() {
    var randomNumber1 = Math.floor(Math.random() * 6) + 1;
    var randomNumber2 = Math.floor(Math.random() * 6) + 1;

    document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
    document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

    if(randomNumber1> randomNumber2){
        document.querySelector(".winner-header").textContent = "🚩 Player 1 wins";
    }
    else if (randomNumber1 < randomNumber2){
        document.querySelector(".winner-header").textContent = "Player 2 wins 🚩";
    
    }
    else{
        document.querySelector(".winner-header").textContent = "❌ Draw ❌";
    }
}

dicegame();