import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { router } from './Routers/router';
import { handleSocketConnection } from './Routers/routerSocket';
import cors from 'cors';

dotenv.config();

const app = express();


app.use(cors({ origin: '*', methods: ['GET', 'POST']}));

const httpServer = createServer(app); // Cria o servidor HTTP
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Configurar para permitir o front-end (atualize conforme necessário)
    methods: ['GET', 'POST']
  }
}); // Cria o servidor WebSocket associado ao HTTP

// Middleware do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas HTTP normais
app.use(router);

// Inicializa o WebSocket e lida com conexões
io.on('connection', (socket) => {
  handleSocketConnection(socket);
});

// Inicia o servidor HTTP e WebSocket
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


