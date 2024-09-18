import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/login.dto';
import { UserRegisterDTO } from './dto/register.dto';
import { TokenDTO } from './dto/token.dto';
import { Serialize } from '../../../../libs/common/src/interceptors/serialize.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: TokenDTO })
  @Serialize(TokenDTO)
  @Post('login')
  async login(@Body() data: UserLoginDTO) {
    return this.authService.login({ data });
  }

  @ApiOkResponse({ type: TokenDTO })
  @Serialize(TokenDTO)
  @Post('register')
  async register(@Body() data: UserRegisterDTO) {
    return this.authService.register({ data });
  }
}
