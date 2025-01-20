import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './schemas/dtos/create-branch-dto';
import { Branch } from './schemas/branch.schema';
import { NotFoundException } from '@nestjs/common';
import { UpdateBranchDto } from './schemas/dtos/update-branch-dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel('Branch') private readonly branchModel: Model<Branch>,
  ) {}

  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { branchName, address, city } = createBranchDto;
    const newBranch = new this.branchModel({
      branchName,
      location: {
        address,
        city,
      },
    });
    await newBranch.save();
    return newBranch;
  }

  async getAllBranches() {
    const branches = await this.branchModel.find();
    return branches;
  }

  async updateBranch(
    branchId: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(branchId, updateBranchDto, { new: true })
      .exec();

    if (!updatedBranch) {
      throw new NotFoundException(`Branch with ID "${branchId}" not found.`);
    }

    return updatedBranch;
  }
}
