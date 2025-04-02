const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const socketController = (socket) => { 
    
    console.log('🟢 Cliente conectado: ', + socket.id);
    socket.emit('ultimo-ticket', ticketControl.ultimo);

    socket.on('siguiente-ticket', (payload, callback)=> {
        console.log('🎫 -> siguiente-ticket ', payload);

        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('disconnect', ()=> {
        console.log('Ciente desconectado 🔴', socket.id);
    });

    socket.on('enviar mensaje', (payload, callback)=> {

        const cliente = socket.handshake.headers['sec-ch-ua'];  // O cualquier otro dato como `socket.id`
        const mensaje = {
            cliente,
            fecha: payload.fecha,
            hora: payload.hora,
            descripcion: payload.data
        };
        
        console.log('💻 ->', payload);
        const id = 1234;
        callback(id);

        socket.broadcast.emit('res-ser', payload);

    });
    
};

module.exports = {
    socketController
}