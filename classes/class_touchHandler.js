class TouchHandler {
    constructor(game) {
      this.game = game;
      this.tapStart = null;
      this.touchX = null;
      this.touchY = null;
    }
    handleTouchStart = (event) => {
      event.preventDefault();
      this.tapStart = new Date().getTime();
  
      // Get the touch coordinates relative to the canvas
      this.touchX = event.changedTouches[0].pageX - this.game.canvas.offsetLeft;
      this.touchY = event.changedTouches[0].pageY - this.game.canvas.offsetTop;
    };
  
    handleTouchEnd = (event) => {
      event.preventDefault();
      const tapEnd = new Date().getTime();
      if (tapEnd - this.tapStart < 200) {
        this.game.isMoving = true;
        this.game.moveTarget = {
          x: event.changedTouches[0].pageX - this.game.canvas.offsetLeft,
          y: event.changedTouches[0].pageY - this.game.canvas.offsetTop,
        };
      }
      this.game.isHolding = false;
    };
  
    handleTouchMove = (event) => {
      event.preventDefault();
      const tapEnd = new Date().getTime();
      // Get the touch coordinates relative to the canvas
      this.touchX = event.changedTouches[0].pageX - this.game.canvas.offsetLeft;
      this.touchY = event.changedTouches[0].pageY - this.game.canvas.offsetTop;
      if (tapEnd - this.tapStart >= 200) {
        this.game.isHolding = true;
      }
    };
  }