let highScoreTet = localStorage.getItem("highScoreTetris") || 0;
let highNameTet = localStorage.getItem("highNameTetris") || "Make your record!!";
let scoreB = document.getElementById("highestScore");


function updateSBoard() {
    scoreB.innerHTML - '';
    const displayTitle = document.createElement("h2");
    displayTitle.innerText = "Highest Score";

    const records= document.createElement("div");

    const highscoreText = highNameTet +' | ' + highScoreTet;
    records.innerText = highscoreText;

    const enterNameDiv = document.createElement("div");
    enterNameDiv.id = "enterNameDiv";

    scoreB.appendChild(displayTitle);
    scoreB.appendChild(records);
    scoreB.appendChild(enterNameDiv);
}

function setHighScore(highPName){
    /*
    highValue = {
        highScore: score,
        highName: highPName,
        highDate: new Date()
    }

    localStorage.setItem("highTet", highValue);

    local storage cannnot set a variable as a dictionary i guess. this does not work :/

    */
    localStorage.setItem("highScoreTetris", score);
    localStorage.setItem("highNameTetris", highPName);
}

function addNameEnterDiv(){
    const enterNameDiv = document.getElementById("enterNameDiv");

    const nameBox = document.createElement("input");
    nameBox.type = "text";
    nameBox.classList.add("NText");
    nameBox.placeholder = "Enter Your Name";
    nameBox.id = "highName";

    enterNameDiv.appendChild(nameBox);

    const addNameBut = document.createElement("button");
    addNameBut.innerText = "Set";
    addNameBut.classList.add("NBut");
    addNameBut.addEventListener("click", setHighName);

    enterNameDiv.appendChild(addNameBut);
}

function setHighName() {
    const highPName = document.getElementById("highName").value;
    if (highPName.length < 1){
        alert("enter your name first!");
    } else {
        setHighScore(highPName);
        alert("Your Score has been Recoreded!");
        document.getElementById("enterNameDiv").innerHTML = '';
        enteringName = false;
        resetGame();
        updateSBoard();
    }
}