import { Booking, Room } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import roomRepository from '@/repositories/room-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function verifyPermissionBooking(userId: number, roomId: number): Promise<void> {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw forbiddenError('User does not have an enrollment');

  const ticket = await ticketRepository.findFirstByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError('User does not have a ticket yet');
  if (ticket.status !== 'PAID') throw forbiddenError('User does not pay the ticket');

  const ticketType = await ticketRepository.findUniqueTicketTypeById(ticket.ticketTypeId);
  if (!ticketType || ticketType.isRemote || !ticketType.includesHotel)
    throw forbiddenError('This ticket does not include hotel');

  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const countBookingsByRoomId = await bookingRepository.countBookingsByRoomId(roomId);
  if (countBookingsByRoomId === room.capacity) throw forbiddenError('This room is not available');
}

async function verifyUserBooking(userId: number, bookingId: number): Promise<void> {
  const booking = await bookingRepository.findBookByUserId(userId);
  if (!booking || booking.id !== bookingId) throw forbiddenError('No Permission for this operation.');
}

async function getBooking(userId: number): Promise<BookIdWithRoom> {
  const booking = await bookingRepository.findBookByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function create(userId: number, roomId: number): Promise<{ bookingId: number }> {
  await verifyPermissionBooking(userId, roomId);

  const booking = await bookingRepository.create({ userId, roomId });

  return { bookingId: booking.id };
}

async function update(userId: number, roomId: number, bookingId: number): Promise<{ bookingId: number }> {
  await verifyPermissionBooking(userId, roomId);

  await verifyUserBooking(userId, bookingId);

  const booking = await bookingRepository.update(bookingId, roomId);

  return { bookingId: booking.id };
}

export type BookIdWithRoom = Pick<Booking, 'id'> & { Room: Room };

const bookingsService = {
  getBooking,
  create,
  update,
};

export default bookingsService;
