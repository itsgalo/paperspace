let socket;

function setup() {
  createCanvas(window.windowWidth, window.windowHeight);
  background(51);
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 20, 20);
}

function draw() {

}

function mouseDragged() {

  let data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);

  noStroke();
  fill(255, 255, 255);
  ellipse(mouseX, mouseY, 20, 20);
}
