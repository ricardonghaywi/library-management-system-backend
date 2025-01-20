import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty({ message: 'Branch name is required' })
  branchName: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;
}
