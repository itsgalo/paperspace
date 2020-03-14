class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.rgb = player.rgb;
  }


  draw(shape, canvas) {
    noStroke();
    strokeWeight(5);
    fill(this.rgb.r, this.rgb.g, this.rgb.b);
    if (shape == 0) {
      rectMode(CENTER);
      rect(this.x, this.y, 10, 50);
      rect(this.x, this.y, 50, 10);
    } else if (shape == 1) {
      canvas.ellipse(this.x, this.y, 30, 30);
    } else if (shape == 2) {
      canvas.rectMode(CENTER);
      canvas.rect(this.x, this.y, 40, 40);
    }
  }

}
