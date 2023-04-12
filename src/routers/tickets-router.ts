import { Router } from 'express';
import { getTicketTypes, getTicketsByUser } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getTicketsByUser);

export { ticketsRouter };
