import { BadRequestException } from '@nestjs/common';

export class AlreadyAppliedException extends BadRequestException {
  constructor() {
    super('You have already applied for this job');
  }
}

