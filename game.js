class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.player = null;
    this.geometry = null;
    this.touchHandler = null;
    this.isMoving = false;
    this.moveTarget = null;
    this.movementSpeed = 100;
    this.isHolding = false;
  }

  start() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.touchHandler = new TouchHandler(this);
    this.geometry = new Geometry(this, this.player, this.touchHandler);
    this.canvas.addEventListener(
      "touchstart",
      this.touchHandler.handleTouchStart
    );
    this.canvas.addEventListener("touchend", this.touchHandler.handleTouchEnd);
    this.canvas.addEventListener(
      "touchmove",
      this.touchHandler.handleTouchMove
    );
    requestAnimationFrame(this.gameLoop);
  }

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

// Create an instance of the Game class and start the game
const game = new Game();
game.start();
