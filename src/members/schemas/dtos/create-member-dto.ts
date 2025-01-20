import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDate,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  readonly username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Birth date must be a valid date' })
  readonly birthDate: Date;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  readonly password: string;
}
