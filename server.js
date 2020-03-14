const http = require('http');
const app = require('./app');
let Player = require('./Player');

app.set('port', '3000');

const server = http.createServer(app);
server.on('listening', ()=> {
  console.log('listening on port 3000');
});

server.listen('3000', "0.0.0.0");

//web sockets
const socket = require('socket.io');
const io = socket(server);
let players = [];

//setInterval(updateGame, 1600);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection! ' + socket.id);
  //create new user
  players.push(new Player(socket.id));
  console.log(players.length);
  io.emit('heartbeat', players);
  //io.sockets.emit('connected', {connections: totalUsers});
  //socket.broadcast.emit('new user', {user: thisID, users:totalUsers});
  socket.on('disconnect', () => {
    console.log('lost player');
    io.sockets.emit('disconnect', socket.id);
    players = players.filter(player => player.id !== socket.id);
    console.log(players.length);
  });
  //this listens for mouse function in sketch.js
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }
  socket.on('cursor', cursorMessage);
  function cursorMessage(cursorProps) {
    io.emit('cursor', {id: socket.id, coords: cursorProps});
  }
}

//io.sockets.on('disconnect', socket => {
  //console.log('lost another');
  //io.sockets.emit('disconnect', socket.id);

  //players = players.filter(player.id !== socket.id);
//});

//function updateGame() {
  //io.sockets.emit('heartbeat', players);
//}
