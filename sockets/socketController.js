const TicketManager = require('../models/ticketManager');

const socketController = (socket) => { 
    console.log('🟢 Cliente conectado: ', socket.handshake.headers['sec-ch-ua']);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado 🔴', socket.id);
    });

    socket.on('enviar mensaje', (payload, callback) => {
        const cliente = socket.handshake.headers['sec-ch-ua'];
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

    // Gestión de tickets
    socket.on('nuevo-ticket', (payload, callback) => {
        const ticket = TicketManager.crearTicket(payload.escritorio);
        callback(ticket);
        socket.broadcast.emit('ticket-creado', ticket);
    });

    socket.on('asignar-ticket', (payload, callback) => {
        const ticket = TicketManager.asignarTicket(payload.escritorio);
        callback(ticket);
        socket.broadcast.emit('ticket-asignado', ticket);
    });

    socket.on('resolver-ticket', (payload, callback) => {
        const ticket = TicketManager.resolverTicket(payload.id);
        callback(ticket);
        socket.broadcast.emit('ticket-resuelto', ticket);
    });

    socket.on('tickets-pendientes', (callback) => {
        const pendientes = TicketManager.obtenerTicketsPendientes();
        callback(pendientes);
    });
};

module.exports = {
    socketController
};