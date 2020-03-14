let socket;
let closeButton;
let lines = [];
let cursors = [];
let players = [];


function setup() {
  createCanvas(window.windowWidth, window.windowHeight);
  background(51);
  socket = io.connect();
  socket.on('heartbeat', players => checkPlayers(players));
  socket.on('disconnect', playerID => removePlayer(playerID));

  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);

  closeButton = createButton('×');
  closeButton.position(20, 20);
  closeButton.mousePressed(resetCanvas);
}

function resetCanvas() {
  lines = [];
  clear();
  console.log('clear');
}

function newDrawing(data) {
  lines.push(new drawLine(data.x, data.y, data.px, data.py));
}

function draw() {
  background(51);
  players.forEach(player => player.draw(0));

  for (var i = 0; i < lines.length; i++) {
    lines[i].show();
  }
  //for (var i = 0; i < players.length; i++) {
    //players[i].draw();
  //}
}

function checkPlayers(serverPlayers) {
  console.log('new user '+ serverPlayers.length);
  //clears array to update players
  players = [];
  updatePlayers(serverPlayers);
}

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
      //if (!playerExists(playerFromServer)) {
        players.push(new Player(playerFromServer));
      //}
      //console.log(players.length +' '+ serverPlayers.length);
      //console.log(players[i].id +' '+ playerFromServer.id);
      //console.log(playerExists(playerFromServer));
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
    py: pmouseY
  }
  socket.emit('mouse', data);
  lines.push(new drawLine(mouseX, mouseY, pmouseX, pmouseY));
  return false;
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
