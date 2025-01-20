import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './schemas/dtos/create-book-dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BooksService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    await newBook.save();
    return newBook;
  }

  async updateBook(updatedData: any, id: string): Promise<Book> {
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true },
    );

    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  async getAllBooks(
    page: number,
    limit: number,
  ): Promise<{
    books: Book[];
    pagination: { currentPage: number; totalPages: number; totalItems: number };
  }> {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.bookModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.bookModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  }

  async deleteBook(bookId: string) {
    const result = await this.bookModel.findByIdAndDelete(bookId);
    return result;
  }

  async getBookByISBN(isbn: string) {
    const book = await this.bookModel.findOne({ isbn: isbn });
    if (!book) {
      throw new NotFoundException(`book with isbn : ${isbn} not found !`);
    }
    return book;
  }

  async getBookById(id: string) {
    const book = await this.bookModel.findById(id);
    return book;
  }

  async getPublishRate(): Promise<number> {
    const totalNumberOfBooks = await this.bookModel.find().countDocuments();
    if (totalNumberOfBooks === 0) {
      return 0;
    }
    const numberOfPublishedBooks = await this.bookModel.countDocuments({
      isPublished: true,
    });

    const percentage = (numberOfPublishedBooks / totalNumberOfBooks) * 100;
    return Math.round(percentage * 100) / 100;
  }

  async publishUnpublish(
    bookId: string,
    publish: boolean,
  ): Promise<Book | string> {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new NotFoundException(`book with id : ${bookId} not found`);
    }
    if (publish) {
      if (book.isPublished) {
        return 'book is already published';
      }
      book.isPublished = true;
    } else if (!publish) {
      if (!book.isPublished) {
        return 'book is already unpublished';
      }
      book.isPublished = false;
    }
    await book.save();
    return book;
  }

  async getPublishedBooks(
    language: 'en' | 'ar',
    page = 1,
    limit = 10,
    genre?: string,
  ): Promise<{
    books: Array<{
      title: string;
      description: string;
      genre: string;
      coverImageUrl: string;
      isBorrowable: boolean;
    }>;
    totalPages: number;
    totalBooks: number;
  }> {
    const filter: any = {
      isPublished: true,
    };

    if (genre) {
      filter.genre = genre;
    }

    const skip = (page - 1) * limit;

    const books = await this.bookModel
      .find(filter)
      .sort({ numberOfAvailableCopies: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        [`title.${language}`]: 1,
        [`description.${language}`]: 1,
        genre: 1,
        coverImageUrl: 1,
        isBorrowable: 1,
      })
      .exec();

    const totalBooks = await this.bookModel.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    const formattedBooks = books.map((book) => ({
      title: book.title[language],
      description: book.description[language],
      genre: book.genre,
      coverImageUrl: book.coverImageUrl,
      isBorrowable: book.isBorrowable,
    }));

    return {
      books: formattedBooks,
      totalPages,
      totalBooks,
    };
  }
}
