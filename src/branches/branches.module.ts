import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
