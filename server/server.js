const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}\\..\\client`;
console.log(`Serving sttaic from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);



io.on('connection', (sock) => {
  console.log(`Someone new is here (${sock.handshake.address} || ${sock.id})`);
  sock.emit('id', sock.id);
  let beginingData = {'id': 0, 'text': 'Welcome to chat'};
  sock.emit('message', beginingData);



  sock.on('clientRequestsColors', () => {
    io.emit('serverRequestsColors');
  });

  sock.on('clientSendsColors', (rowsList) => {
    io.emit('serverSendsColors', rowsList);
  });



  sock.on('message', (data) => {
    io.emit('message', data);
  });

  sock.on('colorChange', (data) => {
    io.emit('colorChange', data);
  });

  sock.on('addColorpicker', (data) => {
    io.emit('addColorpicker', data);
  })

  sock.on('removeColorpicker', (data) => {
    io.emit('removeColorpicker', data);
  });

  sock.on('addRow', (data) => {
    io.emit('addRow', data);
  });

  sock.on('removeRow', (data) => {
    io.emit('removeRow', data);
  });
});

server.on('error', (err) => {
  console.log('Server error: ', err);
});

let port = 8080;

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
