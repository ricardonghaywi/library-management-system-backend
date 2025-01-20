import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './schemas/dtos/create-author-dto';
import { UpdateAuthorDto } from './schemas/dtos/update-author-dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  async addAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    const newAuthor = await this.authorsService.addAuthor(createAuthorDto);
    return { message: 'Author added successfully', data: newAuthor };
  }

  @Put('update/:id')
  async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    const updatedAuthor = await this.authorsService.updateAuthor(
      id,
      updateAuthorDto,
    );
    return {
      message: `Author with ID ${id} updated successfully`,
      data: updatedAuthor,
    };
  }

  @Delete('delete/:id')
  async deleteAuthor(@Param('id') id: string) {
    const deletedAuthor = await this.authorsService.deleteAuthor(id);
    return {
      message: `Author with ID ${id} deleted successfully`,
      data: deletedAuthor,
    };
  }

  @Get('get-by-id/:id')
  async getAuthorById(@Param('id') id: string) {
    const author = await this.authorsService.getAuthorById(id);
    return { message: `Details for author with ID ${id}`, data: author };
  }

  @Get('profile/:id')
  async getAuthorProfileById(
    @Param('id') id: string,
    @Headers('language') language: string,
  ) {
    const author = await this.authorsService.getAuthorProfileById(id, language);
    return { message: 'author successfully fetched', data: author };
  }

  @Get('all')
  async getAllAuthors(@Query('page') page = 1, @Query('limit') limit = 10) {
    const result = await this.authorsService.getAllAuthors(page, limit);

    return {
      message: 'Successfully fetched authors',
      count: result.authors.length,
      pagination: result.pagination,
      data: result.authors,
    };
  }
}
