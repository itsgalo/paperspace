const http = require('http');
const express = require('express');

const app = express();
app.use(express.static('public'));
app.set('port', '3000');

const server = http.createServer(app);
server.on('listening', ()=> {
  console.log('listening on port 3000');
});

server.listen('3000');

//web sockets
const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  //this listens for mouse function in sketch.js
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }
}