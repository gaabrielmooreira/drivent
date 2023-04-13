import { ApplicationError } from '@/protocols';

export function ticketNotSended(): ApplicationError {
  return {
    name: 'BadRequest',
    message: 'Ticket not sended in query params!',
  };
}
