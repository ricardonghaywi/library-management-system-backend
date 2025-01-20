import { Body, Controller, Post, Get, Put, Param } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './schemas/dtos/create-branch-dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateBranchDto } from './schemas/dtos/update-branch-dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post('create-new')
  async createBranch(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchesService.createBranch(createBranchDto);
  }

  @Get('all')
  async getAllBranches() {
    return await this.branchesService.getAllBranches();
  }

  @Put('update/:id')
  async updateBranch(
    @Param('id') branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    try {
      return await this.branchesService.updateBranch(branchId, updateBranchDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An error occurred while updating the branch.');
    }
  }
}
