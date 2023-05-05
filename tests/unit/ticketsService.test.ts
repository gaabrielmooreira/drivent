import { Ticket, TicketType } from '@prisma/client';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import ticketsService from '@/services/tickets-service';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('getTicketTypes', () => {
  it('should return ticket types', async () => {
    const date: Date = new Date();
    const ticketTypes: TicketType[] = [
      {
        id: 1,
        name: 'A',
        price: 50,
        isRemote: true,
        includesHotel: false,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 2,
        name: 'B',
        price: 100,
        isRemote: false,
        includesHotel: true,
        createdAt: date,
        updatedAt: date,
      },
    ];

    jest.spyOn(ticketRepository, 'findManyTicketType').mockImplementationOnce((): any => {
      return ticketTypes;
    });

    const order = await ticketsService.getTicketTypes();
    expect(order).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          isRemote: expect.any(Boolean),
          includesHotel: expect.any(Boolean),
          createdAt: date,
          updatedAt: date,
        }),
      ]),
    );
  });
});

describe('getTicketsByUser', () => {
  it('should return ticket with type', async () => {
    const userId = 1;
    const date: Date = new Date();
    const ticket: Ticket = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: 1,
      status: 'RESERVED',
      createdAt: date,
      updatedAt: date,
    };
    const ticketType: TicketType = {
      id: 1,
      name: 'Superior',
      price: 50,
      isRemote: false,
      includesHotel: true,
      createdAt: date,
      updatedAt: date,
    };

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return ticket;
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return ticketType;
    });

    const order = await ticketsService.getTicketsByUser(userId);
    expect(order).toEqual({
      id: ticket.id,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      TicketType: {
        id: ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        isRemote: ticketType.isRemote,
        includesHotel: ticketType.includesHotel,
        createdAt: ticketType.createdAt,
        updatedAt: ticketType.updatedAt,
      },
    });
  });

  it('should not return ticket with type if enrollment does not exist', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return undefined;
    });

    const order = ticketsService.getTicketsByUser(userId);
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return ticket with type if ticket does not exist', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return undefined;
    });

    const order = ticketsService.getTicketsByUser(userId);
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('create', () => {
  it('should create a ticket', async () => {
    const userId = 1;
    const ticketTypeId = 1;
    const date: Date = new Date();
    const ticket: Ticket = {
      id: 1,
      ticketTypeId,
      enrollmentId: 1,
      status: 'RESERVED',
      createdAt: date,
      updatedAt: date,
    };
    const ticketType: TicketType = {
      id: 1,
      name: 'Superior',
      price: 50,
      isRemote: false,
      includesHotel: true,
      createdAt: date,
      updatedAt: date,
    };

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementation((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return ticket;
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return ticketType;
    });

    jest.spyOn(ticketRepository, 'create').mockReturnValue(undefined);

    const order = await ticketsService.create({ userId, ticketTypeId });
    expect(order).toEqual({
      id: ticket.id,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      TicketType: {
        id: ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        isRemote: ticketType.isRemote,
        includesHotel: ticketType.includesHotel,
        createdAt: ticketType.createdAt,
        updatedAt: ticketType.updatedAt,
      },
    });
  });

  it('should not create a ticket if enrollment does not exist', async () => {
    const userId = 1;
    const ticketTypeId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return undefined;
    });

    const order = ticketsService.create({ userId, ticketTypeId });
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
