import { io } from '../server'; // Importa o objeto `io` do servidor

export class EmitSocket {

  // Método para emitir atualizações de vaga
  emitUpdateVacancy(data: any) {
    // Emite a mensagem para todos os clientes conectados
    io.emit('vacancyUpdate', data); // 'vacancyUpdate' é o nome do evento que será enviado para os clientes
    console.log('Atualização de vaga enviada para os clientes:', data);
  }
}
