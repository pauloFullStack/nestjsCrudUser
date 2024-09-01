import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // if (req.params.id.length !== 24) {
    //   throw new BadRequestException('ID inválido.');
    // }
    next();
  }
}
