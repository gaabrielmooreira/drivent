import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export function createBookingData(): Booking {
  const date: Date = new Date();

  return {
    id: 1,
    userId: 1,
    roomId: 1,
    createdAt: date,
    updatedAt: date,
  };
}
