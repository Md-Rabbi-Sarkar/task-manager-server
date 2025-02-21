// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const { connectDB, getDB } = require('./config/db.js'); 
// const taskRoutes = require('./routes/taskRoutes.js');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });

// // Middlewa
// app.use(cors({ origin: '*' }));
// app.use(express.json());

// // Database Connection 
// connectDB()
//   .then(() => {
//     console.log("✅ Database connection successful");

//     // DB is connected
//     const db = getDB();
//     console.log("📂 Database instance ready:", db.databaseName);

//     // Routes
//     app.use('/api/tasks', taskRoutes(io));

    
//     const PORT = process.env.PORT || 5000;
//     app.get('/api', (req, res) => res.send('API is running...'));
//     server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error(" Database connection failed:", err);
//   });

// // Socket.io
// io.on('connection', (socket) => {
//   console.log('🔗 User connected:', socket.id);
//   socket.on('disconnect', () => console.log(' User disconnected:', socket.id));
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, getDB } = require('./config/db.js');
const taskRoutes = require('./routes/taskRoutes.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database Connection
connectDB()
  .then(() => {
    console.log("✅ Database connection successful");

    // DB is connected
    const db = getDB();
    console.log("📂 Database instance ready:", db.databaseName);

    // Routes
    app.use('/api/tasks', taskRoutes(io));

    // Default route
    app.get('/', (req, res) => res.send('API is running...'));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// Socket.io setup
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ User disconnected:', socket.id));
});
