import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const tickets = await ticketRepository.findManyTicketType();
  return tickets;
}

const ticketsService = {
  getTicketTypes,
};

export default ticketsService;
