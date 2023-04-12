import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findManyTicketType(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

const ticketRepository = {
  findManyTicketType,
};

export default ticketRepository;
