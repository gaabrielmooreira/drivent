import { Payment } from '@prisma/client';
import { notFoundError, ticketNotSended, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { PaymentInput } from '@/protocols';

async function findByTicketId({ ticketId, userId }: { ticketId: number; userId: number }): Promise<Payment> {
  if (!ticketId) throw ticketNotSended();
  const ticket = await ticketRepository.findTicketAllInfo(ticketId);
  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  return await paymentRepository.findByTicketId(ticketId);
}

async function create({ paymentInput, userId }: { paymentInput: PaymentInput; userId: number }) {
  const ticket = await ticketRepository.findTicketAllInfo(paymentInput.ticketId);
  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const cardLastDigits = paymentInput.cardData.number.toString().slice(-4);

  const result = await paymentRepository.create({
    ticketId: paymentInput.ticketId,
    value: ticket.TicketType.price,
    cardIssuer: paymentInput.cardData.issuer,
    cardLastDigits,
  });

  await ticketRepository.updateStatus(paymentInput.ticketId, 'PAID');

  return result;
}

const paymentsService = {
  findByTicketId,
  create,
};

export default paymentsService;
