import { ApplicationError } from '@/protocols';

export function noContentError(): ApplicationError {
  return {
    name: 'NoContent',
    message: 'No Content for this search!',
  };
}
