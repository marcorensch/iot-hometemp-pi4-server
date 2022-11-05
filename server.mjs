import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const server = express();
const httpServer = createServer(server);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8080',
    }
});
server.use(cors());
const port = 3000;

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.get('/', (req, res) => {
    res.json({ message: 'hello from the Back' })
});