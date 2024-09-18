import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { UserRegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { TokenDTO } from './dto/token.dto';
import { UserLoginDTO } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
  ) {}

  async sign({ sub, role }: Omit<JwtPayload, 'exp'>) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.signAsync({ sub, role }, { secret });
  }

  async verify(params: { token: string }) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.verifyAsync<JwtPayload>(params.token, { secret });
  }

  async login(params: { data: UserLoginDTO }): Promise<TokenDTO> {
    const { data } = params;
    const { email, password } = data;

    const user = await this.userService.findByEmail({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const token = await this.sign({ sub: user.id, role: user.role });
    const verified = await this.verify({ token });

    return {
      token,
      expiresAt: new Date(verified.exp * 1000),
    };
  }

  async register(params: { data: UserRegisterDTO }): Promise<TokenDTO> {
    const { data } = params;
    const { email, password } = data;

    data.tags = (data.tags ?? []).slice(0, 10);

    await this.userService.assertUserExistsByEmail(email);

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.userService.create({
      data: { email, password: hashedPassword },
    });

    const token = await this.sign({ sub: user.id, role: user.role });
    const verified = await this.verify({ token });

    return {
      token,
      expiresAt: new Date(verified.exp * 1000),
    };
  }
}
