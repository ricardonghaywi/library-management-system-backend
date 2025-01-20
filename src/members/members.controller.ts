import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Get,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './schemas/dtos/update-member-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Delete('delete/:id')
  async deleteMember(@Param('id') id: string) {
    const result = await this.membersService.deleteMember(id);
    return {
      message: `member with id : ${id} successfully deleted`,
      data: result,
    };
  }

  @Put('update/:id')
  async updateMember(
    @Param('id') id: string,
    updateMemberDto: UpdateMemberDto,
  ) {
    const updatedMember = await this.membersService.updateMember(
      id,
      updateMemberDto,
    );

    return {
      message: `Member with ID ${id} updated successfully`,
      data: updatedMember,
    };
  }

  @Get('all')
  async getAllMembers() {
    const members = await this.membersService.getAllMembers();
    return {
      message: 'members successfully fetched',
      data: members,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('borrow-book/:memberId/:branchId')
  async borrowBook(
    @Body('bookISBN') bookIsbn: string,
    @Param('memberId') memberId: string,
    @Param('branchId') branchId: string,
  ) {
    const result = await this.membersService.borrowBook(
      bookIsbn,
      memberId,
      branchId,
    );
    return {
      message: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('subscribe-unsubscribe/:memberid')
  async subscribeUnsubscribe(
    @Param('memberid') memberid: string,
    @Body('bookISBN') bookISBN: string,
    @Body('sub') sub: boolean,
  ) {
    return this.membersService.subscribeUnsubscribe(bookISBN, memberid, sub);
  }

  @Get('average-return-rate')
  async getAverageReturnRate(): Promise<number> {
    return this.membersService.getAverageReturnRate();
  }

  @UseGuards(JwtAuthGuard)
  @Put('return-book/:memberId')
  async returnBook(
    @Body('bookISBN') bookISBN: string,
    @Param('memberId') memberId: string,
    @Param('branchId') branchId: string,
  ): Promise<{ message: string }> {
    const result = await this.membersService.returnBook(
      bookISBN,
      memberId,
      branchId,
    );
    return {
      message: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('borrowed-books/:memberId')
  async getBorrowedBooks(@Param('memberId') memberId: string): Promise<
    {
      borrowedBookId: string;
      title: { en: string; ar?: string };
      isReturned: boolean;
      daysLeft: number | null;
      warningFlag: boolean;
      expiredFlag: boolean;
    }[]
  > {
    return this.membersService.getBorrowedBooks(memberId);
  }
}
