import { Router } from 'express';
import { getBooking, postBooking } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getBooking).post('/', validateBody(bookingSchema), postBooking);

export { bookingsRouter };
