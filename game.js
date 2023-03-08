class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.player = null;
    this.geometry = null;
    this.isMoving = false;
    this.moveTarget = null;
    this.tapStart = null;
    this.movementSpeed = 100;
    this.isHolding = false;
    this.touchX = null;
    this.touchY = null;
  }

  start() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.geometry = new Geometry(this, this.player);
    this.canvas.addEventListener("touchstart", this.handleTouchStart);
    this.canvas.addEventListener("touchend", this.handleTouchEnd);
    this.canvas.addEventListener("touchmove", this.handleTouchMove);
    requestAnimationFrame(this.gameLoop);
  }

  handleTouchStart = (event) => {
    event.preventDefault();
    this.tapStart = new Date().getTime();

    // Get the touch coordinates relative to the canvas
    this.touchX = event.changedTouches[0].pageX - this.canvas.offsetLeft;
    this.touchY = event.changedTouches[0].pageY - this.canvas.offsetTop;
  };

  handleTouchEnd = (event) => {
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
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    const tapEnd = new Date().getTime();
    // Get the touch coordinates relative to the canvas
    this.touchX = event.changedTouches[0].pageX - this.canvas.offsetLeft;
    this.touchY = event.changedTouches[0].pageY - this.canvas.offsetTop;
    if (tapEnd - this.tapStart >= 200) {
      this.isHolding = true;
    }
  };

  /**
   * Updates the game state based on user input or other factors.
   * Calculates the player's movement based on the touch input.
   * Calculates the start and end points of a moving line based on touch input and player position.
   */
  update() {
    this.updatePlayerMovement();
    this.updateMovingLine();
  }

  /**
   * Updates the player's movement based on touch input.
   */
  updatePlayerMovement() {
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
  }

  /**
   * Updates the start and end points of a moving line based on touch input and player position.
   */
  updateMovingLine() {
    if (this.isHolding) {
      this.geometry.calculateMovingLineStartAndEndPoints();
      this.geometry.calculateMovingLineSpeed();
    }

    this.geometry.calculateMovingLineEndPoint();
    this.geometry.calculateMovingLineStartPoint();
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
    this.ctx.moveTo(this.geometry.startX, this.geometry.startY);
    this.ctx.lineTo(this.geometry.endX, this.geometry.endY);
    this.ctx.stroke();
  }

  gameLoop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop);
  };
}
class Geometry {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.lineLength = 0;
    this.speed = 0.01;
  }
  /**
   * Calculates the start and end points of the moving line based on touch input and player position.
   */
  calculateMovingLineStartAndEndPoints() {
    this.startX = this.game.touchX;
    this.startY = this.game.touchY;
    this.endX = this.player.x;
    this.endY = this.player.y;
    this.lineLength = Math.sqrt(
      Math.pow(this.endX - this.startX, 2) +
        Math.pow(this.endY - this.startY, 2)
    );
  }

  /**
   * Calculates the speed of the moving line based on its length.
   */
  calculateMovingLineSpeed() {
    this.speed = this.lineLength * 0.0005;
  }

  /**
   * Calculates the end point of the moving line based on its angle and length.
   */
  calculateMovingLineEndPoint() {
    var angle = Math.atan2(
      this.endY - this.startY,
      this.endX - this.startX
    );
    this.endX = this.startX + this.lineLength * Math.cos(angle);
    this.endY = this.startY + this.lineLength * Math.sin(angle);
  }

  /**
   * Calculates the start point of the moving line based on its angle and speed.
   */
  calculateMovingLineStartPoint() {
    var angle = Math.atan2(
      this.endY - this.startY,
      this.endX - this.startX
    );
    this.startX +=
      this.speed * this.lineLength * Math.cos(angle);
    this.startY +=
      this.speed * this.lineLength * Math.sin(angle);
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
