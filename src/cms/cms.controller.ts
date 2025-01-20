import { Body, Controller, Post } from '@nestjs/common';
import { CmsService } from './cms.service';
import { Role } from 'src/utils/roles';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post('create')
  async createCMSUser(
    @Body('email') email: string,
    @Body('fullname') fullname: string,
    @Body('role') role: Role.intern | Role.administrator,
  ) {
    return await this.cmsService.createCMSUser(email, fullname, role);
  }
}
