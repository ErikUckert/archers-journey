class Geometry {
  constructor(game, player, touchHandler) {
    this.game = game;
    this.player = player;
    this.touchHandler = touchHandler;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.lineLength = 0;
    this.speed = 0.01;
    this.angle = 0;
  }
  calculateAngel(startX, startY, endX, endY) {
    return Math.atan2(endY - startY, endX - startX);
  }
  /**
   * Calculates the start and end points of the moving line based on touch input and player position.
   */
  calculateMovingLineStartAndEndPoints() {
    this.startX = this.touchHandler.touchX;
    this.startY = this.touchHandler.touchY;
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
    this.angle = this.calculateAngel(this.startX, this.startY, this.endX, this.endY);
    this.endX = this.startX + this.lineLength * Math.cos(this.angle);
    this.endY = this.startY + this.lineLength * Math.sin(this.angle);
  }

  /**
   * Calculates the start point of the moving line based on its angle and speed.
   */
  calculateMovingLineStartPoint() {
    this.angle = this.calculateAngel(this.startX, this.startY, this.endX, this.endY);
    this.startX += this.speed * this.lineLength * Math.cos(this.angle);
    this.startY += this.speed * this.lineLength * Math.sin(this.angle);
  }
}
