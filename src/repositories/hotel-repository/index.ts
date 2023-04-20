import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

const hotelRepository = {
  getHotels,
};

export default hotelRepository;
