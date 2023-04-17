import { Ticket, TicketStatus, TicketType } from '@prisma/client';
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

async function updateStatus(ticketId: number, status: TicketStatus): Promise<Ticket> {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
  });
}

async function findTicketAllInfo(ticketId: number) {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
      Enrollment: true,
    },
    where: {
      id: ticketId,
    },
  });
}

const ticketRepository = {
  findManyTicketType,
  findFirstByEnrollmentId,
  findUniqueTicketTypeById,
  create,
  updateStatus,
  findTicketAllInfo,
};

export default ticketRepository;
