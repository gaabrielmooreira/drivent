import faker from '@faker-js/faker';
import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

export function createHotel(params: Partial<Hotel> = {}) {
  return prisma.hotel.create({
    data: {
      name: params.name || faker.name.findName(),
      image: params.image || faker.image.imageUrl(),
    },
  });
}
