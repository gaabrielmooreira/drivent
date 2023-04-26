import { prisma } from '@/config';
import { BookIdWithRoom } from '@/services/bookings-service';

async function findBookByUserId(userId: number): Promise<BookIdWithRoom> {
  return await prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

const bookingRepository = {
  findBookByUserId,
};

export default bookingRepository;
