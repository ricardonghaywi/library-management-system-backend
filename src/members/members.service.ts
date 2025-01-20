import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member } from './schemas/member.schema';
import { CreateMemberDto } from './schemas/dtos/create-member-dto';
import { UpdateMemberDto } from './schemas/dtos/update-member-dto';
import { BooksService } from '../books/books.service';
import { calculateAge } from 'src/utils/calculateAge';
import { calculateReturnDate } from 'src/utils/calculateReturnDate';
import { AuthorsService } from 'src/authors/authors.service';
import { MailerService } from 'src/mailer/mailer.service';
import { calculateReturnRate } from '../utils/calculateReturnRate';
import * as moment from 'moment';
import * as crypto from 'crypto';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private readonly bookService: BooksService,
    private readonly authorService: AuthorsService,
    private readonly mailerService: MailerService,
  ) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    const { username, email } = createMemberDto;

    const existingMember = await this.memberModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingMember) {
      throw new ConflictException(
        `Member with username "${username}" or email "${email}" already exists.`,
      );
    }

    try {
      const newMember = new this.memberModel(createMemberDto);
      await newMember.save();
      return newMember;
    } catch (error) {
      throw new BadRequestException('Error creating member: ' + error.message);
    }
  }

  async updateMember(id: string, updateMemberDto: UpdateMemberDto) {
    const updateMember = await this.memberModel.findByIdAndUpdate(
      id,
      updateMemberDto,
      { new: true },
    );
    if (!updateMember) {
      throw new NotFoundException(`member with id : ${id} not found !`);
    }

    return updateMember;
  }

  async deleteMember(id: string) {
    const deletedMember = await this.memberModel.findByIdAndDelete(id);
    if (!deletedMember) {
      throw new NotFoundException(`member with id : ${id} not found`);
    }
    return deletedMember;
  }

  async getAllMembers() {
    const members = await this.memberModel.find();
    return members;
  }

  async borrowBook(bookISBN: string, memberId: string, branchId: string) {
    const member = await this.memberModel.findById(memberId);
    const book = await this.bookService.getBookByISBN(bookISBN);

    if (!member) {
      throw new NotFoundException(`Member with id: ${memberId} not found!`);
    }
    if (!book) {
      throw new NotFoundException(`Book with ISBN: ${bookISBN} not found!`);
    }
    const branchInventory = book.branchInventory.find(
      (inventory) => inventory.branchId.toString() === branchId,
    );

    if (!branchInventory) {
      throw new NotFoundException(
        `Branch with id: ${branchId} does not have this book in inventory.`,
      );
    }

    if (branchInventory.availableCopies <= 0) {
      return `Cannot perform operation, book titled "${book.title}" has no available copies left in the specified branch.`;
    }

    const memberAge = calculateAge(member.birthDate);
    if (memberAge < book.minAge) {
      return `Cannot borrow book, you must be at least ${book.minAge} years old to borrow this book.`;
    }

    if (member.borrowedBooks.length > 0 && member.returnRate < 0.3) {
      return 'Cannot borrow book, your return rate must be at least 30%.';
    }

    if (!book.isBorrowable) {
      return 'Cannot perform operation, this book is not borrowable!';
    }

    const author = await this.authorService.getAuthorById(book.authorId);
    if (!author) {
      throw new NotFoundException(
        `Author with ID: ${book.authorId} not found!`,
      );
    }
    member.borrowedBooks.push({
      borrowedBookId: book._id as Types.ObjectId,
      branchId: branchId,
      borrowedDate: new Date(),
      returnDate: null,
    });

    branchInventory.availableCopies--;

    await member.save();
    await book.save();

    // await this.mailerService.sendMail(
    //   author.email,
    //   'Book Borrowed',
    //   `Your book titled "${book.title}" has been borrowed by ${member.name}.`,
    // );

    return `Book titled "${book.title}" by author ${
      author.name
    } has been successfully borrowed. Return date: ${calculateReturnDate(
      new Date(),
      book.numberOfBorrowableDays,
    )}.`;
  }

  async subscribeUnsubscribe(bookISBN: string, memberId: string, sub: boolean) {
    const book = await this.bookService.getBookByISBN(bookISBN);
    if (!book) {
      return {
        message: `Cannot perform operation, book with ISBN: ${bookISBN} not found!`,
      };
    }

    const member = await this.memberModel.findById(memberId);
    if (!member) {
      return { message: `Member with ID: ${memberId} not found!` };
    }

    const isSubscribed = member.subscribedBooks.some((id) =>
      id.equals(book._id as Types.ObjectId),
    );

    if (sub) {
      if (isSubscribed) {
        return { message: 'You are already subscribed to this book' };
      }

      member.subscribedBooks.push(book._id as Types.ObjectId);
      await member.save();
      return { message: 'Successfully subscribed to the book' };
    } else {
      if (!isSubscribed) {
        return { message: 'You are not subscribed to this book' };
      }

      member.subscribedBooks = member.subscribedBooks.filter(
        (id) => !id.equals(book._id as Types.ObjectId),
      );
      await member.save();
      return { message: 'Successfully unsubscribed from the book' };
    }
  }

  async findByEmail(email: string): Promise<Member | null> {
    const member = await this.memberModel.findOne({ email: email });
    return member;
  }

  async returnBook(
    bookISBN: string,
    memberId: string,
    branchId: string,
  ): Promise<string> {
    const book = await this.bookService.getBookByISBN(bookISBN);
    if (!book) {
      throw new NotFoundException(`Book with ISBN: ${bookISBN} not found!`);
    }

    const member = await this.memberModel.findById(memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID: ${memberId} not found!`);
    }

    const borrowedBook = member.borrowedBooks.find(
      (b) =>
        b.borrowedBookId.toString() === book._id.toString() &&
        b.branchId === branchId, // Ensure the book was borrowed from the specified branch
    );

    if (!borrowedBook) {
      throw new BadRequestException(
        `Book with ISBN: ${bookISBN} was not borrowed by the member from branch ID: ${branchId}.`,
      );
    }

    if (borrowedBook.returnDate) {
      throw new BadRequestException('Book has already been returned.');
    }

    const branchInventory = book.branchInventory.find(
      (inventory) => inventory.branchId.toString() === branchId,
    );

    if (!branchInventory) {
      throw new NotFoundException(
        `Branch with ID: ${branchId} not found in the inventory.`,
      );
    }

    // Update return information
    borrowedBook.returnDate = new Date();
    const currentDate = new Date();
    const borrowedDate = borrowedBook.borrowedDate;
    const returnDate = calculateReturnDate(
      borrowedDate,
      book.numberOfBorrowableDays,
    );

    if (currentDate <= returnDate) {
      member.numberOfBooksReturnedOnTime++;
    }

    member.returnRate = calculateReturnRate(
      member.numberOfBooksReturnedOnTime,
      member.borrowedBooks.filter((b) => b.returnDate).length, // Only count returned books
    );

    // Update branch-specific inventory
    branchInventory.availableCopies++;

    // Mark subdocument as modified
    book.markModified('branchInventory');

    try {
      await book.save();
      await member.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while processing the return. Please try again later.',
      );
    }

    return `Book with ISBN: ${bookISBN} has been successfully returned by member with ID: ${memberId} to branch ID: ${branchId}.`;
  }

  async getBorrowedBooks(memberId: string) {
    const member = await this.memberModel.findById(memberId);

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    const currentDate = moment();

    const borrowedBooksDetails = await Promise.all(
      member.borrowedBooks.map(async (borrowedBook) => {
        const book = await this.bookService.getBookById(
          borrowedBook.borrowedBookId.toString(),
        );

        if (!book) {
          console.warn(
            'Book not found for borrowedBookId: ',
            borrowedBook.borrowedBookId,
          );
          return null;
        }

        const borrowedDate = moment(borrowedBook.borrowedDate);
        const returnDate = borrowedBook.returnDate
          ? moment(borrowedBook.returnDate)
          : null;
        const dueDate = borrowedDate
          .clone()
          .add(book.numberOfBorrowableDays, 'days');

        if (returnDate) {
          return {
            borrowedBookId: borrowedBook.borrowedBookId.toString(),
            title: book.title,
            isReturned: true,
            daysLeft: null,
            warningFlag: false,
            expiredFlag: false,
          };
        }

        const daysLeft = Math.ceil(
          (dueDate.valueOf() - currentDate.valueOf()) / (1000 * 60 * 60 * 24),
        );
        const hoursLeft = Math.ceil(
          (dueDate.valueOf() - currentDate.valueOf()) / (1000 * 60 * 60),
        );

        const warningFlag = hoursLeft <= 12 && hoursLeft > 0;
        const expiredFlag = currentDate.isAfter(dueDate);

        return {
          borrowedBookId: borrowedBook.borrowedBookId.toString(),
          title: book.title,
          isReturned: false,
          daysLeft,
          warningFlag,
          expiredFlag,
        };
      }),
    );

    return borrowedBooksDetails.filter((details) => details !== null);
  }

  async getAverageReturnRate(): Promise<number> {
    const members = await this.memberModel.find();
    if (members.length === 0) {
      return 0; // No members, so return rate is 0
    }
    let sumOfReturnRates = 0;
    for (const member of members) {
      sumOfReturnRates += member.returnRate || 0;
    }

    const average = sumOfReturnRates / members.length;
    return average;
  }

  async sendOtp(email: string): Promise<string> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = moment().add(15, 'minutes').toDate();

    const member = await this.memberModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true },
    );

    if (!member) {
      throw new NotFoundException(`Member with email ${email} not found!`);
    }

    // Use your mailer service here
    await this.mailerService.sendMail(
      email,
      'Your OTP Code',
      `Your OTP is ${otp}. It expires in 15 minutes.`,
    );

    return `OTP sent to ${email}`;
  }

  async verifyOtp(email: string, otp: string): Promise<string> {
    const member = await this.memberModel.findOne({ email, otp });

    if (!member || member.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    member.emailVerified = true;
    member.otp = null;
    member.otpExpiry = null;

    await member.save();

    return 'Email successfully verified';
  }
}
