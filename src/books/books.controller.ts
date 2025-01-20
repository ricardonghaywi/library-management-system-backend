import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './schemas/dtos/create-book-dto';
import { UpdateBookDto } from './schemas/dtos/update-book-dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    const newBook = await this.booksService.createBook(createBookDto);
    return {
      message: 'Book created successfully',
      data: newBook,
    };
  }

  @Put('update/:id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const newBook = await this.booksService.updateBook(updateBookDto, id);
    return {
      message: 'Book updated successfully',
      data: newBook,
    };
  }

  @Get('all')
  async getAllBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.booksService.getAllBooks(page, limit);

    return {
      message: 'Successfully fetched books',
      count: result.books.length,
      pagination: result.pagination,
      data: result.books,
    };
  }

  @Put('publish-unpublish/:bookId')
  async publishUnpublish(
    @Param('bookId') bookId: string,
    @Body() publish: boolean,
  ) {
    const result = await this.booksService.publishUnpublish(bookId, publish);
    return result;
  }

  @Delete('delete/:bookId')
  async deleteBook(@Param('bookId') bookId: string) {
    const result = await this.booksService.deleteBook(bookId);
    return {
      message: 'book successfully deleted',
      data: result,
    };
  }

  @Get('published')
  async getPublishedBooksPaginated(
    @Query('language') language: 'en' | 'ar' = 'en',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('genre') genre?: string,
  ) {
    return this.booksService.getPublishedBooks(language, +page, +limit, genre);
  }

  @Get('publish-rate')
  async getPublishRate(): Promise<{ publishRate: number }> {
    const rate = await this.booksService.getPublishRate();
    return { publishRate: rate };
  }
}
