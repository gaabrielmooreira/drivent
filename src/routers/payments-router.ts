import { Router } from 'express';
import { getPaymentWithTicketId } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentWithTicketId);

export { paymentsRouter };
