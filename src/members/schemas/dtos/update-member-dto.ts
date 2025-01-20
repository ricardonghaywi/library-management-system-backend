import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMemberDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  readonly name?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  readonly username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Birth date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Birth date must be a valid date' })
  readonly birthDate?: Date;
}
