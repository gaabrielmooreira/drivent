import { Booking } from '@prisma/client';
import { prisma } from '@/config';
import { BookIdWithRoom } from '@/services/bookings-service';

async function create(data: Pick<Booking, 'userId' | 'roomId'>): Promise<Booking> {
  return prisma.booking.create({ data });
}

async function findBookByUserId(userId: number): Promise<BookIdWithRoom> {
  return await prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function update(bookingId: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId,
    },
  });
}

async function countBookingsByRoomId(roomId: number): Promise<number> {
  return await prisma.booking.count({ where: { roomId } });
}

const bookingRepository = {
  findBookByUserId,
  countBookingsByRoomId,
  create,
  update,
};

export default bookingRepository;
