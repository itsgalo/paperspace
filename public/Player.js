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
    ellipse(this.x, this.y, 5);
    // for (let i = 0; i < 10; i++) {
    //   ellipse(this.x + (i*random(10)), this.y + (i*random(10)), 20, 20);
    //   ellipse(this.x - (i*random(10)), this.y - (i*random(10)), i*2, i*2);
    //   ellipse(this.x - (i*random(10)), this.y + (i*random(10)), i*3, i*3);
    //   ellipse(this.x + (i*random(10)), this.y - (i*random(10)), 20, 20);
    // }
  }

}
