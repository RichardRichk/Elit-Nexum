require('dotenv').config({ path: './config.env' });
const express = require('express');
const http = require('http');
const cors = require('cors'); // Importa o pacote cors
const connectDB = require('./utils/connectDB');
const app = express();
app.use(cors());
app.use(express.json());
const server = http.Server(app);
const HOST = '172.16.39.98';
const PORT = 3001;
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require('./utils/sockets');
const {
  loadMessages,
  sendMessage,
  setMessageToUnread,
  setMessageToRead,
} = require('./utils/chat');

// Conecta ao banco de dados
connectDB();

io.on('connection', (socket) => {
  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    await setMessageToRead(userId);
    setInterval(() => {
      socket.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);
    if (!error) {
      socket.emit('messagesLoaded', { chat });
    } else {
      socket.emit('noChatFound');
    }
  });

  socket.on('newMessage', async ({ userId, receiver, message }) => {
    const { newMessage, error } = await sendMessage(userId, receiver, message);
    const receiverSocket = await findConnectedUser(receiver);
    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit('newMessageReceived', { newMessage });
    } else {
      await setMessageToUnread(receiver);
    }
    if (!error) {
      socket.emit('messageSent', { newMessage });
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

// Rotas da API
app.use('/api/search', require('./controllers/search'));
app.use('/api/signup', require('./controllers/signup'));
app.use('/api/onboarding', require('./controllers/onboarding'));
app.use('/api/auth', require('./controllers/auth'));
app.use('/api/posts', require('./controllers/posts'));
app.use('/api/profile', require('./controllers/profile'));
app.use('/api/notifications', require('./controllers/notifications'));
app.use('/api/chats', require('./controllers/chats'));
app.use('/api/badges', require('./controllers/badges'));
app.use('/api/stats', require('./controllers/stats'));
app.use('/api/comments', require('./controllers/comments'));
app.use('/api/recommendations', require('./controllers/recommendations'));

// Inicia o servidor
server.listen(PORT, HOST, (err) => {
  if (err) throw err;
  console.log(`Servidor Express em execução em http://${HOST}:${PORT}`);
});