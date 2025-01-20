import {
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class NameDto {
  @IsOptional()
  @IsString({ message: 'English name must be a string' })
  @IsNotEmpty({ message: 'English name is required if provided' })
  en?: string;

  @IsOptional()
  @IsString({ message: 'Arabic name must be a string' })
  ar?: string;
}

export class BiographyDto {
  @IsOptional()
  @IsString({ message: 'English biography must be a string' })
  @IsNotEmpty({ message: 'English biography is required if provided' })
  en?: string;

  @IsOptional()
  @IsString({ message: 'Arabic biography must be a string' })
  ar?: string;
}

export class UpdateAuthorDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NameDto)
  readonly name?: NameDto;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BiographyDto)
  readonly biography?: BiographyDto;

  @IsOptional()
  @IsString({ message: 'Profile image URL must be a string' })
  readonly profileImageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Birth date must be a valid date' })
  readonly birthDate?: Date;
}
