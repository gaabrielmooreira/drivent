import { Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';
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

async function create({ userId, ticketTypeId }: CreateTicketParams): Promise<TicketWithTicketType> {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const createTicket: CreateTicket = {
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    status: 'RESERVED',
  };

  await ticketRepository.create(createTicket);

  return getTicketsByUser(userId);
}

export type TicketWithTicketType = Ticket & { TicketType: TicketType };

export type CreateTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateTicketParams = { userId: number; ticketTypeId: number };

const ticketsService = {
  getTicketTypes,
  getTicketsByUser,
  create,
};

export default ticketsService;
