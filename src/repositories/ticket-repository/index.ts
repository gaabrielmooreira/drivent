import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

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

const ticketRepository = {
  findManyTicketType,
  findFirstByEnrollmentId,
  findUniqueTicketTypeById,
};

export default ticketRepository;
