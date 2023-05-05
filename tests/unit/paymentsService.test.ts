import { Payment } from '@prisma/client';
import { PaymentInput } from '../../src/protocols';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import paymentsService from '@/services/payments-service';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('findByTicketId', () => {
  it('should return payment', async () => {
    const ticketId = 1;
    const userId = 2;
    const date: Date = new Date();

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return {
        Enrollment: { userId },
      };
    });

    jest.spyOn(paymentRepository, 'findByTicketId').mockImplementationOnce((): any => {
      const payment: Payment = {
        id: 1,
        ticketId: 1,
        value: 50,
        cardIssuer: 'VISA',
        cardLastDigits: '7777',
        createdAt: date,
        updatedAt: date,
      };
      return payment;
    });

    const order = await paymentsService.findByTicketId({ ticketId, userId });
    expect(order).toHaveProperty('id');
    expect(order.ticketId).toBe(ticketId);
  });

  it('should not return payment if ticketId does not send', async () => {
    const userId = 2;
    expect(paymentsService.findByTicketId({ ticketId: undefined, userId })).rejects.toEqual({
      name: 'BadRequest',
      message: 'Ticket not sended in query params!',
    });
  });

  it('should not return payment if ticket not found', async () => {
    const ticketId = 1;
    const userId = 2;

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return false;
    });

    expect(paymentsService.findByTicketId({ ticketId, userId })).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return payment if enrollment userId is not equal to userId', async () => {
    const ticketId = 1;
    const userId = 2;

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return {
        Enrollment: { userId: 3 },
      };
    });

    const order = paymentsService.findByTicketId({ ticketId, userId });
    expect(order).rejects.toEqual({
      name: 'UnauthorizedError',
      message: 'You must be signed in to continue',
    });
  });
});

describe('create', () => {
  it('should create a payment', async () => {
    const userId = 2;
    const date: Date = new Date();
    const paymentInput: PaymentInput = {
      ticketId: 1,
      cardData: {
        issuer: 'VISA',
        number: 7777777777777777,
        name: 'GABRIEL',
        expirationDate: date,
        cvv: 155,
      },
    };

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return {
        TicketType: {
          value: 50,
        },
        Enrollment: {
          userId: 2,
        },
      };
    });

    jest.spyOn(paymentRepository, 'create').mockImplementationOnce((): any => {
      return {
        id: 1,
        ticketId: paymentInput.ticketId,
        value: 50,
        cardIssuer: paymentInput.cardData.issuer,
        cardLastDigits: paymentInput.cardData.number.toString().slice(-4),
        createdAt: date,
        updatedAt: date,
      };
    });

    jest.spyOn(ticketRepository, 'updateStatus').mockReturnValue(null);

    const order = await paymentsService.create({ paymentInput, userId });
    expect(order).toHaveProperty('id');
    expect(order.ticketId).toBe(paymentInput.ticketId);
    expect(order.cardIssuer).toBe(paymentInput.cardData.issuer);
  });

  it('should not create a payment if ticket does not exist', async () => {
    const userId = 2;
    const date: Date = new Date();
    const paymentInput: PaymentInput = {
      ticketId: 1,
      cardData: {
        issuer: 'VISA',
        number: 7777777777777777,
        name: 'GABRIEL',
        expirationDate: date,
        cvv: 155,
      },
    };

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(paymentRepository, 'create').mockImplementationOnce((): any => {
      return {
        id: 1,
        ticketId: paymentInput.ticketId,
        value: 50,
        cardIssuer: paymentInput.cardData.issuer,
        cardLastDigits: paymentInput.cardData.number.toString().slice(-4),
        createdAt: date,
        updatedAt: date,
      };
    });

    jest.spyOn(ticketRepository, 'updateStatus').mockReturnValue(null);

    expect(paymentsService.create({ paymentInput, userId })).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not create a payment if enrollment userId is not equal to userId', async () => {
    const userId = 3;
    const date: Date = new Date();
    const paymentInput: PaymentInput = {
      ticketId: 1,
      cardData: {
        issuer: 'VISA',
        number: 7777777777777777,
        name: 'GABRIEL',
        expirationDate: date,
        cvv: 155,
      },
    };

    jest.spyOn(ticketRepository, 'findTicketAllInfo').mockImplementationOnce((): any => {
      return {
        TicketType: {
          value: 50,
        },
        Enrollment: {
          userId: 2,
        },
      };
    });

    jest.spyOn(paymentRepository, 'create').mockImplementationOnce((): any => {
      return {
        id: 1,
        ticketId: paymentInput.ticketId,
        value: 50,
        cardIssuer: paymentInput.cardData.issuer,
        cardLastDigits: paymentInput.cardData.number.toString().slice(-4),
        createdAt: date,
        updatedAt: date,
      };
    });

    jest.spyOn(ticketRepository, 'updateStatus').mockReturnValue(null);

    expect(paymentsService.create({ paymentInput, userId })).rejects.toEqual({
      name: 'UnauthorizedError',
      message: 'You must be signed in to continue',
    });
  });
});
