import { ForbiddenException } from '@nestjs/common';

export class UnauthorizedRecruiterException extends ForbiddenException {
  constructor() {
    super('You are not allowed to perform this action');
  }
}