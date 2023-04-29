import { Room } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomById(id: number): Promise<Room> {
  return prisma.room.findFirst({ where: { id } });
}

const roomRepository = {
  findRoomById,
};

export default roomRepository;
