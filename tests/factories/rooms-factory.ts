import faker from '@faker-js/faker';

import { Room } from '@prisma/client';
import { prisma } from '@/config';

export function createRoom(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}
