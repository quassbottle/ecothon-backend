import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { UserRegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { TokenDTO } from './dto/token.dto';
import { UserLoginDTO } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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

    await this.userService.assertUserNotExistsByEmail(email);

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

  async generateTokenDto(userId: string, role: Role): Promise<TokenDTO> {
    const token = await this.sign({
      sub: userId,
      role: role,
    });
    const verified = await this.verify({ token });
    return {
      expiresAt: new Date(verified.exp * 1000),
      token: token,
    };
  }

  async register(params: { data: UserRegisterDTO }): Promise<TokenDTO> {
    const { data } = params;
    const { email, password, firstName, lastName, middleName } = data;

    if (data.tags) data.tags = data.tags.slice(0, 10);
    else data.tags = [];

    await this.userService.assertUserExistsByEmail(email);

    const user = await this.userService.create({
      data: { email, password, firstName, lastName, middleName },
    });

    const token = await this.sign({ sub: user.id, role: user.role });
    const verified = await this.verify({ token });

    return {
      token,
      expiresAt: new Date(verified.exp * 1000),
    };
  }
}
