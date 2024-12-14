let x = document.querySelector(".x");
let o = document.querySelector(".o");
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll("#buttons_container button");
let messageContainer = document.querySelector("#message");
let messageText = document.querySelector("#message p");
let secondPlayer;

let playerNameContainer = document.querySelector("#player_names");
let player1Input = document.querySelector("#player1_name");
let player2Input = document.querySelector("#player2_name");
let startGameButton = document.querySelector("#start_game");

let player1Name = "Jogador 1";
let player2Name = "Jogador 2";

let player1 = 0;
let player2 = 0;

function declareWinner(winner) {
    let scoreboardX = document.querySelector("#scoreboard_1");
    let scoreboardY = document.querySelector("#scoreboard_2");
    let msg = "";

    if (winner == "x") {
        scoreboardX.textContent = parseInt(scoreboardX.textContent) + 1;
        msg = `${player1Name} venceu!`;         
        saveGameResult(player1Name, player2Name, player1Name);
    } else if (winner == "o") {
        scoreboardY.textContent = parseInt(scoreboardY.textContent) + 1;
        msg = `${player2Name} venceu!`;
        saveGameResult(player1Name, player2Name, player2Name);
    } else {
        msg = "Deu velhas!";
        saveGameResult(player1Name, player2Name, "Empatess");
    }

    messageText.innerHTML = msg;
    messageContainer.classList.remove("hide");

    setTimeout(() => {
        messageContainer.classList.add("hide");
    }, 2000);

    player1 = 0;
    player2 = 0;

    let boxesToRemove = document.querySelectorAll(".box div");
    for (let i = 0; i < boxesToRemove.length; i++) {
        boxesToRemove[i].parentNode.removeChild(boxesToRemove[i]);
    }
}

startGameButton.addEventListener("click", function () {
    if (player1Input.value.trim() !== "") {
        player1Name = player1Input.value;
        document.querySelector("#x_scoreboard").textContent = player1Name;
    }

    if (player2Input.value.trim() !== "") {
        player2Name = player2Input.value;
        document.querySelector("#o_scoreboard").textContent = player2Name;
    }

    playerNameContainer.classList.add("hide");
    document.querySelector("#container").classList.remove("hide");
});

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        secondPlayer = this.getAttribute("id");

        for (let j = 0; j < buttons.length; j++) {
            buttons[j].style.display = "none";
        }

        playerNameContainer.classList.remove("hide");
    });
}

for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function () {
        let el = checkEl(player1, player2);

        if (this.childNodes.length == 0) {
            let cloneEl = el.cloneNode(true);
            this.appendChild(cloneEl);

            if (player1 == player2) {
                player1++;

                if (secondPlayer == "ai_player") {
                    computerPlay();
                    player2++;
                }
            } else {
                player2++;
            }

            checkWinCondition();
        }
    });
}

function checkEl(player1, player2) {
    return player1 == player2 ? x : o;
}

function checkWinCondition() {
    let b1 = document.getElementById("block_1");
    let b2 = document.getElementById("block_2");
    let b3 = document.getElementById("block_3");
    let b4 = document.getElementById("block_4");
    let b5 = document.getElementById("block_5");
    let b6 = document.getElementById("block_6");
    let b7 = document.getElementById("block_7");
    let b8 = document.getElementById("block_8");
    let b9 = document.getElementById("block_9");

    let conditions = [
        [b1, b2, b3], [b4, b5, b6], [b7, b8, b9],
        [b1, b4, b7], [b2, b5, b8], [b3, b6, b9],
        [b1, b5, b9], [b3, b5, b7]
    ];

    for (let condition of conditions) {
        let [box1, box2, box3] = condition;

        if (
            box1.childNodes.length > 0 &&
            box2.childNodes.length > 0 &&
            box3.childNodes.length > 0
        ) {
            let b1Child = box1.childNodes[0].className;
            let b2Child = box2.childNodes[0].className;
            let b3Child = box3.childNodes[0].className;

            if (b1Child == b2Child && b2Child == b3Child) {
                declareWinner(b1Child);
                return;
            }
        }
    }

    if ([...boxes].every(box => box.childNodes.length > 0)) {
        declareWinner("Deu velha!");
    }
}

function declareWinner(winner) {
    let scoreboardX = document.querySelector("#scoreboard_1");
    let scoreboardY = document.querySelector("#scoreboard_2");
    let msg = "";
    const gameTime = new Date().toISOString().split("T")[0];

    if (winner == "x") {
        scoreboardX.textContent = parseInt(scoreboardX.textContent) + 1;
        msg = `${player1Name} venceu`;
    } else if (winner == "o") {
        scoreboardY.textContent = parseInt(scoreboardY.textContent) + 1;
        msg = `${player2Name} venceu`;
    } else {
        msg = "Deu velha";
    }

    console.log(msg + " " + " " + player1Name + " " + " " + player2Name)
    console.log("Data da partida", gameTime)

    const matchData = {
        jogador1: player1Name,
        jogador2: player2Name,
        resultado: winner === "x" ? player1Name : winner === "o" ? player2Name : "Empate",
        data_jogo: gameTime,
    };

    fetch("http://localhost:8080/api/results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao enviar dados para o backend");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Resposta do backend:", data.message);
        })
        .catch((error) => {
            console.error("Erro no fetch:", error);
        });

    messageText.innerHTML = msg;
    messageContainer.classList.remove("hide");

    setTimeout(() => {
        messageContainer.classList.add("hide");
    }, 2000);

    player1 = 0;
    player2 = 0;

    let boxesToRemove = document.querySelectorAll(".box div");
    for (let i = 0; i < boxesToRemove.length; i++) {
        boxesToRemove[i].parentNode.removeChild(boxesToRemove[i]);
    }
}

function computerPlay() {
    let cloneO = o.cloneNode(true);
    let emptyBoxes = [...boxes].filter(box => box.childNodes.length == 0);
    let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];

    if (randomBox) {
        randomBox.appendChild(cloneO);
    }
}


