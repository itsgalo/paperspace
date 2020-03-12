let socket;
let pg;
let lines = [];

function setup() {
  createCanvas(window.windowWidth, window.windowHeight);
  background(51);
  socket = io.connect('http://18.234.15.82:3000/');
  socket.on('mouse', newDrawing);
}


function newDrawing(data) {
  lines.push(new drawLine(data.x, data.y, data.px, data.py));
}

function draw() {
  background(51);
  for (var i = 0; i < lines.length; i++) {
    lines[i].show();
  }
}

function mouseDragged(e) {

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  }
  socket.emit('mouse', data);

  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY));
  console.log(lines);

  return false;
}

function drawLine(x, y, px, py) {
  this.show = function() {
    stroke(255);
    strokeWeight(5);
    line(x, y, px, py);
  }
}

function windowResized() {
  resizeCanvas(window.windowWidth, window.windowHeight);
}
