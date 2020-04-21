class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.rgb = player.rgb;
  }


  draw(shape, canvas) {
    noStroke();
    fill(this.rgb.r, this.rgb.b, this.rgb.g);
    //even number, odd number
    if (shape % 2 == 0) {
      rectMode(CENTER);
      rect(this.x, this.y, 15, 60);
      rect(this.x, this.y, 60, 15);
    } else if (shape % 2 != 0) {
      ellipse(this.x, this.y, 60, 60);
      fill(252, 173, 3);
      ellipse(this.x, this.y, 30, 30);
    }
  }

}
