const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const socketIO  = require("socket.io"); 
const io = socketIO(server);  
const Table = require('./models/tables.js');
const connectedUsers =require('./models/connectedUsers.js'); 
const allUsers = require('./models/users.js');


// when starting the serer,delete all the connected users (in case the server was not closed properly and the connected users were not deleted). 
const deleteAllConnectedUsers = async () => { 
  //delete all the connected users 
await connectedUsers.deleteMany({}).exec(); 
} 
deleteAllConnectedUsers(); 



io.on('connection', async (socket) => { 
  // add user to connected users 
  // when user connect, we want to add him to the connected users with his socket id.
  socket.on('userConnected', async(username) => { 
    const temp = new connectedUsers({ username: username, socketId: socket.id }); 
      await temp.save(); 
  }); 
 
  // if we get joinTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('joinTable', async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // if its the first player on the table, we dont want to send him the render event because he is the one that joined the table.
    if(table.playersOnTable.length > 1) {
    // Iterate over each player on the table , if its not the user that joined the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that joined the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
  }
});
  // if we get leaveTable event, we will want to send all the players on table with the given name, to render the table.
  socket.on('leaveTable', async (tableName, username) => {
    const table = await Table.findOne({ name: tableName });
    // Iterate over each player on the table , if its not the user that leave the table, send him the render event.
    for (const player of table.playersOnTable) {
      // assume nickname is unique !!!
        const user = await allUsers.findOne({ nickname: player.nickname });
        const connectedUser = await connectedUsers.findOne({ username: user.username });
        // Check if the user exists and is not the user that leave the table
        if (connectedUser.username !== username) {
           io.to(connectedUser.socketId).emit('render');
        }
    }
  });
 
   //socket.on('logout', async() => { 
     // remove user from connected users 
   //  await connectedUsers.deleteOne({ socketId: socket.id }); 
  // }); 
  
   socket.on('disconnect',async () => { 
     // remove user from connected users 
     await connectedUsers.deleteOne({ socketId: socket.id }); 
   }); 
  
   socket.on('close', async () => { 
     // Disconnect users and clean up resources here 
 }); 
 }); 




// Import the 'cors' package
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));

  });

const userRoutes = require('./routes/users.js');
const tableRoutes = require('./routes/tables.js');
// const tokenRoutes = require('./routes/token.js');


// Middleware for parsing JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Using cors middleware to enable cross-origin requests
app.use(cors());

// Connecting to MongoDB
const mongoose = require('mongoose');
// const { copyFileSync } = require('fs');
mongoose.connect("mongodb://127.0.0.1:27017/poker-noa")
  .then(() => console.log('poker-noa server is connected to MongoDB'))
  .catch((e) => console.log(e));

// app.use(express.static('../public'));


app.use('/users', userRoutes);
app.use('/tables', tableRoutes);
// app.use('/api/Chats', chatRoutes);

app.listen(process.env.PORT);

server.listen(8080);