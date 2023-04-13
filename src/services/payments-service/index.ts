import { Payment } from '@prisma/client';
import { notFoundError, ticketNotSended, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function findByTicketId({ ticketId, userId }: { ticketId: number; userId: number }): Promise<Payment> {
  if (!ticketId) throw ticketNotSended();

  const ticket = await ticketRepository.findById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
  if (!enrollment) throw notFoundError();
  if (enrollment.userId !== userId) throw unauthorizedError();

  return await paymentRepository.findByTicketId(ticketId);
}

const paymentsService = {
  findByTicketId,
};

export default paymentsService;
