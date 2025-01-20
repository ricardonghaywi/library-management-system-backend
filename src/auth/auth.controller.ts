import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from 'src/members/schemas/dtos/create-member-dto';
import { Member } from 'src/members/schemas/member.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('Email') Email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(Email, password);
  }

  @Post('signup')
  async signUp(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.authService.signUp(createMemberDto);
  }
}
