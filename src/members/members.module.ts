import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberSchema } from './schemas/member.schema';
import { BooksModule } from '../books/books.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
    BooksModule,
    AuthorsModule,
    MailerModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
