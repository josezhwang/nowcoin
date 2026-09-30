import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export const TOPICS = ['sales', 'partnership', 'support', 'press', 'other'] as const;

export class SubscribeDto {
  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class ContactDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @IsIn(TOPICS)
  topic: (typeof TOPICS)[number];

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  message: string;
}
