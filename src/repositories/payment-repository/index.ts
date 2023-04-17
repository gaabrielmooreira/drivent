import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findByTicketId(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
  return prisma.payment.create({ data });
}

const paymentRepository = {
  findByTicketId,
  create,
};

export default paymentRepository;
