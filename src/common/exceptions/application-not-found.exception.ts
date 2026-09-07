import { NotFoundException } from '@nestjs/common';

export class ApplicationNotFoundException extends NotFoundException {
  constructor() {
    super('Application not found');
  }
}