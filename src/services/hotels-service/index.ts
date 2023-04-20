import { Hotel, Room } from '@prisma/client';
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function checksBeforeGetHotelsOrRooms(userId: number): Promise<void> {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findFirstByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketRepository.findUniqueTicketTypeById(ticket.ticketTypeId);
  if (!ticketType || ticketType.isRemote || !ticketType.includesHotel || ticket.status !== 'PAID')
    throw paymentRequiredError();
}

async function getHotels(userId: number): Promise<Hotel[]> {
  await checksBeforeGetHotelsOrRooms(userId);

  const hotels = await hotelRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelWithRooms({ userId, hotelId }: { userId: number; hotelId: number }): Promise<HotelWithRooms> {
  await checksBeforeGetHotelsOrRooms(userId);

  const hotelWithRooms = await hotelRepository.getHotelWithRooms(hotelId);
  if (!hotelWithRooms) throw notFoundError();
  return hotelWithRooms;
}

export type HotelWithRooms = Hotel & { Rooms: Room[] };

const hotelsService = {
  getHotels,
  getHotelWithRooms,
};

export default hotelsService;
