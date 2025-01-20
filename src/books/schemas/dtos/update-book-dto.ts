import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsMongoId,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TitleDescriptionDto {
  @IsNotEmpty({ message: 'English text is required' })
  @IsString({ message: 'English text must be a string' })
  en: string;

  @IsOptional()
  @IsString({ message: 'Arabic text must be a string' })
  ar?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TitleDescriptionDto)
  readonly title?: TitleDescriptionDto;

  @IsOptional()
  @IsString({ message: 'ISBN must be a string' })
  readonly isbn?: string;

  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  readonly genre?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TitleDescriptionDto)
  readonly description?: TitleDescriptionDto;

  @IsOptional()
  @IsNumber({}, { message: 'Number of available copies must be a number' })
  readonly numberOfAvailableCopies?: number;

  @IsOptional()
  @IsBoolean({ message: 'Is borrowable must be a boolean' })
  readonly isBorrowable?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Number of borrowable days must be a number' })
  readonly numberOfBorrowableDays?: number;

  @IsOptional()
  @IsBoolean({ message: 'Is open to reviews must be a boolean' })
  readonly isOpenToReviews?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Minimum age must be a number' })
  readonly minAge?: number;

  @IsOptional()
  @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
  readonly authorId?: string;

  @IsOptional()
  @IsString({ message: 'Cover image URL must be a string' })
  readonly coverImageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Published date must be a valid date' })
  readonly publishedDate?: Date;
}
