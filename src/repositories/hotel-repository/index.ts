import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelWithRooms } from '@/services/hotels-service';

async function getHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

async function getHotelWithRooms(hotelId: number): Promise<HotelWithRooms> {
  return await prisma.hotel.findFirst({
    where: { id: hotelId },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: true,
    },
  });
}

const hotelRepository = {
  getHotels,
  getHotelWithRooms,
};

export default hotelRepository;
