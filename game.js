class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.player = null;
    this.isMoving = false;
    this.moveTarget = null;
    this.tapStart = null;
    this.movementSpeed = 100;
    this.isHolding = false;
    this.touchX = null;
    this.touchY = null;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.lineLength = 0;
    this.speed = 0.01;
  }

  start() {
    // Define the start method, which initializes the game
    // and sets up any necessary event listeners
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this));
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this));
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  handleTouchStart(event) {
    event.preventDefault();
    this.tapStart = new Date().getTime();

    // Get the touch coordinates relative to the canvas
    this.touchX = event.changedTouches[0].pageX - this.canvas.offsetLeft;
    this.touchY = event.changedTouches[0].pageY - this.canvas.offsetTop;
  }

  handleTouchEnd(event) {
    event.preventDefault();
    const tapEnd = new Date().getTime();
    if (tapEnd - this.tapStart < 200) {
      this.isMoving = true;
      this.moveTarget = {
        x: event.changedTouches[0].pageX - this.canvas.offsetLeft,
        y: event.changedTouches[0].pageY - this.canvas.offsetTop,
      };
    }
    this.isHolding = false;
  }

  handleTouchMove(event) {
    event.preventDefault();
    const tapEnd = new Date().getTime();
    // Get the touch coordinates relative to the canvas
    this.touchX = event.changedTouches[0].pageX - this.canvas.offsetLeft;
    this.touchY = event.changedTouches[0].pageY - this.canvas.offsetTop;
    if (tapEnd - this.tapStart >= 200) {
      this.isHolding = true;
    }
  }

  update() {
    // Define the update method, which updates the game state
    // based on user input or other factors
    if (this.isMoving && this.moveTarget) {
      const dx = this.moveTarget.x - this.player.x;
      const dy = this.moveTarget.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        this.player.move(dx / this.movementSpeed, dy / this.movementSpeed);
      } else {
        this.isMoving = false;
        this.moveTarget = null;
      }
    }
    // Calculate the moving line
    if (
      this.isHolding
    ) {
      this.startX = this.touchX;
      this.startY = this.touchY;
      this.endX = this.player.x;
      this.endY = this.player.y;
      this.lineLength = Math.sqrt(
        Math.pow(this.endX - this.startX, 2) +
          Math.pow(this.endY - this.startY, 2)
      );
      this.speed = this.lineLength * 0.0005;
    }

    // Calculate the angle between the start and end points
    var angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

    // Calculate the new end point coordinates based on the line length
    this.endX = this.startX + this.lineLength * Math.cos(angle);
    this.endY = this.startY + this.lineLength * Math.sin(angle);

    // Calculate the new start point coordinates based on moving in the direction of the line
    this.startX += this.speed * this.lineLength * Math.cos(angle);
    this.startY += this.speed * this.lineLength * Math.sin(angle);
  }

  render() {
    // Define the render method, which renders the game
    // on the canvas or HTML elements
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#888";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();

    // Draw the moving line
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.endX, this.endY);
    this.ctx.stroke();
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// Define the Player class
class Player {
  constructor(x, y) {
    // Define instance variables for the player state
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    // Define the move method, which updates the player's position
    // based on the specified x and y deltas
    this.x += dx;
    this.y += dy;
  }
}

// Create an instance of the Game class and start the game
const game = new Game();
game.start();
