import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketsService.getTicketTypes();
    return res.send(types);
  } catch (error) {
    return console.log(error);
  }
}
