const COLORS = {
    red: '#E53935',
    darkRed: '#C62828',
    pink: '#D81B60',
    darkPink: '#AD1457',
    purple: '#8E24AA',
    darkPurple: '#6A1B9A',
    blue: '#1E88E5',
    darkBlue: '#1565C0',
    green: '#43A047',
    darkGreen: '#2E7D32',
    yellow: '#FDD835',
    darkYellow: '#F9A825',
    orange: '#FB8C00',
    darkOrange: '#EF6C00',
}





document.onkeydown = checkKey;
let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

let centerX;
let centerY;

centerX = canvas.width / 2;
centerY = canvas.height / 2;

let players = [];

const playerSize = 20; // px
const ROUND_TIME = 30; //seconds
const PLAYER_SPEED = 3; // 1 - fastest

let playerTrails = [];

let timeLeft = ROUND_TIME;
displayTimer(timeLeft);
let timer;

function displayTimer(timeLeft) {
    let seconds = timeLeft % 60;
    let minutes = Math.floor(timeLeft / 60);
    if (seconds < 10) seconds = '0' + seconds;
    if (timeLeft == 5) $("#time-left").addClass("timeLow");
    if (seconds == 0) endGame();
    $("#time-left").text(`${minutes}:${seconds}`);
}

class Player {
    constructor (id, colorName, color, trailColor) {
        this.id = id;
        this.colorName = colorName;
        this.color = color;
        this.trailColor = trailColor;
        this.x = centerX - playerSize / 2;
        this.y = centerY - playerSize / 2;
        this.score = 0;
    }
    changeDirection(newDirection) {
        this.direction = newDirection;
    }
    move() {
        if (this.y - playerSize >= 0 || this.y + playerSize * 2 <= canvas.height || this.x - playerSize >= 0 || this.x + playerSize * 2 <= canvas.width) {
            let index = playerTrails.findIndex((element) => {
                return element[0] == this.x && element[1] == this.y;
            });
            if (index != -1) {
                if (playerTrails[index][2] == this.trailColor) this.score--;
                else {
                    for (let i = 0; i < players.length; i++) {
                        if (players[i].trailColor == playerTrails[index][2]) {
                            players[i].score--;
                            break;
                        }
                    }
                }
                playerTrails.splice(index, 1);
            } 
            playerTrails.push([this.x, this.y, this.trailColor]);
            this.score++;
        }	

        switch(this.direction) {
            case "up":
                if (this.y - playerSize >= 0) {
                    this.y = this.y - playerSize;
                }
            break;

            case "down":
                if (this.y + playerSize * 2 <= canvas.height) {
                    this.y = this.y + playerSize;
                }
            break;

            case "left":
                if (this.x - playerSize >= 0) {
                    this.x = this.x - playerSize;
                }
            break;

            case "right":
                if (this.x + playerSize * 2 <= canvas.width) {
                    this.x = this.x + playerSize;
                }
            break;
        }
    }
    drawPlayer() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, playerSize,  playerSize);
        ctx.closePath();
    }
}

class Bot extends Player { }

let player1 = new Player(1, "Red", COLORS.darkRed, COLORS.red);
let player2 = new Bot(2, "Blue", COLORS.darkBlue, COLORS.blue);
let player3 = new Bot(3, "Yellow", COLORS.darkYellow, COLORS.yellow);
let player4 = new Bot(4, "Green", COLORS.darkGreen, COLORS.green);

players.push(player1);
players.push(player2);
players.push(player3);
players.push(player4);

let frameCount = 0;
function mainCycle() {
    //const t0 = performance.now();
    if (frameCount % PLAYER_SPEED == 0) {
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        clearCanvas();
        movePlayers();
        drawTrails();
        drawPlayers();
        updateScores();
        frameCount = 0;
    }
    //clearMoves();
    //const t1 = performance.now();
    //displayFps(t1 - t0);
    frameCount++;
}
var gameCycle;

startGame();

function startGame() {
    players.forEach(player => {
        player.score = 0;
        player.direction = "";
        player.x = centerX - playerSize / 2;
        player.y = centerY - playerSize / 2;
    });
    playerTrails = [];
    timeLeft = ROUND_TIME;

    gameCycle = setInterval(mainCycle, 15);
    timeLeft--;
    displayTimer(timeLeft);
    timer = setInterval(() => {
        timeLeft--;
        displayTimer(timeLeft);
    }, 1000);
    $("#time-left").removeClass("timeLow");
    $("#timer-icon").addClass("tickAnimated");

    $("#winner-block").hide();
    $("#shadow").hide();
}

function endGame() {
    clearInterval(timer);
    $("#timer-icon").removeClass("tickAnimated");
    clearInterval(gameCycle);

    let winner = { 
        name: "Frendship",
        trailColor: COLORS.pink,
        score: 0,
    };
    players.forEach(player => { if (player.score > winner.score) winner = player; });

    $("#winner-name").text(winner.colorName.toUpperCase());
    $("#winner-name").css("color", winner.trailColor)
    $("#winner-block").show();
    $("#shadow").show();
}

function displayFps(timing) {
    ctx.beginPath();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("fps: " + Math.floor(1000 / timing), 10, 30);
    ctx.closePath();
}

function clearMoves() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        player.changeDirection("");
    }
}

function movePlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.constructor.name == "Bot") {
            let rand = Math.random();
            if (Math.round(rand * 10) % 2 == 0) {
                if (rand < 1 && rand > 0.8) {
                    player.changeDirection("up");
                }
                else if (rand < 0.8 && rand > 0.6) {
                    player.changeDirection("down");
                } 
                else if (rand < 0.6 && rand > 0.4) {
                    player.changeDirection("left"); 
                }
                else if (rand < 0.4 && rand > 0.2){
                    player.changeDirection("right");
                }
            }
        }
        player.move();
    }
}


function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, $(document).width(),  $(document).height());
    ctx.closePath();
}

function drawPlayers() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        player.drawPlayer();
    }
}

function drawTrails() {
    for (let i = 0; i < playerTrails.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = playerTrails[i][2];
        ctx.fillRect(playerTrails[i][0], playerTrails[i][1], playerSize + 0.5,  playerSize + 0.5);
        ctx.closePath();
    }
}

function updateScores() {
    $("#player-scores").empty();
    let scores = [];
    players.forEach(player => {
        scores.push(player);
    });
    scores.sort((a, b) => {
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
    });
    scores.forEach(el => {
        $("#player-scores").append('<div><span style="color: ' + el.color + '; font-weight: 800;">' + el.colorName + '</span> : <span>' + el.score + '</span></div>');
    });
}


function checkKey(e) {
    let event = window.event ? window.event : e;
    switch(event.keyCode) {
        case 38:
            player1.changeDirection("up");
        break;

        case 40:
            player1.changeDirection("down");
        break;

        case 37:
            player1.changeDirection("left");
        break;

        case 39:
            player1.changeDirection("right");
        break;

        case 13:
            clearInterval(timer);
            clearInterval(gameCycle);
            startGame();
        break;
    }
}