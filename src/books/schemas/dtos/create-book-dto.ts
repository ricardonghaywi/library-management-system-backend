import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TitleDescriptionDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsOptional()
  @IsString()
  ar?: string;
}

export class CreateBookDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TitleDescriptionDto)
  readonly title: TitleDescriptionDto;

  @IsNotEmpty()
  @IsString()
  readonly isbn: string;

  @IsNotEmpty()
  @IsString()
  readonly genre: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TitleDescriptionDto)
  readonly description: TitleDescriptionDto;

  @IsNotEmpty()
  @IsNumber()
  readonly numberOfAvailableCopies: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly isBorrowable: boolean;

  @IsOptional()
  @IsNumber()
  readonly numberOfBorrowableDays?: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly isOpenToReviews: boolean;

  @IsNotEmpty()
  @IsNumber()
  readonly minAge: number;

  @IsNotEmpty()
  @IsMongoId()
  readonly authorId: string;

  @IsOptional()
  @IsString()
  readonly coverImageUrl?: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readonly publishedDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  readonly isPublished: boolean;
}
