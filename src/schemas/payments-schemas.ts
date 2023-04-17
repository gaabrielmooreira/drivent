import Joi from 'joi';
import { CardData, PaymentInput } from '@/protocols';

export const paymentInputSchema = Joi.object<PaymentInput>({
  ticketId: Joi.number().required(),
  cardData: Joi.object<CardData>({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string()
      .regex(/^(0?[1-9]|1[0-2])\/[0-9]{4}$/)
      .required(),
    cvv: Joi.number().required(),
  }).required(),
});
