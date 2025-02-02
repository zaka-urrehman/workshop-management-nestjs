import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // You can later replace 'any' with your specific user type.
}