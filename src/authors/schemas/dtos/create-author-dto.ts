import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

class LocalizedStringDto {
  @IsNotEmpty({ message: 'English value is required' })
  @IsString({ message: 'English value must be a string' })
  en: string;

  @IsOptional()
  @IsString({ message: 'Arabic value must be a string' })
  ar?: string;
}

export class CreateAuthorDto {
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  readonly name: LocalizedStringDto;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @ValidateNested()
  @Type(() => LocalizedStringDto)
  readonly biography: LocalizedStringDto;

  @IsOptional()
  @IsString({ message: 'Profile image URL must be a string' })
  readonly profileImageUrl?: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Birth date must be a valid date' })
  readonly birthDate: Date;
}
