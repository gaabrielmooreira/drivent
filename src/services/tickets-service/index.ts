import { Ticket, TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes(): Promise<TicketType[]> {
  const tickets = await ticketRepository.findManyTicketType();
  return tickets;
}

async function getTicketsByUser(userId: number): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketRepository.findFirstByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  const ticketType = await ticketRepository.findUniqueTicketTypeById(ticket.ticketTypeId);

  const ticketWithType = { ...ticket, TicketType: ticketType };
  return ticketWithType;
}

export type TicketWithTicketType = Ticket & { TicketType: TicketType };

const ticketsService = {
  getTicketTypes,
  getTicketsByUser,
};

export default ticketsService;
