let socket;
let closeButton, screenButton;
let canvasIMG, updatedCanvas;
let lines = [];
let cursors = [];
let players = [];


function setup() {
  pixelDensity(1);
  createCanvas(window.windowWidth, window.windowHeight);
  socket = io.connect();
  socket.on('heartbeat', players => checkPlayers(players));
  socket.on('disconnect', playerID => removePlayer(playerID));
  socket.on('oldLines', lineBuffer => getLines(lineBuffer));
  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);
  socket.on('removeLines', lineID => rLines(lineID));

  closeButton = createButton('×');
  closeButton.position(20, 20);
  closeButton.mousePressed(resetCanvas);

  screenButton = createButton('⭳');
  screenButton.position(20, 80);
  screenButton.mousePressed(screenShot);
}

function rLines(lineID) {
  lines = [];
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
          lineFromServer.py
        ));

  }
}

function newDrawing(data) {
  lines.push(new drawLine(data.x, data.y, data.px, data.py, data.id));
  console.log(data.id + ' is drawing');
}

function draw() {
  background(50);
  players.forEach(player => player.draw(0, canvasIMG));
  for (var i = 0; i < lines.length; i++) {
    lines[i].show();
  }
}

function checkPlayers(serverPlayers) {
  console.log('new user '+ serverPlayers.length);
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
    y: mouseY,
  }
  socket.emit('cursor', cursorProps);
  e.preventDefault();
  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    id: socket.id
  }
  socket.emit('mouse', data);
  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY));
  socket.emit('oldLines', data);
  return false;
}

function mouseDragged(e) {

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    id: socket.id
  }
  socket.emit('mouse', data);

  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY, socket.id));
  //send lines to server
  socket.emit('oldLines', data);
  console.log(lines.length);

  return false;
}

function drawLine(x, y, px, py, id) {
  this.id = id;
  this.show = function() {

    stroke(255);
    strokeWeight(5);
    line(x, y, px, py);
  }
}

function windowResized() {
  resizeCanvas(window.windowWidth, window.windowHeight);
}
