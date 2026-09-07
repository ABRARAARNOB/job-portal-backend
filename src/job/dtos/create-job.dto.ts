import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Software Engineer',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Google',
  })
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Develop scalable backend APIs.',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(()=> Number)
  @ApiProperty({
    example: 60000,
  })
  salary: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Dhaka',
    required: false,
  })
  location: string;
}