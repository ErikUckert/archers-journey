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
    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2, document.getElementById("bow"));
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
    this.updateMovingLine();
    this.updatePlayerMovement();
  }

  /**
   * Updates the player's movement based on touch input.
   */
  updatePlayerMovement() {
    if (this.isMoving && this.moveTarget) {
      const dx = this.moveTarget.x - this.player.x;
      const dy = this.moveTarget.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10 && !this.isHolding) {
        this.player.move(dx / this.movementSpeed, dy / this.movementSpeed);
        this.geometry.angle = this.geometry.calculateAngel(
          this.player.x,
          this.player.y,
          this.moveTarget.x,
          this.moveTarget.y
        );
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
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    this.ctx.rotate(this.geometry.angle + Math.PI * 3/4);
    let spriteMapX = [0, 52, 104, 156, 208];
    let spriteX = 0;
    if (this.geometry.lineLength > 30 && this.geometry.lineLength < 52) {
      spriteX = spriteMapX[1];
    };
    if (this.geometry.lineLength > 52 && this.geometry.lineLength < 104) {
      spriteX = spriteMapX[2];
    };
    if (this.geometry.lineLength > 104 && this.geometry.lineLength < 156) {
      spriteX = spriteMapX[3];
    };
    if (this.geometry.lineLength > 156 && this.isHolding) {
      spriteX = spriteMapX[4];
    };
    this.ctx.drawImage(this.player.image, spriteX, 0, 52, 52, -26, -26, 52, 52);
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    this.ctx.restore();

    // Draw the moving line
    // using a gradient to visualize a powered up arrow
    this.ctx.lineCap = "round";
    if (this.geometry.lineLength > 150) {
      var gradient = this.ctx.createLinearGradient(this.geometry.startX, this.geometry.startY, this.geometry.endX, this.geometry.endY);
      gradient.addColorStop("0", "magenta");
      gradient.addColorStop("0.5", "blue");
      gradient.addColorStop("1.0", "red");
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 10;
    } else {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.geometry.startX, this.geometry.startY);
    this.ctx.lineTo(this.geometry.endX, this.geometry.endY);
    this.ctx.stroke();
  }

  gameLoop = () => {
    this.render();
    this.update();
    requestAnimationFrame(this.gameLoop);
  };
}

// Create an instance of the Game class and start the game
const game = new Game();
game.start();
