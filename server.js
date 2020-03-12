const http = require('http');
const app = require('./app');

app.set('port', '3000');

const server = http.createServer(app);
server.on('listening', ()=> {
  console.log('listening on port 3000');
});

server.listen('3000', "0.0.0.0");

//web sockets
const socket = require('socket.io');
const io = socket(server);
let totalUsers = 0,
    stepID = 0,
    userGroup = [];

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  //get new id
  let thisID = getID();
  addUser();
  io.sockets.emit('connected', {connections: totalUsers});
  socket.broadcast.emit('new user', {user: thisID});
  socket.on('disconnect', function(){
    removeUser(thisID);
    socket.broadcast.emit('bye user', {connections: totalUsers, user: thisID});
  });
  //this listens for mouse function in sketch.js
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }
  socket.on('cursor', cursorMessage);
  function cursorMessage(cursorProps) {
    io.emit('cursor', {session_id: socket.id, coords: cursorProps});
  }
  console.log(totalUsers);
}

function getID() {
  userGroup.push(++stepID);
  return stepID;
}
function addUser() {
  totalUsers++;
}
function removeUser(thisID){
    userGroup = removeFromArray(thisID,userGroup);
    totalUsers--;
}
function removeFromArray(string, array) {
  var i = 0;
  for(i in array){
    if(array[i] === string){
      array.splice(i,1);
    }
  }
  return array;
}
