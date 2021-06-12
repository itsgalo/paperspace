let socket;
let closeButton, screenButton, colorButton, linkButton;
let canvasIMG, updatedCanvas;
let cursors = [];
let players = [];
let r = rand(155);
let g = rand(20);
let b = rand(155);
let bgr = 105; //200 + rand(50);
let bgg = 179; //170;
let bgb = 231; //rand(250);
let xoff = 0.0;
let alph = 1;
let friendIsDrawing = false;
let isDrawing = false;
let thisPlayer;
let cam, camShot;

function setup() {
  pixelDensity(1);
  noCursor();

  canvasIMG = createCanvas(window.windowWidth, window.windowHeight);
  background(bgr, bgg, bgb);

  socket = io.connect();
  socket.on('heartbeat', players => checkPlayers(players));
  socket.on('disconnect', playerID => removePlayer(playerID));
  //socket.on('oldLines', lineBuffer => getLines(lineBuffer));
  socket.on('mouse', newDrawing);
  socket.on('cursor', cursorPos);
  //socket.on('removeLines', rline => rLines(rline));
  //socket.on('spliceLines', sline => sLines(sline));
  socket.on('updateCam', frame => updateFrame(frame));

  closeButton = createButton('×');
  closeButton.position(20, 20);
  closeButton.mousePressed(resetCanvas);

  screenButton = createButton('↓');
  screenButton.position(20, windowHeight - 100);
  screenButton.mousePressed(screenShot);

  colorButton = createButton('#');
  colorButton.position(windowWidth - 90, 20);
  colorButton.mousePressed(changeColor);

  linkButton = createButton('?');
  linkButton.position(windowWidth - 90, windowHeight - 100);
  linkButton.mousePressed(goTo);

  setTimeout(grabShot, 1000);
}
function goTo() {
  window.open('http://officeca.com');
}
function resetCanvas() {
  //socket.emit('removeLines', lines);
  background(bgr, bgg, bgb);
}

function updateFrame(buffer) {
  //console.log(buffer);
  //camShot = data;
  let raw = new Image();
  raw.src = buffer;
  raw.onload = function () {
    camShot = createImage(raw.width, raw.height);
    camShot.drawingContext.drawImage(raw, 0, 0);
    //fill(255);
    rect((width/2)-8, (height/2) -8, (width/2) + 40, (height/2) + 40, 10, 10, 10, 10);
    //image(camShot, width/4, height/4, width/2, height/2);
    //background(bgr, bgg, bgb);
    camShot.loadPixels();
    for (let x = 0; x < camShot.width; x += 1) {
      for (let y = 0; y < camShot.height; y += 1) {
        let i = (y * camShot.width + x) * 4;

        let r = camShot.pixels[i];
        let g = camShot.pixels[i+1];
        let b = camShot.pixels[i+2];
        let a = camShot.pixels[i+3];

        let luma = 0.299 * r + 0.587 * g + 0.114 * b;

        let diameter = map(luma, 0, 255, 0, 20);
        fill(bgr, bgg, bgb);
        //stroke(bgr, bgg, bgb);
        strokeWeight(2);
        //noStroke();
        ellipse(
          map(x, 0, camShot.width, width/4, width/2 + width/4),
          map(y, 0, camShot.height, height/4, height/2 + height/4),
          //map(x, 0, camShot.width, 10, width),
          //map(y, 0, camShot.height, 10, height),
          diameter,
          diameter
        );
      }
    }
    //canvasIMG.drawingContext.drawImage(raw, window.windowWidth / 4, window.windowHeight/4, window.windowWidth / 2, window.windowHeight/2);
  }
}

function grabShot() {
  //let camBuffer = canvasIMG.elt.toDataURL('image/jpeg');
  if (cam != undefined) {
    cam.loadPixels();
    let camBuffer = cam.canvas.toDataURL('image/jpeg');
    socket.emit('updateCam', camBuffer);
  }
  setTimeout(grabShot, 1000);
}

function screenShot() {
  saveCanvas('OurPaperSpace', 'png');
}

function newDrawing(data) {
  //draw what someone else is drawing
  drawSplat(data);
  //console.log(data.id + ' is drawing');
}

function draw() {
  //background(bgr, bgg, bgb, alph);

  rectMode(CENTER);
  //xoff = xoff + 0.008;
  let n = noise(xoff) * 20;

  //manage user graients
  //r += sin(xoff)*150;
  //g += sin(xoff)*100;
  //players.forEach(player => player.draw(0, canvasIMG));

  //if(isDrawing == true) {
  //  alph = 1;
  //} else if (isDrawing == false){
  //  alph += 0.01;
  //  if (alph >= 256) {
  //    alph = 0;
  //  }
  //}

  for(var i = 0; i < players.length; i++){
    players[i].draw(i, canvasIMG, n);
  }
}

function keyPressed(e) {
  //handle camera on
  if (keyCode === 48) {
    if (e.shiftKey){
      cam = createCapture(VIDEO);
      cam.size(48, 48);
    }
  }
}

function checkPlayers(serverPlayers) {
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
}

function cursorPos(data) {
    let cursorID = players.find(player => player.id == data.id);
    cursorID.x = data.coords.x;
    cursorID.y = data.coords.y;

    thisPlayer = players.find(player => player.id == data.id);

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
  drawSplat(data);
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
  drawSplat(data);

  //send lines to server
  socket.emit('oldLines', data);
  return false;
}

function changeColor() {
  if (thisPlayer != undefined) {
    thisPlayer.rgb.r = Math.floor(random(0, 100));
    thisPlayer.rgb.g = Math.floor(random(0, 255));
    thisPlayer.rgb.b = Math.floor(random(0, 255));

    r = thisPlayer.rgb.r;
    g = thisPlayer.rgb.g;
    b = thisPlayer.rgb.b;
  }
}

function drawSplat(d){
  //draw splat from this user
  xoff = xoff + 0.03;
  r = abs(thisPlayer.rgb.r + (sin(xoff)*150));
  g = abs(random(thisPlayer.rgb.g - 30, thisPlayer.rgb.g) + sin(xoff)*15);
  let rr = sin(xoff)*130;
  for (let i = 0; i < 10; i++) {
    fill(d.r, d.g, d.b);
    ellipse(d.x + (i*random(10)), d.y + (i*random(10)), 5, 5);
    ellipse(d.x - (i*random(10)), d.y - (i*random(10)), i*2, i*2);
    ellipse(d.x - (i*random(10)), d.y + (i*random(10)), i, i);
    ellipse(d.x + (i*random(10)), d.y - (i*random(10)), 5, 5);
    ellipse(d.x+cos(i * radians(35)) * noise(xoff*i)*100, d.y+sin(i * radians(35)) * noise(xoff*i)*100, rr);
    ellipse(d.x, d.y, rr);
  }
}

function windowResized() {
  resizeCanvas(window.windowWidth, window.windowHeight);
  resetCanvas();
  closeButton.position(20, 20);
  screenButton.position(20, windowHeight - 100);
  colorButton.position(windowWidth - 90, 20);
  linkButton.position(windowWidth - 90, windowHeight - 100);
}
