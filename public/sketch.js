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
let bgr = 200 + rand(50);
let bgg = 170;
let bgb = rand(250);
let xoff = 0.0;
let alph = 1;
let friendIsDrawing = false;
let isDrawing = false;

function setup() {
  pixelDensity(1);
  noCursor();
  createCanvas(window.windowWidth, window.windowHeight);
  background(bgr, bgg, bgb);

  socket = io.connect();
  socket.on('heartbeat', players => checkPlayers(players));
  socket.on('disconnect', playerID => removePlayer(playerID));
  //socket.on('oldLines', lineBuffer => getLines(lineBuffer));
  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);
  //socket.on('removeLines', rline => rLines(rline));
  //socket.on('spliceLines', sline => sLines(sline));

  closeButton = createButton('×');
  closeButton.position(20, 20);
  closeButton.mousePressed(resetCanvas);

  screenButton = createButton('↓');
  screenButton.position(20, 80);
  screenButton.mousePressed(screenShot);

}

function resetCanvas() {
  //socket.emit('removeLines', lines);
  background(bgr, bgg, bgb);
}

function screenShot() {
  saveCanvas('MyPaperspace', 'png');
}

function newDrawing(data) {
  //draw what someone else is drawing
  for (let i = 0; i < 10; i++) {
    fill(data.r, data.g, data.b);
    rect(data.x + (i*random(10)), data.y + (i*random(10)), 20, 20);
    rect(data.x - (i*random(10)), data.y - (i*random(10)), i*2, i*2);
    rect(data.x - (i*random(10)), data.y + (i*random(10)), i*3, i*3);
    rect(data.x + (i*random(10)), data.y - (i*random(10)), 20, 20);
  }

  //lines.push(data.x, data.y);
  //console.log(data.id + ' is drawing');
}

function draw() {
  background(bgr, bgg, bgb, alph);
  rectMode(CENTER);
  //background(252, 173, 3);
  xoff = xoff + 0.005;
  let n = noise(xoff) * 20;
  //players.forEach(player => player.draw(0, canvasIMG));

  if(isDrawing || friendIsDrawing) {
    alph = 1;
  } else {
    alph += 0.01;
    if (alph >= 256) {
      alph = 0;
    }
  }
  for(var i = 0; i < players.length; i++){
    players[i].draw(i, canvasIMG, players[i].rgb.r, players[i].rgb.g, players[i].rgb.b, n);
  }
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

    let thisPlayer = players.find(player => player.id == data.id);
    r = thisPlayer.rgb.r;
    g = thisPlayer.rgb.g;
    b = thisPlayer.rgb.b;

    if (data.coords.isDrawing == true) {
      friendIsDrawing = true;
    } else if(data.coords.isDrawing == false) {
      friendIsDrawing = false;
    }
}

function rand(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function mouseMoved() {

  let cursorProps = {
    x: mouseX,
    y: mouseY,
    isDrawing: isDrawing
  }
  socket.emit('cursor', cursorProps);
}

function touchMoved(e) {
  isDrawing = true;

  let cursorProps = {
    x: mouseX,
    y: mouseY,
    isDrawing: isDrawing
  }
  socket.emit('cursor', cursorProps);

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    id: socket.id,
    r: r,
    g: g,
    b: b
  }
  socket.emit('mouse', data);
  //draw splat from this user
  for (let i = 0; i < 10; i++) {
    fill(r, g, b);
    rect(data.x + (i*random(10)), data.y + (i*random(10)), 20, 20);
    rect(data.x - (i*random(10)), data.y - (i*random(10)), i*2, i*2);
    rect(data.x - (i*random(10)), data.y + (i*random(10)), i*3, i*3);
    rect(data.x + (i*random(10)), data.y - (i*random(10)), 20, 20);
  }

  if(lines.length > 400) {
    socket.emit('spliceLines', lines);
  }
  //send lines to server
  socket.emit('oldLines', data);

  return false;
}
function touchEnded(e) {
  isDrawing = false;
}
function mouseReleased(e) {
  isDrawing = false;
}
function mouseDragged(e) {
  isDrawing = true;

  let cursorProps = {
    x: mouseX,
    y: mouseY,
    isDrawing: isDrawing
  }
  socket.emit('cursor', cursorProps);

  e.preventDefault();

  let data = {
    x: mouseX,
    y: mouseY,
    id: socket.id,
    r: r,
    g: g,
    b: b
  }
  socket.emit('mouse', data);
  //draw splat from this user
  for (let i = 0; i < 10; i++) {
    fill(r, g, b);
    rect(data.x + (i*random(10)), data.y + (i*random(10)), 20, 20);
    rect(data.x - (i*random(10)), data.y - (i*random(10)), i*2, i*2);
    rect(data.x - (i*random(10)), data.y + (i*random(10)), i*3, i*3);
    rect(data.x + (i*random(10)), data.y - (i*random(10)), 20, 20);
  }

  if(lines.length > 400) {
    socket.emit('spliceLines', lines);
  }
  //send lines to server
  socket.emit('oldLines', data);

  return false;
}

function windowResized() {
  resizeCanvas(window.windowWidth, window.windowHeight);
}
