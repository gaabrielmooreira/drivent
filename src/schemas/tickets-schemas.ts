import { Ticket } from '@prisma/client';
import Joi from 'joi';

export const createTicketSchema = Joi.object<Pick<Ticket, 'ticketTypeId'>>({
  ticketTypeId: Joi.number().required(),
});
