import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MembersService } from '../members/members.service';
import { CreateMemberDto } from 'src/members/schemas/dtos/create-member-dto';
import { Member } from 'src/members/schemas/member.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    Email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const member = await this.membersService.findByEmail(Email);
    if (!member) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('wrong password !');
    }

    const payload = { sub: member._id, username: member.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async signUp(createMemberDto: CreateMemberDto): Promise<Member> {
    const { password } = createMemberDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const memberData = { ...createMemberDto, password: hashedPassword };
    return this.membersService.createMember(memberData);
  }
}
