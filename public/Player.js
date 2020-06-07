class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.rgb = player.rgb;
  }


  draw(shape, canvas, n) {
    noStroke();
    fill(r, g, b);
    rectMode(CENTER);
    //even number, odd number
    if (shape % 2 == 0) {
      rect(this.x, this.y+random(15,20), n, n);
      rect(this.x-random(15,20), this.y, n, n);
      rect(this.x, this.y-random(15,20), n, n);
      rect(this.x+random(15,20), this.y, n, n);
    } else if (shape % 2 != 0) {
      rect(this.x, this.y+random(15,20), n * 0.5, n *0.5);
      rect(this.x-random(15,20), this.y, n * 0.5, n *0.5);
      rect(this.x, this.y-random(15,20), n * 0.5, n *0.5);
      rect(this.x+random(15,20), this.y, n * 0.5, n *0.5);
    }
  }

}
