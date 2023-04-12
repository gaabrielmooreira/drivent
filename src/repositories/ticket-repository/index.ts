import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicket } from '@/services/tickets-service';

async function findManyTicketType(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findFirstByEnrollmentId(enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
  });
}

async function findUniqueTicketTypeById(ticketTypeId: number): Promise<TicketType> {
  return prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });
}

async function create(data: CreateTicket) {
  return prisma.ticket.create({
    data,
  });
}

const ticketRepository = {
  findManyTicketType,
  findFirstByEnrollmentId,
  findUniqueTicketTypeById,
  create,
};

export default ticketRepository;
