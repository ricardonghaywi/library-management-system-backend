import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.schema';
import * as moment from 'moment';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel('Author') private readonly authorModel: Model<Author>,
  ) {}

  async addAuthor(authorData: any): Promise<Author> {
    const newAuthor = new this.authorModel(authorData);
    await newAuthor.save();
    return newAuthor;
  }

  async updateAuthor(id: string, updatedData: any): Promise<Author> {
    const updatedAuthor = await this.authorModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true },
    );
    if (!updatedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return updatedAuthor;
  }

  async deleteAuthor(id: string): Promise<Author> {
    const deletedAuthor = await this.authorModel.findByIdAndDelete(id);
    if (!deletedAuthor) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return deletedAuthor;
  }

  async getAuthorById(id: string): Promise<Author> {
    const author = await this.authorModel.findById(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async getAllAuthors(
    page: number,
    limit: number,
  ): Promise<{
    authors: Author[];
    pagination: { currentPage: number; totalPages: number; totalItems: number };
  }> {
    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      this.authorModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.authorModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      authors,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  }

  async getAuthorProfileById(id: string, language: string) {
    const author = await this.authorModel
      .findById(id)
      .select('-_id -createdAt -updatedAt -__v');
    if (!author) {
      throw new NotFoundException('author not found ');
    }

    const age = moment().diff(moment(author.birthDate), 'years');
    const authorWithAgeAndLanguage = {
      ...author.toObject(),
      age,
      name: author.name[language],
      biography: author.biography[language],
    };

    return authorWithAgeAndLanguage;
  }
}
