const fs = require('fs');
const path = require('path');

class Ticket {
    constructor(id, escritorio) {
        this.id = id;
        this.escritorio = escritorio;
        this.estado = 'pendiente'; // pendiente, en_atención, resuelto
        this.creadoEn = new Date();
    }
}

class TicketManager {
    constructor() {
        this.tickets = [];
        this.ultimoId = 0;
        this.filePath = path.join(__dirname, '../data/tickets.json'); 
        this.cargarTickets();
    }

    cargarTickets() {
        if (fs.existsSync(this.filePath)) {
            try {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                const { tickets, ultimoId } = JSON.parse(data);
                this.tickets = tickets.map(t => new Ticket(t.id, t.escritorio));
                this.ultimoId = ultimoId;
            } catch (error) {
                console.error('Error cargando tickets:', error);
            }
        }
    }

    guardarTickets() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify({ tickets: this.tickets, ultimoId: this.ultimoId }, null, 2));
        } catch (error) {
            console.error('Error guardando tickets:', error);
        }
    }

    crearTicket(escritorio) {
        this.ultimoId++;
        const nuevoTicket = new Ticket(this.ultimoId, escritorio);
        this.tickets.push(nuevoTicket);
        this.guardarTickets();
        return nuevoTicket;
    }

    asignarTicket(escritorio) {
        const ticketPendiente = this.tickets.find(t => t.estado === 'pendiente');
        if (ticketPendiente) {
            ticketPendiente.estado = 'en_atención';
            ticketPendiente.escritorio = escritorio;
            this.guardarTickets();
            return ticketPendiente;
        }
        return null;
    }

    resolverTicket(id) {
        const ticket = this.tickets.find(t => t.id === id);
        if (ticket) {
            ticket.estado = 'resuelto';
            this.guardarTickets();
            return ticket;
        }
        return null;
    }

    obtenerTicketsPendientes() {
        return this.tickets.filter(t => t.estado === 'pendiente');
    }
}

module.exports = new TicketManager();