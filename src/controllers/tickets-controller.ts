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

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const ticket = await ticketsService.getTicketsByUser(userId);
    return res.send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function create(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketTypeId = req.body.ticketTypeId as number;
  try {
    const ticket = await ticketsService.create({ userId, ticketTypeId });
    return res.status(201).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
