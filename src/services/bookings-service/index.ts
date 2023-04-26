import { Booking, Room } from '@prisma/client';
import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBooking(userId: number): Promise<BookIdWithRoom> {
  const booking = await bookingRepository.findBookByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

export type BookIdWithRoom = Pick<Booking, 'id'> & { Room: Room };

const bookingsService = {
  getBooking,
};

export default bookingsService;
