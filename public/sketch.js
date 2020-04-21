let socket;
let closeButton, screenButton;
let canvasIMG, updatedCanvas;
let lines = [];
let cursors = [];
let players = [];
let aa = rand(40);
let bb = rand(40);
let cc = rand(15);
let r = rand(255);
let g = rand(255);
let b = rand(255);
let xoff = 0.0;


function setup() {
  pixelDensity(1);
  createCanvas(window.windowWidth, window.windowHeight);

  socket = io.connect();
  socket.on('heartbeat', players => checkPlayers(players));
  socket.on('disconnect', playerID => removePlayer(playerID));
  socket.on('oldLines', lineBuffer => getLines(lineBuffer));
  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);
  socket.on('removeLines', rline => rLines(rline));
  socket.on('spliceLines', sline => sLines(sline));

  closeButton = createButton('×');
  closeButton.position(20, 20);
  closeButton.mousePressed(resetCanvas);

  screenButton = createButton('↓');
  screenButton.position(20, 80);
  screenButton.mousePressed(screenShot);

}

function rLines(rline) {
  lines = [];
}

function sLines(sline) {
  lines.splice(0, 1);
}

function resetCanvas() {
  socket.emit('removeLines', lines);
}

function screenShot() {
  saveCanvas('MyPaperspace', 'png');
}

function getLines(bufferArray) {
  for (let i = 0; i < bufferArray.length; i++) {
    let lineFromServer = bufferArray[i];
        lines.push(new drawLine(
          lineFromServer.x,
          lineFromServer.y,
          lineFromServer.px,
          lineFromServer.py,
          lineFromServer.id,
          lineFromServer.r,
          lineFromServer.g,
          lineFromServer.b
        ));
  }
}

function newDrawing(data) {
  //draw what someone else is drawing
  lines.push(new drawLine(data.x, data.y, data.px, data.py, data.id, data.r, data.g, data.b));
  //lines.push(data.x, data.y, data.px, data.py);
  //console.log(data.id + ' is drawing');
}

function draw() {
  background(252, 173, 3);
  xoff = xoff + 0.005;
  let n = noise(xoff) * 20;
  //players.forEach(player => player.draw(0, canvasIMG));
  for (var i = 0; i < lines.length; i++) {
    lines[i].show(n);
  }
  for(var i = 0; i < players.length; i++){
    players[i].draw(i, canvasIMG);
  }
  if(lines.length > 400) {
    lines.splice(0, 1);
  }

  textSize(32);
  fill(255);
  text(lines.length + " lines", 20, windowHeight -40);
}

function checkPlayers(serverPlayers) {
  //console.log('new user '+ serverPlayers.length);
  //clears array to update players
  players = [];
  updatePlayers(serverPlayers);
  if(serverPlayers.length > 1) {
    roomEmpty = false;
  }
}

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
      //if (!playerExists(playerFromServer)) {
        players.push(new Player(playerFromServer));
      //}
  }
}

function removePlayer(playerID) {
  players = players.filter(player => player.id !== playerID);
  console.log('lost user ' + players.length);
}

function cursorPos(data) {
    let cursorID = players.find(player => player.id == data.id);
    cursorID.x = data.coords.x;
    cursorID.y = data.coords.y;
}

function rand(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function mouseMoved() {
  let cursorProps = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('cursor', cursorProps);
}
function touchMoved(e) {
  let cursorProps = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('cursor', cursorProps);

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    id: socket.id,
    r: r,
    g: g,
    b: b
  }
  socket.emit('mouse', data);
  //draw lines from this user
  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY, socket.id, r, g, b));
  if(lines.length > 400) {
    socket.emit('spliceLines', lines);
  }
  //send lines to server
  socket.emit('oldLines', data);

  return false;
}

function mouseDragged(e) {
  let cursorProps = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('cursor', cursorProps);

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    id: socket.id,
    r: r,
    g: g,
    b: b
  }
  socket.emit('mouse', data);
  //draw lines from this user
  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY, socket.id, r, g, b));
  if(lines.length > 400) {
    socket.emit('spliceLines', lines);
  }
  //send lines to server
  socket.emit('oldLines', data);

  return false;
}

function drawLine(x, y, px, py, id, red, green, blue) {
  this.id = id;
  this.show = function(noise) {

      stroke(red, green, blue);
      strokeWeight(5 + noise + rand(4));
      line(x, y, px, py);
  }
}

function windowResized() {
  resizeCanvas(window.windowWidth, window.windowHeight);
}
