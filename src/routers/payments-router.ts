import { Router } from 'express';
import { getPaymentWithTicketId, postPayment } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentInputSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentWithTicketId)
  .post('/process', validateBody(paymentInputSchema), postPayment);

export { paymentsRouter };
