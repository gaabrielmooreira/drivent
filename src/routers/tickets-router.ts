import { Router } from 'express';
import { getTicketTypes, getTicketsByUser, create } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTicketsByUser)
  .post('/', validateBody(createTicketSchema), create);

export { ticketsRouter };
