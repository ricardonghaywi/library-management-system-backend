import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CMSUser } from './schemas/CMS.schema';
import { Role } from 'src/utils/roles';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel('CMSUser') private readonly cmsUserModel: Model<CMSUser>,
  ) {}

  async createCMSUser(
    email: string,
    fullname: string,
    role: Role.intern | Role.administrator,
  ) {
    if (![Role.intern, Role.administrator].includes(role)) {
      throw new BadRequestException(
        'Invalid role. Role must be "intern" or "administrator".',
      );
    }

    const existingUser = await this.cmsUserModel.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }
    const newUser = new this.cmsUserModel({ email, fullname, role });
    return await newUser.save();
  }
}
