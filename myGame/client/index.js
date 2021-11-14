document.onkeydown = checkKey;
let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");

let centerX;
let centerY;

canvas.setAttribute("width", $("body").width());
canvas.setAttribute("height", $("body").height());
centerX = canvas.width / 2;
centerY = canvas.height / 2;

let players = [];
let playerSize = 25;

let playerTrails = [];

class Player {
    constructor (id, color, trailColor) {
        this.id = id;
        this.color = color;
        this.trailColor = trailColor;
        this.x = centerX - playerSize / 2;
        this.y = centerY - playerSize / 2;
    }
    changeDirection(newDirection) {
        this.direction = newDirection;
    }
    move() {
        switch(this.direction) {
            case "up":
                if (this.y - playerSize >= 0) {
                    let index = playerTrails.findIndex((element) => {
                        return element[0] == this.x && element[1] == this.y;
                    });
                    if (index != -1) {
                        playerTrails.splice(index, 1);
                    } 
                    playerTrails.push([this.x, this.y, this.trailColor]);
                    this.y = this.y - playerSize;
                }
            break;

            case "down":
                if (this.y + playerSize * 2 <= canvas.height) {
                    let index = playerTrails.findIndex((element) => {
                        return element[0] == this.x && element[1] == this.y;
                    });
                    if (index != -1) {
                        playerTrails.splice(index, 1);
                    } 
                    playerTrails.push([this.x, this.y, this.trailColor]);
                    this.y = this.y + playerSize;
                }
            break;

            case "left":
                if (this.x - playerSize >= 0) {
                    let index = playerTrails.findIndex((element) => {
                        return element[0] == this.x && element[1] == this.y;
                    });
                    if (index != -1) {
                        playerTrails.splice(index, 1);
                    } 
                    playerTrails.push([this.x, this.y, this.trailColor]);
                    this.x = this.x - playerSize;
                }
            break;

            case "right":
                if (this.x + playerSize * 2 <= canvas.width) {
                    let index = playerTrails.findIndex((element) => {
                        return element[0] == this.x && element[1] == this.y;
                    });
                    if (index != -1) {
                        playerTrails.splice(index, 1);
                    } 
                    playerTrails.push([this.x, this.y, this.trailColor]);
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

let player1 = new Player(1, "red", "#B33B36");
let player2 = new Player(2, "blue", "#363DB3");
let player3 = new Player(3, "green", "#4DB336");
let player4 = new Player(4, "yellow", "#B3B136");

players.push(player1);
players.push(player2);
players.push(player3);
players.push(player4);


function mainCycle() {
    canvas.setAttribute("width", $("body").width());
    canvas.setAttribute("height", $("body").height());
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    clearCanvas();
    drawTrails();
    randomMoves();
}
setInterval(mainCycle, 20);

function randomMoves() {
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let rand = Math.random();
        console.log(rand);
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
        player.move();
        player.drawPlayer();
    }
}


function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, $(document).width(),  $(document).height());
    ctx.closePath();
}

function drawTrails() {
    for (let i = 0; i < playerTrails.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = playerTrails[i][2];
        ctx.fillRect(playerTrails[i][0], playerTrails[i][1], playerSize + 0.5,  playerSize + 0.5);
        ctx.closePath();
    }
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
    }
}