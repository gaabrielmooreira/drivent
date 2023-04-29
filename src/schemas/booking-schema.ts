import { Booking } from '@prisma/client';
import Joi from 'joi';

export const bookingSchema = Joi.object<Pick<Booking, 'roomId'>>({
  roomId: Joi.number().required(),
});
