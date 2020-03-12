let socket;
let pg;
let lines = [];
let cursors = [];

function setup() {
  createCanvas(window.windowWidth, window.windowHeight);
  background(51);
  socket = io.connect();
  socket.on('connect', () => {
    let id = socket.id;
    //socket.emit('getCount', id);
  });
  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);
  socket.on('new user', newCursor);
}


function newDrawing(data) {
  lines.push(new drawLine(data.x, data.y, data.px, data.py));
}

function newCursor(user) {
  cursors.push(new drawCursor(user.user, 0, 0));
}
function cursorPos(data) {
  for (var i = 0; i < cursors.length; i++) {
    cursors[i].x = data.coords.x;
    cursors[i].y = data.coords.y;
  }
}
function drawCursor(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.show = function () {
    fill(255, 0, 0);
    ellipse(this.x, this.y, 20, 20);
  }
}

function draw() {
  background(51);
  for (var i = 0; i < lines.length; i++) {
    lines[i].show();
  }
  for (var i = 0; i < cursors.length; i++) {
    cursors[i].show();
  }
}

function mouseMoved() {
  let cursorProps = {
    x: mouseX,
    y: mouseY,
  }

  socket.emit('cursor', cursorProps);

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
