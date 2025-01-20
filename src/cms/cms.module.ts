import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { CMSUserSchema } from '../cms/schemas/CMS.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CMSUser', schema: CMSUserSchema }]),
  ],
  providers: [CmsService],
  controllers: [CmsController],
})
export class CmsModule {}
