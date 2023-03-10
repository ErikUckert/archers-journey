// Define the Player class
class Player {
    constructor(x, y, image) {
      // Define instance variables for the player state
      this.x = x;
      this.y = y;
      this.image = image;
    }
  
    move(dx, dy) {
      // Define the move method, which updates the player's position
      // based on the specified x and y deltas
      this.x += dx;
      this.y += dy;
    }
  }