import faker from '@faker-js/faker';

import { Room } from '@prisma/client';
import { prisma } from '@/config';

export function createRoom({ hotelId, capacity }: { hotelId: number; capacity?: number }): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.datatype.string(),
      capacity: capacity ? capacity : faker.datatype.number({ min: 1 }),
      hotelId,
    },
  });
}
