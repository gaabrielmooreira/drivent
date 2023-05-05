import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';
import hotelsService from '@/services/hotels-service';

describe('getHotels', () => {
  it('should return hotels', async () => {
    const userId = 1;
    const date: Date = new Date();

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(hotelRepository, 'getHotels').mockImplementationOnce((): any => {
      return [
        {
          id: 1,
          name: 'AAA',
          image: 'askpdsakpadkas',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        },
        {
          id: 2,
          name: 'BBB',
          image: 'ASDASDAS',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        },
      ];
    });

    const order = await hotelsService.getHotels(userId);
    expect(order).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });

  it('should not return hotels if enrollment does not exist', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return hotels if ticket does not exist', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return hotels if ticket status is not equal to PAID', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'RESERVED',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels if ticketType does not exist', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels if ticketType is Remote', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: true,
        includesHotel: true,
      };
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels if ticketType does not include hotel', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: false,
      };
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels if there is no one hotel', async () => {
    const userId = 1;
    const date: Date = new Date();

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(hotelRepository, 'getHotels').mockImplementationOnce((): any => {
      return [];
    });

    const order = hotelsService.getHotels(userId);
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('getHotelWithRooms', () => {
  it('should return hotel with rooms', async () => {
    const userId = 1;
    const hotelId = 1;
    const date: Date = new Date();

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(hotelRepository, 'getHotelWithRooms').mockImplementationOnce((): any => {
      return [
        {
          id: 1,
          name: 'AAA',
          image: 'askpdsakpadkas',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
          Room: [
            {
              id: 1,
              name: 'A1',
              capacity: 4,
              hotelId: 1,
              createdAt: date.toISOString(),
              updatedAt: date.toISOString(),
            },
            {
              id: 2,
              name: 'A2',
              capacity: 3,
              hotelId: 1,
              createdAt: date.toISOString(),
              updatedAt: date.toISOString(),
            },
          ],
        },
      ];
    });

    const order = await hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).toEqual([
      {
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Room: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      },
    ]);
  });

  it('should not return hotel with rooms if enrollment does not exist', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return hotel with rooms if ticket does not exist', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not return hotel with rooms if ticket status is not equal to PAID', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'RESERVED',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotel with rooms if ticketType does not exist', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return false;
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels with rooms if ticketType is Remote', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: true,
        includesHotel: true,
      };
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotels if ticketType does not include hotel', async () => {
    const userId = 1;
    const hotelId = 1;

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: false,
      };
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'PaymentRequiredError',
      message: 'Payment is required!',
    });
  });

  it('should not return hotel with rooms if there is no one hotel with this hotelId', async () => {
    const userId = 1;
    const hotelId = 1;
    const date: Date = new Date();

    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return {
        ticketTypeId: 1,
        status: 'PAID',
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(hotelRepository, 'getHotelWithRooms').mockImplementationOnce((): any => {
      return undefined;
    });

    const order = hotelsService.getHotelWithRooms({ userId, hotelId });
    expect(order).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
