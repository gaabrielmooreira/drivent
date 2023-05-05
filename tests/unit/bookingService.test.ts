import { createBookingData } from '../factories';
import bookingsService, { BookIdWithRoom } from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import roomRepository from '@/repositories/room-repository';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('getBooking', () => {
  it('should return booking', async () => {
    const date: Date = new Date();
    const booking: BookIdWithRoom = {
      id: 1,
      Room: {
        id: 2,
        name: 'room 123213',
        capacity: 3,
        hotelId: 5,
        createdAt: date,
        updatedAt: date,
      },
    };

    jest.spyOn(bookingRepository, 'findBookByUserId').mockImplementationOnce((): any => {
      return booking;
    });

    const order = await bookingsService.getBooking(1);

    expect(order.id).toBe(booking.id);
    expect(order.Room).toBe(booking.Room);
  });

  it('should does not return booking if there is no booking for this userId', async () => {
    jest.spyOn(bookingRepository, 'findBookByUserId').mockImplementationOnce((): any => {
      return undefined;
    });

    expect(bookingsService.getBooking(1)).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('create', () => {
  it('should create booking', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    const order = await bookingsService.create(1, 1);

    expect(order.bookingId).toBe(booking.id);
  });

  it('should not create booking if enrollment does not exist', async () => {
    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return false;
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not have an enrollment',
    });
  });

  it('should not create booking if ticket does not exist', async () => {
    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not have a ticket yet',
    });
  });

  it('should not create booking if ticket is not paid', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not pay the ticket',
    });
  });

  it('should not create booking if ticketType does not exist', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not create booking if ticketType is remote', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not create booking if ticketType does not include hotel', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not create booking if room does not exist', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not create booking if room is not available', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 3;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.create(1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This room is not available',
    });
  });
});

describe('update', () => {
  it('should update booking', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = {
      id: 1,
    };

    jest.spyOn(bookingRepository, 'findBookByUserId').mockImplementationOnce((): any => {
      return booking;
    });

    jest.spyOn(bookingRepository, 'update').mockImplementationOnce((): any => {
      return booking;
    });

    const order = await bookingsService.update(1, 1, 1);

    expect(order.bookingId).toBe(1);
  });

  it('should not update booking if enrollment does not exist', async () => {
    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return false;
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not have an enrollment',
    });
  });

  it('should not update booking if ticket does not exist', async () => {
    jest.spyOn(enrollmentRepository, 'findByUserId').mockImplementationOnce((): any => {
      return {
        id: 1,
      };
    });

    jest.spyOn(ticketRepository, 'findFirstByEnrollmentId').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not have a ticket yet',
    });
  });

  it('should not update booking if ticket is not paid', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'User does not pay the ticket',
    });
  });

  it('should not update booking if ticketType does not exist', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not update booking if ticketType is remote', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not update booking if ticketType does not include hotel', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This ticket does not include hotel',
    });
  });

  it('should not update booking if room does not exist', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should not update booking if room is not available', async () => {
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

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 3;
    });

    const booking = createBookingData();
    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'This room is not available',
    });
  });

  it('should not update booking if booking does not exist', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = {
      id: 1,
    };

    jest.spyOn(bookingRepository, 'findBookByUserId').mockImplementationOnce((): any => {
      return false;
    });

    jest.spyOn(bookingRepository, 'update').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'No Permission for this operation.',
    });
  });

  it('should not update booking if booking does not exist', async () => {
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

    jest.spyOn(ticketRepository, 'findUniqueTicketTypeById').mockImplementationOnce((): any => {
      return {
        isRemote: false,
        includesHotel: true,
      };
    });

    jest.spyOn(roomRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });

    jest.spyOn(bookingRepository, 'countBookingsByRoomId').mockImplementationOnce((): any => {
      return 2;
    });

    const booking = {
      id: 1,
    };

    jest.spyOn(bookingRepository, 'findBookByUserId').mockImplementationOnce((): any => {
      return { id: 5 };
    });

    jest.spyOn(bookingRepository, 'update').mockImplementationOnce((): any => {
      return booking;
    });

    expect(bookingsService.update(1, 1, 1)).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'No Permission for this operation.',
    });
  });
});
