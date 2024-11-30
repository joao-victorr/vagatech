import { Socket } from "socket.io";

export const handleSocketConnection = (socket: Socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // socket.broadcast.emit('')

    // Lida com a desconexão do cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
};
